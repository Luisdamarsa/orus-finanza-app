#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ORUS · Generador de Informe Anual (Análisis Financiero)
=======================================================
Reproduce EXACTAMENTE el informe de 3 páginas (letra, colores, layout) para
cualquier año/usuario. El DISEÑO y los NÚMEROS son deterministas (este código);
la NARRATIVA (veredicto, comportamiento, logros, recomendaciones) la genera una
IA a partir de las métricas reales de cada año.

Pipeline:  transacciones crudas + presupuestos
           -> compute_metrics()          (determinista, números)
           -> generate_analysis()        (IA, narrativa)  [o fallback determinista]
           -> render_html()              (plantilla ORUS exacta)
           -> to_pdf()                   (WeasyPrint, A4, 3 páginas)
           -> [enviar por correo]

Dependencias:  pip install weasyprint
Uso demo:      python3 orus_annual_report.py   (usa transactions_2025.json + budgets.json)
"""

import json, math, datetime, calendar, os

# ============================================================================
# 1. DESIGN TOKENS  (fuente de verdad del diseño ORUS — NO cambiar sin querer)
# ============================================================================
ORDER      = ["fijos", "deuda", "ahorro", "ocio", "varios"]
LABEL      = {"fijos":"Fijos","deuda":"Deuda","ahorro":"Ahorro","ocio":"Ocio","varios":"Varios"}
PASTEL     = {"fijos":"#93C5FD","deuda":"#FCA5A5","ahorro":"#86EFAC","ocio":"#C4B5FD","varios":"#FDE68A"}  # donut/barras
PILBG      = {"fijos":"#EFF6FF","deuda":"#FEF2F2","ahorro":"#F0FDF4","ocio":"#F5F3FF","varios":"#FFFBEB"}  # chips fondo
PILTX      = {"fijos":"#2563EB","deuda":"#DC2626","ahorro":"#16A34A","ocio":"#7C3AED","varios":"#B45309"}  # chips texto
MESES      = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
MESES_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto",
              "Septiembre","Octubre","Noviembre","Diciembre"]
METHOD_COLOR = {"Banco":"#64748B","Tarjeta":"#4F8EF7","Nequi":"#9B6DFF",
                "Llave":"#D97706","Efectivo":"#16A34A","Voz":"#22C55E"}
# Métodos canónicos vigentes del modelo ORUS (para la nota de la sección Adopción)
METODOS_VIGENTES = ["Llave", "Banco", "Tarjeta", "Efectivo"]
ACCENT = "#9B6DFF"

# Logo SVG ORUS - stroke-dasharray gigante (proporciones 35/15/20/15/15)
LOGO_SVG_NEW = '''<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
  <!-- Fijos 35% (Azul) -->
  <circle cx="200" cy="200" r="150" fill="none" stroke="#93C5FD" stroke-width="48" stroke-linecap="round" stroke-dasharray="329.87 942.48" stroke-dashoffset="0" transform="rotate(-90 200 200)"/>
  <!-- Deuda 15% (Rojo) -->
  <circle cx="200" cy="200" r="150" fill="none" stroke="#FCA5A5" stroke-width="48" stroke-linecap="round" stroke-dasharray="141.37 942.48" stroke-dashoffset="-329.87" transform="rotate(-90 200 200)"/>
  <!-- Ahorro 20% (Verde) -->
  <circle cx="200" cy="200" r="150" fill="none" stroke="#86EFAC" stroke-width="48" stroke-linecap="round" stroke-dasharray="188.50 942.48" stroke-dashoffset="-471.24" transform="rotate(-90 200 200)"/>
  <!-- Ocio 15% (Púrpura) -->
  <circle cx="200" cy="200" r="150" fill="none" stroke="#C4B5FD" stroke-width="48" stroke-linecap="round" stroke-dasharray="141.37 942.48" stroke-dashoffset="-659.74" transform="rotate(-90 200 200)"/>
  <!-- Varios 15% (Amarillo) -->
  <circle cx="200" cy="200" r="150" fill="none" stroke="#FDE68A" stroke-width="48" stroke-linecap="round" stroke-dasharray="141.37 942.48" stroke-dashoffset="-801.11" transform="rotate(-90 200 200)"/>
  <!-- Centro blanco -->
  <circle cx="200" cy="200" r="80" fill="white"/>
  <!-- ORUS texto -->
  <text x="200" y="230" font-size="80" font-weight="800" fill="#9B6DFF" text-anchor="middle">ORUS</text>
</svg>'''

def money(n):  return "$" + f"{int(round(n)):,}".replace(",", ".")
def moneyM(n): return f"${n/1_000_000:.2f}M"

def report_filename(kind, year=None, months=None, month=None):
    """Nombre de archivo consistente, con prefijo ORUS. Ejemplos:
      report_filename("anual", year=2025)                    -> Informe_ORUS_Anual_2025.pdf
      report_filename("trimestral", months=[(2025,3),(2025,4),(2025,5)])
                                                             -> Informe_ORUS_Trimestral_Mar-May_2025.pdf
      report_filename("mensual", year=2025, month=4)         -> Informe_ORUS_Mensual_Abril2025.pdf
    """
    if kind == "anual":
        return f"Informe_ORUS_Anual_{year}.pdf"
    if kind == "trimestral":
        a, b = months[0], months[-1]
        return f"Informe_ORUS_Trimestral_{MESES[a[1]-1]}-{MESES[b[1]-1]}_{b[0]}.pdf"
    if kind == "mensual":
        return f"Informe_ORUS_Mensual_{MESES_FULL[month-1]}{year}.pdf"
    return "Informe_ORUS.pdf"


# ============================================================================
# PRESUPUESTOS VIGENTES POR MES  (soporta presupuestos que varían mes a mes)
# ============================================================================
# Modelo de entrada:
#   budgets = {
#     "pillars":    {pilar: monto_mensual|None},          # presupuesto por defecto
#     "categories": {...},
#     "pillars_by_month": { "2026-04": {ocio: 600000} }   # OPCIONAL · overrides por mes
#   }
# Si un mes no tiene override para un pilar, se usa el valor de "pillars".
# En producción, el backend resuelve el `historial` de la app a este mapa por mes.
def budget_for(budgets, pillar, year, month):
    """Presupuesto vigente de un pilar en un mes concreto (override o valor por defecto)."""
    ov = budgets.get("pillars_by_month", {}).get(f"{year}-{month:02d}", {})
    if pillar in ov:
        return ov[pillar]
    return budgets["pillars"].get(pillar)

def budget_sum(budgets, pillar, months):
    """Suma del presupuesto de un pilar a lo largo de una lista de (año, mes).
    Devuelve None si el pilar no tiene presupuesto (p. ej. Varios)."""
    if budgets["pillars"].get(pillar) is None:
        return None
    return sum((budget_for(budgets, pillar, y, m) or 0) for (y, m) in months)

def budget_changes(budgets, months):
    """Detecta pilares cuyo presupuesto CAMBIÓ dentro del periodo.
    Devuelve [{pillar, changes:[{mes, from, to}]}] (solo los que variaron)."""
    res = []
    for p in ["fijos", "deuda", "ahorro", "ocio"]:
        if budgets["pillars"].get(p) is None:
            continue
        seq = [(budget_for(budgets, p, y, m), (y, m)) for (y, m) in months]
        chgs = []
        for i in range(1, len(seq)):
            if seq[i][0] != seq[i-1][0]:
                chgs.append({"mes": MESES[seq[i][1][1]-1], "from": seq[i-1][0], "to": seq[i][0]})
        if chgs:
            res.append({"pillar": p, "changes": chgs})
    return res


# ============================================================================
# 2. CÁLCULOS DETERMINISTAS
# ============================================================================
def compute_metrics(transactions, budgets, year):
    """
    transactions: lista de dicts con al menos:
        {date:'YYYY-MM-DD', amount:int (neg=gasto, pos=ingreso),
         pillar:'fijos|deuda|ahorro|ocio|varios|ingreso',
         category:'Nombre Categoría' (None para ingresos), method:'Banco|Tarjeta|...'}
    budgets: {'pillars': {pilar: monto_mensual|None}, 'categories': {...}}
    year: int
    Devuelve un dict `metrics` con TODO lo que necesita el informe.
    """
    tx  = [t for t in transactions if str(t["date"]).startswith(f"{year}-")]
    gastos  = [t for t in tx if t["amount"] < 0]
    ingresos = [t for t in tx if t["amount"] > 0]
    pil_bud = budgets["pillars"]

    ingTot = sum(t["amount"] for t in ingresos)
    byPil  = {p: 0 for p in ORDER}
    for t in gastos:
        if t["pillar"] in byPil:
            byPil[t["pillar"]] += -t["amount"]
    gasTot = sum(byPil.values())
    liq    = ingTot - gasTot
    ahf    = byPil["ahorro"]

    # gasto mensual por pilar
    monthly = {m: {p: 0 for p in ORDER} for m in range(1, 13)}
    for t in gastos:
        m = int(t["date"][5:7])
        if t["pillar"] in ORDER:
            monthly[m][t["pillar"]] += -t["amount"]

    months12 = [(year, m) for m in range(1, 13)]
    # semáforo: % gasto_mes / presupuesto VIGENTE ese mes (pilares con presupuesto)
    budgeted = [p for p in ["fijos","deuda","ahorro","ocio"] if pil_bud.get(p) is not None]
    semaforo, cells, within = {}, 0, 0
    for p in budgeted:
        semaforo[p] = []
        for m in range(1, 13):
            b = budget_for(budgets, p, year, m) or 0
            pct = round(monthly[m][p] / b * 100) if b else 0
            semaforo[p].append(pct)
            cells += 1
            # "dentro" = positivo: gasto<=100% en general; en ahorro, >=100% también es bueno
            ok = pct <= 100 if p != "ahorro" else True
            if ok: within += 1
    cumplPct = round(within / cells * 100) if cells else 0

    # cumplimiento anual por pilar (presupuesto del periodo = suma de los meses)
    cumpl = {}
    for p in ORDER:
        anual = byPil[p]
        bud_period = budget_sum(budgets, p, months12)          # None si no tiene presupuesto
        cumpl[p] = {
            "prom": round(anual/12),
            "budMonthly": round(bud_period/12) if bud_period is not None else None,  # promedio mensual
            "anual": anual,
            "desfaseAnual": (anual - bud_period) if bud_period is not None else None,
        }

    # top categorías (por total gastado)
    cat = {}
    for t in gastos:
        k = t.get("category") or "—"
        c = cat.setdefault(k, {"n":0,"tot":0,"pillar":t["pillar"],"byMonth":{}})
        c["n"] += 1; c["tot"] += -t["amount"]
        mm = int(t["date"][5:7]); c["byMonth"][mm] = c["byMonth"].get(mm,0) + -t["amount"]
    topCats = []
    for name, v in cat.items():
        pk = max(v["byMonth"], key=v["byMonth"].get)
        topCats.append({"name":name,"pillar":LABEL[v["pillar"]],"n":v["n"],"tot":v["tot"],
                        "pico":f"{MESES[pk-1]} ({money(v['byMonth'][pk])})"})
    topCats.sort(key=lambda c: -c["tot"])

    # adopción por método (sobre gastos)
    met = {}
    for t in gastos:
        met[t["method"]] = met.get(t["method"], 0) + 1
    totMet = sum(met.values()) or 1
    pctMet = {k: round(v/totMet*100, 1) for k, v in met.items()}

    # momentos del año
    tot_m = {m: sum(monthly[m][p] for p in ORDER) for m in range(1, 13)}
    def peak(f):  return max(range(1,13), key=f)
    def trough(f): return min(range(1,13), key=f)
    moments = {
        "mayor_gasto":   {"mes":MESES_FULL[peak(lambda m:tot_m[m])-1],           "val":tot_m[peak(lambda m:tot_m[m])]},
        "mayor_deuda":   {"mes":MESES_FULL[peak(lambda m:monthly[m]['deuda'])-1], "val":monthly[peak(lambda m:monthly[m]['deuda'])]['deuda']},
        "mejor_ahorro":  {"mes":MESES_FULL[peak(lambda m:monthly[m]['ahorro'])-1],"val":monthly[peak(lambda m:monthly[m]['ahorro'])]['ahorro']},
        "mayor_ocio":    {"mes":MESES_FULL[peak(lambda m:monthly[m]['ocio'])-1],  "val":monthly[peak(lambda m:monthly[m]['ocio'])]['ocio']},
        "mas_austero":   {"mes":MESES_FULL[trough(lambda m:tot_m[m])-1],          "val":tot_m[trough(lambda m:tot_m[m])]},
    }

    # ---- Índice de Salud Financiera (0-100) ----
    savingsRate = (ahf + liq) / ingTot if ingTot else 0          # ahorro efectivo
    scoreA = min(100, round(savingsRate / 0.30 * 100))           # 30% = tope
    scoreB = cumplPct                                            # % pilar-mes dentro
    ic = gasTot and ingTot / gasTot or 0                         # cobertura
    scoreC = max(0, min(100, round((ic - 1) / (1.5 - 1) * 100))) # 1.0->0 ; 1.5->100
    health = round(0.40*scoreA + 0.35*scoreB + 0.25*scoreC)      # ponderación fija

    ahorro_bud_anual = budget_sum(budgets, "ahorro", months12) or 0

    return {
        "year": year,
        "ingTot": ingTot, "gasTot": gasTot, "liquidez": liq, "ahorroFormal": ahf,
        "ahorroBudAnual": ahorro_bud_anual,
        "byPil": byPil,
        "pctByPil": {p: round(byPil[p]/ingTot*100, 1) if ingTot else 0 for p in ORDER},
        "pctGastoByPil": {p: round(byPil[p]/gasTot*100, 1) if gasTot else 0 for p in ORDER},
        "necesidadesPct": round((byPil["fijos"]+byPil["deuda"])/ingTot*100,1) if ingTot else 0,
        "deseosPct": round((byPil["ocio"]+byPil["varios"])/ingTot*100,1) if ingTot else 0,
        "liqPct": round(liq/ingTot*100,1) if ingTot else 0,
        "gastoPctIngreso": round(gasTot/ingTot*100,1) if ingTot else 0,
        "monthly": monthly, "semaforo": semaforo, "cumplPct": cumplPct, "cumpl": cumpl,
        "budgetChanges": budget_changes(budgets, months12),
        "topCats": topCats, "met": met, "pctMet": pctMet, "totMet": totMet,
        "moments": moments,
        "health": health, "scoreA": scoreA, "scoreB": scoreB, "scoreC": scoreC,
        "savingsRate": round(savingsRate*100, 1), "ic": round(ic, 2),
        "nTx": len(tx), "nGastos": len(gastos), "nIng": len(ingresos),
    }


# ============================================================================
# 3. CAPA DE ANÁLISIS POR IA
# ============================================================================
# Esquema JSON que la IA DEBE devolver (validar antes de renderizar):
ANALYSIS_SCHEMA = {
    "verdict": {"label": "str (1-2 palabras: Excelente/Sólido/Mejorable/En riesgo)",
                "sub": "str (<= 90 caracteres)"},
    "diagnostico_extra": "str (1 frase, se anexa a la conclusión numérica; HTML <b> permitido)",
    "comportamiento": {"fijos":"str","deuda":"str","ahorro":"str","ocio":"str","varios":"str"},
    "logros": [{"titulo":"str","detalle":"str"}],          # 3-4 items
    "recomendaciones": [{"titulo":"str","detalle":"str"}], # 3-5 items
}

# --- Prompts EDITABLES ---------------------------------------------------
# Fuente de verdad: `prompts.json` (junto a este archivo). Editable sin tocar
# código. Si falta el archivo, se usan estos valores de fábrica como respaldo.
_DEFAULT_PROMPTS = {
  "base_system": (
    "Eres el analista financiero de ORUS, una app de finanzas personales de Latinoamérica.\n"
    "Escribes en español, tono directo, motivador pero honesto; frases cortas, precisión > prosa.\n"
    "Recibes un objeto DATA con los datos YA calculados del periodo. NO recalcules ni inventes cifras: "
    "usa exactamente las que están en DATA. Cita montos con separador de miles (ej: $1.635.000).\n\n"
    "Reglas de dominio ORUS:\n"
    "- Pilares: Fijos, Deuda, Ahorro, Ocio, Varios. Refiérete a ellos por nombre, nunca por id.\n"
    "- En el pilar AHORRO, superar el presupuesto es POSITIVO (ahorró más de lo planeado). En los demás es negativo.\n"
    "- \"Varios\" no tiene presupuesto (sin límite): se analiza por gasto/tendencia, no por cumplimiento.\n"
    "- Liquidez libre = ingreso no gastado; es superávit disponible.\n"
    "- El informe SIEMPRE cubre un periodo YA CERRADO (mes/trimestre/año vencido); el usuario lo lee después "
    "de que terminó. NUNCA hables como si el periodo siguiera en curso (prohibido \"el resto del mes\", \"aún "
    "puedes\", \"ya mismo\", \"todavía a tiempo\" o acciones dentro del periodo). Hechos en pasado; "
    "recomendaciones SIEMPRE hacia el PRÓXIMO periodo.\n\n"
    "Devuelve ÚNICAMENTE un JSON válido (sin texto extra, sin markdown). Los campos de texto pueden usar "
    "<b>...</b> para resaltar cifras. Sigue el esquema que indique la instrucción del informe."
  ),
  "instrucciones": {
    "annual": (
      "Informe ANUAL (12 meses). Devuelve JSON con esta forma:\n"
      "{\n"
      ' "verdict": {"label": "Excelente|Sólido|Mejorable|En riesgo", "sub": "resumen <=90 chars"},\n'
      ' "diagnostico_extra": "1 frase que complementa la conclusión",\n'
      ' "comportamiento": {"fijos":"...","deuda":"...","ahorro":"...","ocio":"...","varios":"..."},\n'
      ' "logros": [{"titulo":"...","detalle":"..."}],            // 3 a 4\n'
      ' "recomendaciones": [{"titulo":"...","detalle":"..."}]    // 3 a 5, para el próximo año\n'
      "}\n"
      "Cada \"comportamiento\" = 1 frase corta evaluando ese pilar (usa cumpl/semaforo)."
    ),
    "quarterly": (
      "Informe TRIMESTRAL (3 meses), tono operativo/correctivo. Devuelve JSON con: verdict{label,sub}, "
      "diagnostico_extra, muro:[{tipo:'logro'|'alerta',titulo,detalle}] (2 logros + 2 alertas), "
      "recomendaciones:[{titulo,detalle}] (3, tácticas para el próximo trimestre). Usa las cifras de metrics/comparativa."
    ),
    "monthly": (
      "Informe MENSUAL táctico (\"tu mes en números\"). Devuelve JSON con: verdict{label,sub}, "
      "alertas:[{titulo,detalle}] (máx 4; lo que se salió de control ese mes; si no hubo, lista vacía), "
      "recomendaciones:[{titulo,detalle}] (3, acciones concretas para el PRÓXIMO mes). Tono operativo, de acción."
    ),
  },
}

def load_prompts():
    """Carga prompts.json (editable) si existe; si no, usa los valores de fábrica."""
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prompts.json")
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return _DEFAULT_PROMPTS

PROMPTS = load_prompts()
SYSTEM_PROMPT = PROMPTS["base_system"]          # compat: nombre usado por los 3 informes

def build_analysis_messages(metrics):
    """Mensajes para el LLM del informe ANUAL (system base + instrucción anual + DATA)."""
    instruccion = PROMPTS["instrucciones"]["annual"]
    user = instruccion + "\n\nDATA:\n" + json.dumps(metrics, ensure_ascii=False)
    return [{"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user}]

def generate_analysis(metrics, llm_call=None):
    """
    llm_call: función opcional (messages)->str que llama a tu LLM (OpenAI/Anthropic)
              y devuelve el string JSON. Si es None, usa el fallback determinista.
    """
    if llm_call is not None:
        messages = build_analysis_messages(metrics)
        raw = llm_call(messages)
        data = json.loads(raw)          # valida que sea JSON
        _validate_analysis(data)        # valida forma mínima
        return data
    return default_analysis(metrics)

def _validate_analysis(a):
    for k in ("verdict","comportamiento","logros","recomendaciones"):
        if k not in a: raise ValueError(f"Falta '{k}' en el análisis de la IA")
    for p in ORDER:
        a["comportamiento"].setdefault(p, "")

def default_analysis(m):
    """Fallback 100% determinista (sin IA) para pruebas / modo offline."""
    c = m["cumpl"]; sem = m["semaforo"]
    def exc(p):
        return sum(1 for v in sem.get(p, []) if v > 100)
    def sup(p):
        return sum(1 for v in sem.get(p, []) if v >= 100)
    if   m["health"] >= 85: label = "Excelente"
    elif m["health"] >= 70: label = "Sólido"
    elif m["health"] >= 50: label = "Mejorable"
    else:                   label = "En riesgo"
    fijos_txt = "Impecable. " if exc("fijos") == 0 else f"{exc('fijos')} mes(es) sobre el techo. "
    ocio_txt  = "Muy disciplinado. " if exc("ocio") <= 1 else "Revisar. "
    comportamiento = {
        "fijos":  fijos_txt + f"Promedio {money(c['fijos']['prom'])}/mes.",
        "deuda":  f"{exc('deuda')} mes(es) por encima del límite; promedio {money(c['deuda']['prom'])}/mes.",
        "ahorro": f"Único pilar donde exceder es positivo: {sup('ahorro')} mes(es) superó la meta.",
        "ocio":   ocio_txt + f"Promedio {money(c['ocio']['prom'])}/mes.",
        "varios": "Sin presupuesto asignado (sin límite).",
    }
    logros = [
        {"titulo":"Dominio de Fijos",
         "detalle":f"Cerraste el año con {exc('fijos')} meses sobre el límite de gastos fijos."},
        {"titulo":"Ahorro cumplido",
         "detalle":f"Acumulaste {money(m['ahorroFormal'])} en tus metas de ahorro (objetivo {money(m['ahorroBudAnual'])})."},
        {"titulo":"Liquidez disponible",
         "detalle":f"Cerraste con {money(m['liquidez'])} sin comprometer ({m['liqPct']}% del ingreso)."},
        {"titulo":"Salud financiera",
         "detalle":f"Índice de {m['health']}/100: ahorro efectivo {m['savingsRate']}% y cobertura {m['ic']}×."},
    ]
    recomendaciones = [
        {"titulo":"Sincerar presupuestos que se exceden",
         "detalle":"Ajusta al alza los pilares/categorías que superan el techo de forma recurrente para evitar falsas alertas."},
        {"titulo":"Automatizar el aporte de Ahorro",
         "detalle":f"Programa una cuota fija mensual para dar consistencia (hoy promedia {money(m['cumpl']['ahorro']['prom'])})."},
        {"titulo":"Dar destino a la liquidez",
         "detalle":f"Los {money(m['liquidez'])} libres podrían ir en parte a inversión de bajo riesgo."},
        {"titulo":"Planificar picos estacionales",
         "detalle":f"El mayor gasto fue en {m['moments']['mayor_gasto']['mes']}: crea un fondo para amortiguarlo."},
    ]
    return {"verdict":{"label":label,"sub":"Ahorro alto, gasto disciplinado y superávit sólido."},
            "diagnostico_extra":"",
            "comportamiento":comportamiento,"logros":logros,"recomendaciones":recomendaciones}


# ============================================================================
# 4. RENDER  (plantilla ORUS exacta — HTML + CSS)
# ============================================================================
def logo_svg(custom_svg=None):
    if custom_svg:  # inserta aquí el logo real de ORUS (SVG o <img>)
        return f'<div class="logobox">{custom_svg}</div>'
    # Usar el nuevo logo ORUS (35/15/20/25/15 + ORUS text) por defecto
    return f'<div class="logobox">{LOGO_SVG_NEW}</div>'

def _donut(m):
    byPil, gas = m["byPil"], m["gasTot"]
    r=54; C=2*math.pi*r; cx=cy=70; cum=0.0; segs=[]
    for p in ORDER:
        frac = byPil[p]/gas if gas else 0
        dash = max(frac*C-6, 1)
        segs.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{PASTEL[p]}" '
                    f'stroke-width="20" stroke-linecap="round" stroke-dasharray="{dash:.2f} {C-dash:.2f}" '
                    f'stroke-dashoffset="{-cum*C:.2f}" transform="rotate(-90 {cx} {cy})"/>')
        cum += frac
    chips="".join(f'<span class="lg"><span class="dot" style="background:{PASTEL[p]}"></span>'
                  f'{LABEL[p]} <b>{m["pctGastoByPil"][p]}%</b></span>' for p in ORDER)
    return (f'<div class="donutwrap"><svg viewBox="0 0 140 140" width="150" height="150">'
            f'<circle cx="70" cy="70" r="54" fill="none" stroke="#EFEDF7" stroke-width="20"/>{"".join(segs)}</svg>'
            f'<div class="dcenter"><div class="dlabel">GASTADO</div><div class="damount">{money(gas)}</div></div></div>'
            f'<div class="legend">{chips}</div>')

def _bars(m):
    W,H=540,132; padL=34; padB=16; padT=6; plotH=H-padB-padT; plotW=W-padL
    monthly=m["monthly"]; ymax=2500000; bw=plotW/12*0.62; gap=plotW/12
    out=[f'<svg viewBox="0 0 {W} {H}" width="100%" height="{H}">']
    for gy,lab in [(0,"0"),(500000,"$0.5M"),(1000000,"$1M"),(1500000,"$1.5M"),(2000000,"$2M"),(2500000,"$2.5M")]:
        y=padT+plotH-(gy/ymax*plotH)
        out.append(f'<line x1="{padL}" y1="{y:.1f}" x2="{W}" y2="{y:.1f}" stroke="#EFEDF7" stroke-width="1"/>')
        out.append(f'<text x="{padL-4}" y="{y+3:.1f}" font-size="7" fill="#A9A5BC" text-anchor="end">{lab}</text>')
    for i in range(12):
        x=padL+i*gap+(gap-bw)/2; yb=padT+plotH
        for p in ORDER:
            h=monthly[i+1][p]/ymax*plotH; yb-=h
            out.append(f'<rect x="{x:.1f}" y="{yb:.1f}" width="{bw:.1f}" height="{h:.1f}" fill="{PASTEL[p]}"/>')
        out.append(f'<text x="{x+bw/2:.1f}" y="{padT+plotH+11:.1f}" font-size="7" fill="#7B7A99" text-anchor="middle">{MESES[i]}</text>')
    out.append('</svg>')
    lg="".join(f'<span class="lg"><span class="dot" style="background:{PASTEL[p]}"></span>{LABEL[p]}</span>' for p in ORDER)
    return f'<div class="chart">{"".join(out)}</div><div class="legend sm">{lg}</div>'

def _tabla_503020(m):
    byPil,pct,liq,ing=m["byPil"],m["pctByPil"],m["liquidez"],m["ingTot"]
    grp=[("50%",["fijos","deuda"]),("30%",["ocio","varios"]),("20%",["ahorro"])]
    estados={"fijos":"Sano","deuda":"Controlado","ocio":"Optimizado","varios":"Alineado","ahorro":"+ Excedente"}
    rows=""
    for ideal,pil in grp:
        for j,p in enumerate(pil):
            regla=f'<td class="rules" rowspan="{len(pil)}">{ideal}</td>' if j==0 else ""
            rows+=(f'<tr><td><span class="pill" style="background:{PILBG[p]};color:{PILTX[p]}">{LABEL[p]}</span></td>'
                   f'<td class="num">{money(byPil[p])}</td><td class="num">{pct[p]}%</td>'
                   f'{regla}<td><span class="badge">{estados[p]}</span></td></tr>')
    rows+=(f'<tr class="tot"><td>Excedente Libre / Liquidez</td><td class="num">{money(liq)}</td>'
           f'<td class="num">{m["liqPct"]}%</td><td class="rules">—</td><td><span class="badge blue">Disponible</span></td></tr>')
    return (f'<table class="t"><thead><tr><th>Pilar Finanzas</th><th class="num">Gasto Anual</th>'
            f'<th class="num">% del Ingreso</th><th>Regla Ideal</th><th>Estado</th></tr></thead><tbody>{rows}</tbody></table>'
            f'<div class="tnote">"Gasto Anual" = dinero realmente gastado (no presupuestado). '
            f'"% del Ingreso" = gasto del pilar ÷ ingresos totales.</div>')

def _salud(m, verdict):
    def barmini(lbl,val):
        return (f'<div class="hmini"><div class="hml">{lbl}</div>'
                f'<div class="htrack"><div class="hfill" style="width:{val}%"></div></div>'
                f'<div class="hmv">{val}<span class="hpts">pts</span></div></div>')
    lblA = f"Tasa de ahorro efectiva ({m['savingsRate']}%)"
    lblB = f"Cumplimiento de presupuesto ({m['cumplPct']}%)"
    lblC = f"Índice de cobertura ({m['ic']}×)"
    return (f'<div class="healthband">'
            f'<div class="hscore"><div class="hnum">{m["health"]}<span class="hden">/100</span></div>'
            f'<div class="hcap">Índice de Salud<br>Financiera</div></div>'
            f'<div class="hbars"><div class="htitle">Componentes del puntaje (0–100)</div>'
            f'{barmini(lblA, m["scoreA"])}{barmini(lblB, m["scoreB"])}{barmini(lblC, m["scoreC"])}</div>'
            f'<div class="hverdict"><div class="hvbig">{verdict["label"]}</div>'
            f'<div class="hvsub">{verdict["sub"]}</div></div></div>')

def _moments(m):
    M=m["moments"]
    items=[("deuda","Mayor gasto total",M["mayor_gasto"]),("deuda","Mayor pago de deuda",M["mayor_deuda"]),
           ("ahorro","Mejor mes de ahorro",M["mejor_ahorro"]),("ocio","Mayor gasto en ocio",M["mayor_ocio"]),
           ("ahorro","Mes más austero",M["mas_austero"])]
    rows="".join(f'<div class="mom"><span class="dot" style="background:{PASTEL[c]}"></span>'
                 f'<div class="mtxt"><div class="mml">{lbl}</div>'
                 f'<div class="mmv"><b>{d["mes"]}</b> · {money(d["val"])}</div></div></div>' for c,lbl,d in items)
    return f'<div class="momtitle">Momentos del Año</div>{rows}'

def _cumplimiento(m, comportamiento):
    c=m["cumpl"]; rows=""
    for p in ORDER:
        bud=money(c[p]["budMonthly"]) if c[p]["budMonthly"] else "$0 (Sin Límite)"
        d=c[p]["desfaseAnual"]
        if d is None:   des=f'<span class="neu">{money(c[p]["anual"])} ejec.</span>'
        elif d<0:       des=f'<span class="pos">{money(d)} (A favor)</span>'
        else:           des=f'<span class="warnv">+{money(d)} (Extra)</span>'
        rows+=(f'<tr><td><span class="pill" style="background:{PILBG[p]};color:{PILTX[p]}">{LABEL[p]}</span></td>'
               f'<td class="num">{bud}</td><td class="num">{money(c[p]["prom"])}</td>'
               f'<td>{des}</td><td class="cmt">{comportamiento.get(p,"")}</td></tr>')
    return (f'<table class="t"><thead><tr><th>Pilar</th><th class="num">Presup. Mensual</th>'
            f'<th class="num">Prom. Mensual Real</th><th>Desfase Anual</th><th>Comportamiento</th></tr></thead>'
            f'<tbody>{rows}</tbody></table>')

def budget_note_text(changes):
    """Texto plano de los ajustes de presupuesto (reutilizable en los 3 informes)."""
    parts = []
    for c in changes or []:
        ch = c["changes"][-1]   # último cambio del pilar en el periodo
        extra = "" if len(c["changes"]) == 1 else f" (y {len(c['changes'])-1} ajuste(s) más)"
        parts.append(f'<b>{LABEL[c["pillar"]]}</b> {money(ch["from"])}→{money(ch["to"])} desde {ch["mes"]}{extra}')
    return " · ".join(parts)

def _budget_note(changes):
    if not changes: return ""
    return (f'<div class="bchg"><b>Ajustes de presupuesto en el periodo:</b> '
            f'{budget_note_text(changes)}. El semáforo y las metas ya reflejan el presupuesto vigente de cada mes.</div>')

def _semaforo(m):
    sm=m["semaforo"]; pil=[p for p in ["fijos","deuda","ahorro","ocio"] if p in sm]
    def cell(v,inv):
        border=None
        if inv:
            if v>=100: bg,tx,border="#BBF7D0","#15803D","#22C55E"
            elif v>=70: bg,tx="#FEF3C7","#B45309"
            else: bg,tx="#FEE2E2","#DC2626"
        else:
            if v<70: bg,tx="#DCFCE7","#16A34A"
            elif v<=100: bg,tx="#FEF3C7","#B45309"
            else: bg,tx,border="#FEE2E2","#DC2626","#EF4444"
        sh=f";box-shadow:inset 0 0 0 2px {border}" if border else ""
        return f'<td class="sc" style="background:{bg};color:{tx}{sh}">{v}</td>'
    head="".join(f'<th class="sm">{mm}</th>' for mm in MESES)
    rows=""
    for p in pil:
        rows+=(f'<tr><td class="sp"><span class="pill" style="background:{PILBG[p]};color:{PILTX[p]}">{LABEL[p]}</span></td>'
               +"".join(cell(v, p=="ahorro") for v in sm[p])+"</tr>")
    return (f'<table class="sem"><thead><tr><th></th>{head}</tr></thead><tbody>{rows}</tbody></table>'
            f'<div class="semkey"><span><span class="kd" style="background:#DCFCE7"></span>Sano</span>'
            f'<span><span class="kd" style="background:#FEF3C7"></span>En el límite</span>'
            f'<span><span class="kd" style="background:#FEE2E2"></span>Fuera de meta</span>'
            f'<span><span class="kd" style="background:#BBF7D0;box-shadow:inset 0 0 0 2px #22C55E"></span>Ahorro: meta superada</span>'
            f'<span><span class="kd" style="background:#FEE2E2;box-shadow:inset 0 0 0 2px #EF4444"></span>Excedido (&gt;100%)</span>'
            f'<span class="semnote">% = gasto del mes ÷ presupuesto del pilar. Borde = supera el 100% '
            f'(verde en Ahorro es positivo). Varios se excluye (sin límite).</span></div>')

def _topcats(m):
    pmap={v:k for k,v in LABEL.items()}
    rows=""
    for c in m["topCats"][:8]:
        p=pmap[c["pillar"]]
        rows+=(f'<tr><td><b>{c["name"]}</b></td>'
               f'<td><span class="pill" style="background:{PILBG[p]};color:{PILTX[p]}">{c["pillar"]}</span></td>'
               f'<td class="num">{c["n"]} ops</td><td class="num">{money(c["tot"])}</td>'
               f'<td class="pico">{c["pico"]}</td></tr>')
    return (f'<table class="t"><thead><tr><th>Categoría</th><th>Pilar</th><th class="num">Frec.</th>'
            f'<th class="num">Total Acumulado</th><th>Mes Pico</th></tr></thead><tbody>{rows}</tbody></table>')

def _logros(logros):
    return "".join(f'<div class="logro"><div class="lgt">{i+1}. {x["titulo"]}</div>'
                   f'<div class="lgb">{x["detalle"]}</div></div>' for i,x in enumerate(logros[:4]))

def _metodos(m):
    met,pct,tot=m["met"],m["pctMet"],m["totMet"]
    order=sorted(met, key=lambda k:-met[k])
    bars="".join(f'<div class="mrow"><div class="mlbl">{k}</div>'
                 f'<div class="mtrack"><div class="mfill" style="width:{pct[k]}%;background:{METHOD_COLOR.get(k,ACCENT)}"></div></div>'
                 f'<div class="mval">{pct[k]}% · {met[k]}</div></div>' for k in order)
    legacy=[k for k in order if k not in METODOS_VIGENTES]
    nota=(f'Total {tot} transacciones de gasto. El modelo vigente usa <b>{", ".join(METODOS_VIGENTES)}</b>.')
    if legacy: nota+=f' <b>{", ".join(legacy)}</b> aparece en datos históricos.'
    return f'{bars}<div class="mnote">{nota}</div>'

def _recos(recomendaciones):
    return "".join(f'<div class="reco"><div class="rt">{i+1}. {x["titulo"]}</div>'
                   f'<div class="rb">{x["detalle"]}</div></div>' for i,x in enumerate(recomendaciones[:5]))

CSS = """
/* A4 page simulation for screen viewing */
html { background:#ccc; padding:15px; }
body { width:210mm; margin:0 auto 20mm; padding:9mm 11mm 11mm 11mm;
  font-family:Helvetica,Arial,sans-serif; color:#1A1830; font-size:8.7pt; line-height:1.4;
  background:white; box-shadow:0 0 15px rgba(0,0,0,0.2);
  display:flex; flex-direction:column; position:relative; min-height:297mm; }

/* Print styles */
@page { size:A4; margin:9mm 11mm 11mm 11mm; }
@media print {
  html { background:white; padding:0; }
  body { width:100%; height:auto; margin:0; box-shadow:none; padding:0; }
}

* { box-sizing:border-box; }
.pageb { page-break-before:always; }
h1 { font-size:16.5pt; margin:0; letter-spacing:.2px; white-space:nowrap; }
h2 { font-size:12.5pt; margin:10px 0 5px; padding-bottom:4px; border-bottom:2px solid #E5E3F5; }
.sub { color:#7B7A99; font-size:9pt; margin-top:3px; }
p { margin:6px 0; } b { color:#1A1830; }
.header { display:flex; justify-content:space-between; align-items:flex-start;
  background:#F5F3FF; border-left:5px solid #9B6DFF; border-radius:12px; padding:16px 18px; }
.header .l { display:flex; align-items:center; gap:14px; }
.logobox { width:80px; height:80px; background:#fff; border:1px solid #E5E3F5; border-radius:14px;
  display:flex; align-items:center; justify-content:center; flex:0 0 80px; }
.header .r { text-align:right; }
.uname { font-weight:bold; font-size:11pt; }
.chip { display:inline-block; background:#EDE9FB; color:#6D28D9; border-radius:8px;
  padding:3px 10px; font-size:8pt; margin-top:6px; font-weight:bold; }
.pub { color:#A9A5BC; font-size:7.6pt; margin-top:10px; white-space: nowrap; }
.kpis { display:flex; gap:10px; margin-top:10px; }
.kpi { flex:1; border:1px solid #E5E3F5; border-radius:12px; padding:8px 12px; background:#fff; }
.kpi .kl { font-size:7.4pt; color:#7B7A99; font-weight:bold; letter-spacing:.4px; text-transform:uppercase; }
.kpi .kv { font-size:14pt; font-weight:bold; margin:2px 0; }
.kpi .ks { font-size:7.4pt; color:#A9A5BC; }
.kpi.g .kv { color:#16A34A; } .kpi.r .kv { color:#DC2626; } .kpi.p .kv { color:#7C3AED; }
.healthband { display:flex; align-items:center; gap:16px; margin-top:10px;
  background:linear-gradient(90deg,#F5F3FF,#F0FDF4); border:1px solid #E5E3F5; border-radius:12px; padding:9px 16px; }
.hscore { flex:0 0 auto; display:flex; align-items:center; gap:10px; padding-right:16px; border-right:1px solid #E5E3F5; }
.hnum { font-size:30pt; font-weight:bold; color:#9B6DFF; line-height:1; white-space:nowrap; }
.hden { font-size:13pt; color:#A9A5BC; font-weight:bold; }
.hcap { font-size:8.5pt; font-weight:bold; color:#1A1830; }
.hbars { flex:1 1 auto; min-width:0; }
.htitle { font-size:7.2pt; color:#A9A5BC; font-weight:bold; text-transform:uppercase; letter-spacing:.4px; margin-bottom:3px; }
.hmini { display:flex; align-items:center; gap:10px; margin:4px 0; }
.hml { flex:0 0 178px; width:178px; font-size:7.8pt; color:#7B7A99; white-space:nowrap; }
.htrack { flex:1 1 auto; min-width:46px; height:10px; background:#EFEDF7; border-radius:6px; overflow:hidden; }
.hfill { height:100%; background:#9B6DFF; border-radius:6px; min-width:2px; }
.hmv { flex:0 0 42px; width:42px; text-align:right; font-weight:bold; font-size:8.5pt; color:#9B6DFF; }
.hpts { font-size:6.5pt; color:#A9A5BC; font-weight:normal; margin-left:2px; }
.hverdict { flex:0 0 150px; padding-left:14px; border-left:1px solid #E5E3F5; }
.hvbig { font-size:12pt; font-weight:bold; color:#16A34A; }
.hvsub { font-size:7.6pt; color:#7B7A99; }
.mompanel { background:#FAFAFE; border:1px solid #E5E3F5; border-radius:10px; padding:9px 12px; }
.momtitle { font-size:8.4pt; font-weight:bold; color:#1A1830; margin-bottom:6px; }
.mom { display:flex; align-items:flex-start; gap:7px; margin:5px 0; }
.mtxt { flex:1; } .mml { font-size:7.3pt; color:#A9A5BC; } .mmv { font-size:8pt; color:#4A4860; }
.tnote, .dnote { font-size:7pt; color:#A9A5BC; margin-top:5px; line-height:1.35; }
.dnote { text-align:center; padding:0 4px; }
.row { display:flex; gap:16px; align-items:flex-start; }
.col { flex:1; } .col.narrow { flex:0 0 190px; text-align:center; }
table.t { width:100%; border-collapse:collapse; font-size:8.3pt; }
table.t th { background:#F1F0F8; color:#4A4860; text-align:left; padding:7px 8px; font-size:7.6pt;
  text-transform:uppercase; letter-spacing:.3px; border-bottom:1px solid #E5E3F5; }
table.t td { padding:6px 8px; border-bottom:1px solid #EFEDF7; vertical-align:middle; }
table.t .num { text-align:right; white-space:nowrap; }
table.t .rules { text-align:center; font-weight:bold; color:#4A4860; background:#FAFAFE; vertical-align:middle; }
.cmt { color:#7B7A99; font-size:7.8pt; } .pico { color:#7B7A99; font-size:7.8pt; }
tr.tot td { font-weight:bold; background:#F0FDF4; border-top:1px solid #D6F5E3; }
.pill { display:inline-block; padding:2px 9px; border-radius:8px; font-weight:bold; font-size:7.8pt; }
.badge { display:inline-block; background:#DCFCE7; color:#16A34A; padding:2px 9px; border-radius:7px; font-weight:bold; font-size:7.6pt; }
.badge.blue { background:#EFF6FF; color:#2563EB; }
.pos { color:#16A34A; font-weight:bold; } .warnv { color:#2563EB; font-weight:bold; } .neu { color:#4A4860; }
.donutwrap { position:relative; width:150px; height:150px; margin:2px auto 0; }
.dcenter { position:absolute; top:0; left:0; width:150px; height:150px; display:flex;
  flex-direction:column; align-items:center; justify-content:center; }
.dlabel { font-size:7.5pt; color:#A9A5BC; letter-spacing:1px; }
.damount { font-size:12.5pt; font-weight:bold; color:#1A1830; }
.ctitle { font-size:8pt; font-weight:bold; color:#4A4860; text-align:center; margin-bottom:2px; }
.legend { display:flex; flex-wrap:wrap; gap:5px 10px; justify-content:center; margin-top:8px; }
.legend.sm { font-size:7.6pt; }
.lg { font-size:7.8pt; color:#4A4860; white-space:nowrap; }
.dot { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:3px; vertical-align:middle; }
.chart { margin-top:6px; }
.concl { border:1px solid #E5E3F5; background:#FAFAFE; border-radius:10px; padding:9px 14px; margin-top:8px; font-size:8.4pt; }
table.sem { border-collapse:separate; border-spacing:3px; width:100%; font-size:7.6pt; margin-top:2px; }
table.sem th.sm { padding:3px 0; text-align:center; color:#7B7A99; font-size:7pt; font-weight:bold; }
table.sem td.sp { padding:0 6px 0 0; }
table.sem td.sc { text-align:center; font-weight:bold; padding:7px 0; border-radius:5px; }
.semkey { display:flex; gap:14px; flex-wrap:wrap; margin-top:6px; font-size:7.4pt; color:#7B7A99; align-items:center; }
.kd { display:inline-block; width:9px; height:9px; border-radius:3px; margin-right:3px; vertical-align:middle; }
.semnote { color:#A9A5BC; }
.bchg { font-size:7.5pt; color:#6D28D9; margin-top:6px; background:#F5F3FF; border:1px solid #E5E3F5; border-radius:7px; padding:5px 10px; line-height:1.4; }
.logro { background:#F0FDF4; border-left:3px solid #86EFAC; border-radius:8px; padding:8px 11px; margin-bottom:7px; }
.lgt { font-weight:bold; font-size:8.6pt; } .lgb { color:#4A4860; font-size:7.9pt; margin-top:2px; }
.mrow { display:flex; align-items:center; gap:9px; margin:4px 0; }
.mlbl { width:64px; font-size:8pt; font-weight:bold; }
.mtrack { flex:1; height:12px; background:#EFEDF7; border-radius:6px; overflow:hidden; }
.mfill { height:100%; border-radius:6px; }
.mval { width:80px; text-align:right; font-size:7.8pt; color:#7B7A99; }
.mnote { font-size:7.6pt; color:#A9A5BC; margin-top:7px; }
.reco { background:#F5F3FF; border-left:4px solid #9B6DFF; border-radius:8px; padding:9px 13px; margin-bottom:8px; }
.rt { font-weight:bold; font-size:9pt; } .rb { color:#4A4860; font-size:8.2pt; margin-top:3px; }
.foot { margin-top:auto; text-align:center; color:#A9A5BC; font-size:7.6pt; padding-top:8px; border-top:1px solid #E5E3F5; background:white; display:block; }
@page :last { margin-bottom:11mm; }
@page :last .foot { display:block; }
.secintro { color:#4A4860; font-size:8.5pt; margin:3px 0 6px; }
"""

def render_html(metrics, analysis, user_name, year, publish_date=None, logo=None):
    m = metrics
    if publish_date is None:
        publish_date = datetime.date.today()
    mes_pub = MESES_FULL[publish_date.month-1].lower()
    pub = f"{publish_date.day} de {mes_pub} de {publish_date.year}"
    concl_extra = (" " + analysis["diagnostico_extra"]) if analysis.get("diagnostico_extra") else ""
    return f"""<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Análisis Financiero {year} · {user_name}</title><style>{CSS}</style></head><body>
<div class="header">
  <div class="l">{logo_svg(logo)}
    <div><h1>ANÁLISIS FINANCIERO {year}</h1>
      <div class="sub">Informe de Comportamiento, Presupuestos y Salud Financiera</div></div>
  </div>
  <div class="r"><div class="uname">{user_name}</div>
    <div class="chip">Período: Enero – Diciembre {year}</div>
    <div class="pub">Publicado: {pub} · Fuente: Base de datos ORUS</div></div>
</div>
<div class="kpis">
  <div class="kpi"><div class="kl">Ingresos Totales</div><div class="kv">{money(m["ingTot"])}</div><div class="ks">Promedio: {moneyM(m["ingTot"]/12)} / mes</div></div>
  <div class="kpi r"><div class="kl">Gastos Totales</div><div class="kv">{money(m["gasTot"])}</div><div class="ks">Ejecutado: {m["gastoPctIngreso"]}% del ingreso</div></div>
  <div class="kpi g"><div class="kl">Ahorro Formal</div><div class="kv">{money(m["ahorroFormal"])}</div><div class="ks">Meta: {moneyM(m["ahorroBudAnual"])}</div></div>
  <div class="kpi g"><div class="kl">Liquidez Libre</div><div class="kv">{money(m["liquidez"])}</div><div class="ks">{m["liqPct"]}% sin comprometer</div></div>
</div>
{_salud(m, analysis["verdict"])}
<h2>1. Diagnóstico General: Esquema Financiero 50/30/20</h2>
<p class="secintro">El modelo 50/30/20 destina el <b>50%</b> del ingreso a Necesidades (Fijos y Deuda), el <b>30%</b>
a Deseos (Ocio y Varios) y el <b>20%</b> al Futuro y Ahorro. Así se distribuyeron tus ingresos reales en {year}:</p>
<div class="row"><div class="col">{_tabla_503020(m)}</div>
  <div class="col narrow"><div class="ctitle">Distribución del Gasto Total {year}</div>{_donut(m)}
    <div class="dnote">% sobre el gasto total ({moneyM(m["gasTot"])}). En la tabla, el % es sobre el ingreso.</div></div></div>
<div class="concl"><b>Conclusión del diagnóstico:</b> mantuviste tus gastos por debajo de la regla 50/30/20.
Usaste el <b>{m["necesidadesPct"]}%</b> en Necesidades (vs 50% máximo) y solo el <b>{m["deseosPct"]}%</b>
en Deseos (vs 30% máximo). Esto te dejó un superávit libre del <b>{m["liqPct"]}%</b>.{concl_extra}</div>
<h2>2. Comportamiento Mensual y Cumplimiento de Presupuestos</h2>
<p class="secintro">El presupuesto asignado por pilar funcionó como techo protector. El gasto mes a mes se distribuyó así:</p>
<div class="row" style="align-items:stretch">
  <div class="col" style="flex:2.7"><div class="ctitle" style="text-align:left">Evolución Mensual de Gastos por Pilar ({year})</div>{_bars(m)}</div>
  <div class="col mompanel" style="flex:1">{_moments(m)}</div></div>
<div class="pageb"></div>
<div class="ctitle" style="text-align:left;font-size:9pt;margin-bottom:5px">Análisis de Cumplimiento por Pilar</div>
{_cumplimiento(m, analysis["comportamiento"])}
<div class="ctitle" style="text-align:left;font-size:9pt;margin:16px 0 5px">Semáforo Mensual: Gasto vs Presupuesto</div>
{_semaforo(m)}
{_budget_note(m.get("budgetChanges"))}
<h2>3. Transacciones más Recurrentes y Muro de Logros {year}</h2>
<div class="row"><div class="col" style="flex:1.25">
  <div class="ctitle" style="text-align:left">Top Categorías de Gasto en el Año</div>{_topcats(m)}</div>
  <div class="col"><div class="ctitle" style="text-align:left">Muro de Logros {year}</div>{_logros(analysis["logros"])}</div></div>
<div class="pageb"></div>
<h2>4. Adopción por Método de Captura</h2>
<p class="secintro">Cómo se registraron tus {m["nGastos"]} transacciones de gasto en {year} — insumo clave para medir la automatización de ORUS:</p>
{_metodos(m)}
<h2>5. Recomendaciones y Plan de Acción para el Próximo Año</h2>
{_recos(analysis["recomendaciones"])}
<div class="foot">Informe generado automáticamente para <b>{user_name}</b> · ORUS Finanzas ·
Análisis Financiero {year} · {m["nTx"]} transacciones procesadas ({m["nGastos"]} gastos + {m["nIng"]} ingresos)</div>
</body></html>"""


# ============================================================================
# 5. EXPORT PDF  +  6. INTEGRACIÓN (correo)  [stub documentado]
# ============================================================================
def to_pdf(html, out_path):
    """Guarda HTML en lugar de PDF (sin dependencias de WeasyPrint)"""
    # Cambiar extensión .pdf → .html
    html_path = out_path.replace('.pdf', '.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    return html_path

def display_name(user):
    """Nombre a mostrar. `user` es el registro de la BD (dict con 'nombre'/'email'...)
    o, por compatibilidad, un string con el nombre."""
    return user.get("nombre", "") if isinstance(user, dict) else user

def user_email(user):
    """Correo del registro de la BD (None si no aplica)."""
    return user.get("email") if isinstance(user, dict) else None

def generate_annual_report(transactions, budgets, user, year,
                           out_path, llm_call=None, logo=None, publish_date=None):
    """Orquesta el pipeline y devuelve la ruta del PDF.
    `user`: registro del usuario desde la BD, p. ej. {"nombre":..., "email":..., ...}."""
    from file_manager import save_report_json
    import os

    metrics  = compute_metrics(transactions, budgets, year)
    analysis = generate_analysis(metrics, llm_call=llm_call)
    html     = render_html(metrics, analysis, display_name(user), year, publish_date, logo)

    # Guardar JSON
    folder_path = os.path.dirname(out_path)

    report_data = {
        "titulo": f"Informe Anual {year}",
        "tipo": "anual",
        "año": year,
        "fecha_generacion": datetime.date.today().isoformat(),
        "estado": "completado",
        "datos": metrics,
        "analisis": analysis
    }
    save_report_json(folder_path, report_data)

    return to_pdf(html, out_path)

def email_report(pdf_path, user, year):
    """
    STUB de integración. Reemplaza por tu proveedor (SendGrid, SES, Resend...).
    `user` viene de la BD: destinatario = user['email'], nombre = user['nombre'].
    Se dispara cuando el usuario toca "Informes" en la app.
    """
    to_email = user_email(user)
    raise NotImplementedError(
        f"Adjunta `pdf_path` a un correo para {to_email} con asunto "
        f"'Tu Análisis Financiero {year} · ORUS' y cuerpo HTML corto.")


# ============================================================================
# DEMO
# ============================================================================
if __name__ == "__main__":
    import os
    base = os.path.dirname(os.path.abspath(__file__))
    tx      = json.load(open(os.path.join(base, "data", "transactions_db.json")))
    budgets = json.load(open(os.path.join(base, "data", "budgets.json")))
    user    = json.load(open(os.path.join(base, "data", "user.json")))   # registro desde la BD
    # Sin llm_call => usa el fallback determinista. Para producción, pasa tu función.
    out = generate_annual_report(
        transactions=tx, budgets=budgets, user=user,
        year=2025, out_path=os.path.join(base, "output", report_filename("anual", year=2025)),
        llm_call=None, publish_date=datetime.date(2026, 7, 25))
    print("PDF generado:", out)
