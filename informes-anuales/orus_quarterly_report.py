#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ORUS · Generador de Informe TRIMESTRAL (3 meses)
================================================
Mismo lenguaje visual que el anual (reutiliza tokens + CSS de orus_annual_report),
pero 2 páginas, más operativo y con lo que diferencia a un trimestral:
  · Comparativa vs. el trimestre anterior (momentum ↑↓ por pilar)
  · Si no hay trimestre anterior → "Punto de Partida" (tendencia intra-trimestre)
  · Muro mezclado: 2 Logros + 2 Alertas
Diseño y números deterministas; narrativa por IA (con fallback).
"""
import json, math, datetime, calendar
import orus_annual_report as A
from orus_annual_report import (money, moneyM, ORDER, LABEL, PASTEL, PILBG, PILTX,
                                 MESES, MESES_FULL, METHOD_COLOR, METODOS_VIGENTES, ACCENT, CSS, logo_svg)

# ---------------------------------------------------------------------------
# utilidades de periodo
# ---------------------------------------------------------------------------
def prev_months(months):
    """Devuelve la lista de los N meses inmediatamente anteriores."""
    y, m = months[0]
    out = []
    for _ in range(len(months)):
        m -= 1
        if m == 0: m = 12; y -= 1
        out.append((y, m))
    return list(reversed(out))

def period_label(months):
    a, b = months[0], months[-1]
    if a[0] == b[0]:
        return f"{MESES_FULL[a[1]-1]}–{MESES_FULL[b[1]-1]} {a[0]}"
    return f"{MESES_FULL[a[1]-1]} {a[0]} – {MESES_FULL[b[1]-1]} {b[0]}"

def period_short(months):
    a, b = months[0], months[-1]
    return f"{MESES[a[1]-1]}–{MESES[b[1]-1]} {b[0]}"


# ---------------------------------------------------------------------------
# cálculos del periodo (N meses)
# ---------------------------------------------------------------------------
def compute_period(transactions, budgets, months):
    keys = set(months)
    def inperiod(t):
        y, m = int(t["date"][:4]), int(t["date"][5:7])
        return (y, m) in keys
    tx = [t for t in transactions if inperiod(t)]
    if not tx:
        return None
    gastos  = [t for t in tx if t["amount"] < 0]
    ingresos = [t for t in tx if t["amount"] > 0]
    pil_bud = budgets["pillars"]; n = len(months)

    ingTot = sum(t["amount"] for t in ingresos)
    byPil = {p: 0 for p in ORDER}
    for t in gastos:
        if t["pillar"] in byPil: byPil[t["pillar"]] += -t["amount"]
    gasTot = sum(byPil.values()); liq = ingTot - gasTot; ahf = byPil["ahorro"]

    # por posición de mes (0..n-1)
    idx = {mk: i for i, mk in enumerate(months)}
    monthly = [{p: 0 for p in ORDER} for _ in range(n)]
    for t in gastos:
        i = idx[(int(t["date"][:4]), int(t["date"][5:7]))]
        if t["pillar"] in ORDER: monthly[i][t["pillar"]] += -t["amount"]
    mlabels = [MESES[mk[1]-1] for mk in months]

    budgeted = [p for p in ["fijos","deuda","ahorro","ocio"] if pil_bud.get(p) is not None]
    semaforo, cells, within = {}, 0, 0
    for p in budgeted:
        semaforo[p] = []
        for (yy,mm) in months:
            b = A.budget_for(budgets, p, yy, mm) or 0
            pct = round(monthly[idx[(yy,mm)]][p] / b * 100) if b else 0
            semaforo[p].append(pct); cells += 1
            if (pct <= 100 if p != "ahorro" else True): within += 1
    cumplPct = round(within/cells*100) if cells else 0

    cumpl = {}
    for p in ORDER:
        bud_period = A.budget_sum(budgets, p, months)          # None si no tiene presupuesto
        cumpl[p] = {"prom": round(byPil[p]/n),
                    "budMonthly": round(bud_period/n) if bud_period is not None else None,
                    "anual": byPil[p],
                    "desfase": (byPil[p]-bud_period) if bud_period is not None else None}

    cat = {}
    for t in gastos:
        k = t.get("category") or "—"
        c = cat.setdefault(k, {"n":0,"tot":0,"pillar":t["pillar"]})
        c["n"] += 1; c["tot"] += -t["amount"]
    topCats = sorted(({"name":k,"pillar":LABEL[v["pillar"]],"n":v["n"],"tot":v["tot"]}
                      for k,v in cat.items()), key=lambda c:-c["tot"])

    met = {}
    for t in gastos: met[t["method"]] = met.get(t["method"],0)+1
    totMet = sum(met.values()) or 1
    pctMet = {k: round(v/totMet*100,1) for k,v in met.items()}

    tot_m = [sum(monthly[i][p] for p in ORDER) for i in range(n)]
    def peakp(pil): return max(range(n), key=lambda i: monthly[i][pil])
    moments = {
        "mayor_gasto": {"mes":MESES_FULL[months[tot_m.index(max(tot_m))][1]-1], "val":max(tot_m)},
        "mayor_deuda": {"mes":MESES_FULL[months[peakp('deuda')][1]-1], "val":monthly[peakp('deuda')]['deuda']},
        "mejor_ahorro":{"mes":MESES_FULL[months[peakp('ahorro')][1]-1], "val":monthly[peakp('ahorro')]['ahorro']},
        "mayor_ocio":  {"mes":MESES_FULL[months[peakp('ocio')][1]-1], "val":monthly[peakp('ocio')]['ocio']},
    }

    savingsRate = (ahf+liq)/ingTot if ingTot else 0
    scoreA = min(100, round(savingsRate/0.30*100))
    scoreB = cumplPct
    ic = ingTot/gasTot if gasTot else 0
    scoreC = max(0, min(100, round((ic-1)/(1.5-1)*100)))
    health = round(0.40*scoreA + 0.35*scoreB + 0.25*scoreC)

    return {
        "months": months, "n": n, "mlabels": mlabels,
        "ingTot":ingTot,"gasTot":gasTot,"liquidez":liq,"ahorroFormal":ahf,
        "ahorroBud": A.budget_sum(budgets, "ahorro", months) or 0,
        "byPil":byPil,
        "pctByPil":{p: round(byPil[p]/ingTot*100,1) if ingTot else 0 for p in ORDER},
        "pctGastoByPil":{p: round(byPil[p]/gasTot*100,1) if gasTot else 0 for p in ORDER},
        "necesidadesPct": round((byPil["fijos"]+byPil["deuda"])/ingTot*100,1) if ingTot else 0,
        "deseosPct": round((byPil["ocio"]+byPil["varios"])/ingTot*100,1) if ingTot else 0,
        "liqPct": round(liq/ingTot*100,1) if ingTot else 0,
        "gastoPctIngreso": round(gasTot/ingTot*100,1) if ingTot else 0,
        "monthly":monthly,"tot_m":tot_m,"semaforo":semaforo,"cumplPct":cumplPct,"cumpl":cumpl,
        "budgetChanges":A.budget_changes(budgets, months),
        "topCats":topCats,"met":met,"pctMet":pctMet,"totMet":totMet,"moments":moments,
        "health":health,"scoreA":scoreA,"scoreB":scoreB,"scoreC":scoreC,
        "savingsRate":round(savingsRate*100,1),"ic":round(ic,2),
        "nTx":len(tx),"nGastos":len(gastos),"nIng":len(ingresos),
    }

def compare(cur, prev):
    """Deltas cur vs prev (o None -> punto de partida)."""
    if prev is None:
        return None
    def d(a, b): return None if not b else round((a-b)/b*100, 1)
    return {
        "gasto": d(cur["gasTot"], prev["gasTot"]),
        "ingreso": d(cur["ingTot"], prev["ingTot"]),
        "ahorro": d(cur["ahorroFormal"], prev["ahorroFormal"]),
        "liquidez": d(cur["liquidez"], prev["liquidez"]),
        "health": cur["health"] - prev["health"],
        "pilares": {p: d(cur["byPil"][p], prev["byPil"][p]) for p in ORDER},
        "prev_label": None,  # se rellena afuera
    }


# ---------------------------------------------------------------------------
# análisis IA (mismo contrato; para trimestral incluye 'alertas')
# ---------------------------------------------------------------------------
def default_analysis_q(m, cmp):
    exc = lambda p: sum(1 for v in m["semaforo"].get(p,[]) if v>100)
    if   m["health"]>=85: label="Excelente"
    elif m["health"]>=70: label="Sólido"
    elif m["health"]>=50: label="Mejorable"
    else: label="En riesgo"
    logros = [
        {"tipo":"logro","titulo":"Superávit del trimestre",
         "detalle":f"Cerraste con {money(m['liquidez'])} sin comprometer ({m['liqPct']}% del ingreso)."},
        {"tipo":"logro","titulo":"Cobertura sana",
         "detalle":f"Tus ingresos cubrieron {m['ic']}× tus gastos del trimestre."},
    ]
    peor = max(ORDER, key=lambda p: exc(p) if p!='ahorro' else -1)
    alertas = [
        {"tipo":"alerta","titulo":f"Vigila {LABEL[peor]}",
         "detalle":f"Se pasó del presupuesto en {exc(peor)} de {m['n']} meses del trimestre."},
        {"tipo":"alerta","titulo":"Mes pico",
         "detalle":f"{m['moments']['mayor_gasto']['mes']} concentró el mayor gasto ({money(m['moments']['mayor_gasto']['val'])})."},
    ]
    recs = [
        {"titulo":"Ajusta el pilar que se disparó",
         "detalle":f"Revisa {LABEL[peor]}: sube su presupuesto o recorta el gasto para el próximo trimestre."},
        {"titulo":"Sostén el ahorro",
         "detalle":f"Mantén el aporte mensual (~{money(m['cumpl']['ahorro']['prom'])}) para no perder ritmo."},
        {"titulo":"Aprovecha el superávit",
         "detalle":f"Destina parte de los {money(m['liquidez'])} libres a tus metas o inversión."},
    ]
    return {"verdict":{"label":label,"sub":"Trimestre bajo control con foco de mejora puntual."},
            "diagnostico_extra":"","comportamiento":{p:"" for p in ORDER},
            "muro":logros+alertas,"recomendaciones":recs}

def generate_analysis_q(m, cmp, llm_call=None):
    if llm_call is None:
        return default_analysis_q(m, cmp)
    instruccion = A.PROMPTS["instrucciones"]["quarterly"]
    payload = {"metrics": m, "comparativa": cmp}
    user = instruccion + "\n\nDATA:\n" + json.dumps(payload, ensure_ascii=False)
    messages = [{"role":"system","content":A.SYSTEM_PROMPT},{"role":"user","content":user}]
    return json.loads(llm_call(messages))


# ---------------------------------------------------------------------------
# componentes de render (periodo-aware)
# ---------------------------------------------------------------------------
def _donut(m):
    byPil, gas = m["byPil"], m["gasTot"]; r=54; C=2*math.pi*r; cx=cy=70; cum=0; segs=[]
    for p in ORDER:
        frac=byPil[p]/gas if gas else 0; dash=max(frac*C-6,1)
        segs.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{PASTEL[p]}" stroke-width="20" '
                    f'stroke-linecap="round" stroke-dasharray="{dash:.2f} {C-dash:.2f}" '
                    f'stroke-dashoffset="{-cum*C:.2f}" transform="rotate(-90 {cx} {cy})"/>'); cum+=frac
    chips="".join(f'<span class="lg"><span class="dot" style="background:{PASTEL[p]}"></span>{LABEL[p]} <b>{m["pctGastoByPil"][p]}%</b></span>' for p in ORDER)
    return (f'<div class="donutwrap"><svg viewBox="0 0 140 140" width="150" height="150">'
            f'<circle cx="70" cy="70" r="54" fill="none" stroke="#EFEDF7" stroke-width="20"/>{"".join(segs)}</svg>'
            f'<div class="dcenter"><div class="dlabel">GASTADO</div><div class="damount">{money(gas)}</div></div></div>'
            f'<div class="legend">{chips}</div>')

def _bars(m):
    n=m["n"]; W,H=330,150; padL=36; padB=18; padT=8; plotH=H-padB-padT; plotW=W-padL
    ymax=max(m["tot_m"]+[1]); step=500000; ymax=math.ceil(ymax/step)*step
    slot=plotW/n; bw=min(slot*0.5, 46)
    out=[f'<svg viewBox="0 0 {W} {H}" width="100%" height="{H}">']
    gy=0
    while gy<=ymax:
        y=padT+plotH-(gy/ymax*plotH)
        out.append(f'<line x1="{padL}" y1="{y:.1f}" x2="{W}" y2="{y:.1f}" stroke="#EFEDF7" stroke-width="1"/>')
        out.append(f'<text x="{padL-4}" y="{y+3:.1f}" font-size="7" fill="#A9A5BC" text-anchor="end">${gy/1e6:.1f}M</text>')
        gy+=step
    for i in range(n):
        x=padL+i*slot+(slot-bw)/2; yb=padT+plotH
        for p in ORDER:
            h=monthly_h=m["monthly"][i][p]/ymax*plotH; yb-=h
            out.append(f'<rect x="{x:.1f}" y="{yb:.1f}" width="{bw:.1f}" height="{h:.1f}" fill="{PASTEL[p]}"/>')
        out.append(f'<text x="{x+bw/2:.1f}" y="{padT+plotH+12:.1f}" font-size="8" fill="#7B7A99" text-anchor="middle">{m["mlabels"][i]}</text>')
    out.append('</svg>')
    lg="".join(f'<span class="lg"><span class="dot" style="background:{PASTEL[p]}"></span>{LABEL[p]}</span>' for p in ORDER)
    return f'<div class="chart">{"".join(out)}</div><div class="legend sm">{lg}</div>'

def _tabla_503020(m):
    grp=[("50%",["fijos","deuda"]),("30%",["ocio","varios"]),("20%",["ahorro"])]
    est={"fijos":"Sano","deuda":"Controlado","ocio":"Optimizado","varios":"Alineado","ahorro":"+ Excedente"}
    rows=""
    for ideal,pil in grp:
        for j,p in enumerate(pil):
            regla=f'<td class="rules" rowspan="{len(pil)}">{ideal}</td>' if j==0 else ""
            rows+=(f'<tr><td><span class="pill" style="background:{PILBG[p]};color:{PILTX[p]}">{LABEL[p]}</span></td>'
                   f'<td class="num">{money(m["byPil"][p])}</td><td class="num">{m["pctByPil"][p]}%</td>'
                   f'{regla}<td><span class="badge">{est[p]}</span></td></tr>')
    rows+=(f'<tr class="tot"><td>Excedente Libre / Liquidez</td><td class="num">{money(m["liquidez"])}</td>'
           f'<td class="num">{m["liqPct"]}%</td><td class="rules">—</td><td><span class="badge blue">Disponible</span></td></tr>')
    return (f'<table class="t"><thead><tr><th>Pilar Finanzas</th><th class="num">Gasto Trim.</th>'
            f'<th class="num">% del Ingreso</th><th>Regla Ideal</th><th>Estado</th></tr></thead><tbody>{rows}</tbody></table>')

def _salud(m, verdict):
    def bm(lbl,val):
        return (f'<div class="hmini"><div class="hml">{lbl}</div><div class="htrack">'
                f'<div class="hfill" style="width:{val}%"></div></div><div class="hmv">{val}<span class="hpts">pts</span></div></div>')
    lblA=f"Tasa de ahorro efectiva ({m['savingsRate']}%)"; lblB=f"Cumplimiento de presupuesto ({m['cumplPct']}%)"; lblC=f"Índice de cobertura ({m['ic']}×)"
    return (f'<div class="healthband"><div class="hscore"><div class="hnum">{m["health"]}<span class="hden">/100</span></div>'
            f'<div class="hcap">Índice de Salud<br>del Trimestre</div></div>'
            f'<div class="hbars"><div class="htitle">Componentes del puntaje (0–100)</div>'
            f'{bm(lblA,m["scoreA"])}{bm(lblB,m["scoreB"])}{bm(lblC,m["scoreC"])}</div>'
            f'<div class="hverdict"><div class="hvbig">{verdict["label"]}</div><div class="hvsub">{verdict["sub"]}</div></div></div>')

def _comparativa(m, cmp, prev, prev_months_list):
    """Bloque diferenciador: vs trimestre anterior; o Punto de Partida si no hay prev."""
    if cmp is None:
        # PUNTO DE PARTIDA (primer trimestre / sin histórico)
        tm=m["tot_m"]; lab=m["mlabels"]
        pts="".join(f'<span class="ppt"><span class="ppm">{lab[i]}</span>'
                    f'<span class="ppv">{money(tm[i])}</span></span>'
                    + ('<span class="pparrow">›</span>' if i<m["n"]-1 else '') for i in range(m["n"]))
        return (f'<div class="cmp"><div class="cmptitle">Punto de Partida · primer trimestre</div>'
                f'<div class="ppbody"><div class="pprow">{pts}</div>'
                f'<div class="ppnote">No hay trimestre anterior para comparar: <b>esta es tu línea base</b>. '
                f'La próxima vez verás aquí cuánto subiste o bajaste en cada pilar.</div></div></div>')
    # COMPARATIVA vs trimestre anterior
    def arrow(delta, good_up=False):
        if delta is None: return '<span class="dz">—</span>'
        if delta == 0: return '<span class="dz">=</span>'
        up = delta > 0
        good = (up == good_up)
        col = "#16A34A" if good else "#DC2626"
        ar = "▲" if up else "▼"
        return f'<span style="color:{col};font-weight:bold">{ar} {abs(delta)}%</span>'
    # resumen (gasto: bajar es bueno; ahorro/liquidez: subir es bueno)
    res = (f'<div class="cmpk"><div class="ck">Gasto total</div><div class="cv">{arrow(cmp["gasto"], good_up=False)}</div></div>'
           f'<div class="cmpk"><div class="ck">Ahorro</div><div class="cv">{arrow(cmp["ahorro"], good_up=True)}</div></div>'
           f'<div class="cmpk"><div class="ck">Liquidez</div><div class="cv">{arrow(cmp["liquidez"], good_up=True)}</div></div>'
           f'<div class="cmpk"><div class="ck">Salud</div><div class="cv">{_hdelta(cmp["health"])}</div></div>')
    pil="".join(f'<div class="cmpk"><div class="ck"><span class="pill" style="background:{PILBG[p]};color:{PILTX[p]}">{LABEL[p]}</span></div>'
                f'<div class="cv">{arrow(cmp["pilares"][p], good_up=(p=="ahorro"))}</div></div>' for p in ORDER)
    return (f'<div class="cmp"><div class="cmptitle">vs. Trimestre Anterior · {period_label(prev_months_list)}</div>'
            f'<div class="cmpbody">{res}<div class="cmpdiv"></div>{pil}</div></div>')

def _hdelta(d):
    if d==0: return '<span class="dz">=</span>'
    col="#16A34A" if d>0 else "#DC2626"; ar="▲" if d>0 else "▼"
    return f'<span style="color:{col};font-weight:bold">{ar} {abs(d)} pts</span>'

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
    head="".join(f'<th class="sm">{lab}</th>' for lab in m["mlabels"])
    rows=""
    for p in pil:
        rows+=(f'<tr><td class="sp"><span class="pill" style="background:{PILBG[p]};color:{PILTX[p]}">{LABEL[p]}</span></td>'
               +"".join(cell(v,p=="ahorro") for v in sm[p])+"</tr>")
    return (f'<table class="sem sem3"><thead><tr><th></th>{head}</tr></thead><tbody>{rows}</tbody></table>'
            f'<div class="semkey"><span><span class="kd" style="background:#DCFCE7"></span>Sano</span>'
            f'<span><span class="kd" style="background:#FEF3C7"></span>En el límite</span>'
            f'<span><span class="kd" style="background:#FEE2E2"></span>Fuera de meta</span>'
            f'<span><span class="kd" style="background:#BBF7D0;box-shadow:inset 0 0 0 2px #22C55E"></span>Ahorro: meta superada</span>'
            f'<span><span class="kd" style="background:#FEE2E2;box-shadow:inset 0 0 0 2px #EF4444"></span>Excedido</span></div>')

def _topcats(m):
    pmap={v:k for k,v in LABEL.items()}; rows=""
    for c in m["topCats"][:7]:
        p=pmap[c["pillar"]]
        rows+=(f'<tr><td><b>{c["name"]}</b></td>'
               f'<td><span class="pill" style="background:{PILBG[p]};color:{PILTX[p]}">{c["pillar"]}</span></td>'
               f'<td class="num">{c["n"]} ops</td><td class="num">{money(c["tot"])}</td></tr>')
    return (f'<table class="t"><thead><tr><th>Categoría</th><th>Pilar</th><th class="num">Frec.</th>'
            f'<th class="num">Total Trim.</th></tr></thead><tbody>{rows}</tbody></table>')

def _muro(items):
    out=""
    for x in items[:4]:
        alerta = x.get("tipo")=="alerta"
        cls = "muro alerta" if alerta else "muro logro"
        tag = "ALERTA" if alerta else "LOGRO"
        out+=(f'<div class="{cls}"><div class="mtag">{tag}</div>'
              f'<div class="mtt">{x["titulo"]}</div><div class="mtb">{x["detalle"]}</div></div>')
    return out

def _momentos(m):
    M=m["moments"]
    items=[("deuda","Mayor gasto",M["mayor_gasto"]),("deuda","Mayor pago de deuda",M["mayor_deuda"]),
           ("ahorro","Mejor mes de ahorro",M["mejor_ahorro"]),("ocio","Mayor gasto en ocio",M["mayor_ocio"])]
    rows="".join(f'<div class="mom"><span class="dot" style="background:{PASTEL[c]}"></span>'
                 f'<div class="mtxt"><div class="mml">{lbl}</div><div class="mmv"><b>{d["mes"]}</b> · {money(d["val"])}</div></div></div>'
                 for c,lbl,d in items)
    return f'<div class="momtitle">Momentos del Trimestre</div>{rows}'

def _recos(recs):
    return "".join(f'<div class="reco"><div class="rt">{i+1}. {x["titulo"]}</div><div class="rb">{x["detalle"]}</div></div>'
                   for i,x in enumerate(recs[:3]))

# CSS extra específico del trimestral (se suma al CSS del anual)
CSS_Q = """
.cmp { border:1px solid #E5E3F5; border-radius:12px; margin-top:10px; overflow:hidden; }
.cmptitle { background:#F5F3FF; color:#4A4860; font-weight:bold; font-size:8pt; padding:6px 12px;
  text-transform:uppercase; letter-spacing:.3px; border-bottom:1px solid #E5E3F5; }
.cmpbody { display:flex; justify-content:space-between; align-items:stretch; padding:10px 16px; gap:6px; }
.cmpk { text-align:center; display:flex; flex-direction:column; justify-content:center; }
.cmpdiv { flex:0 0 1px; width:1px; background:#E5E3F5; align-self:stretch; margin:0 6px; }
.ck { font-size:6.9pt; color:#7B7A99; white-space:nowrap; } .cv { font-size:8.8pt; margin-top:3px; white-space:nowrap; }
.dz { color:#A9A5BC; font-weight:bold; }
.ppbody { padding:10px 16px; }
.pprow { display:flex; align-items:center; justify-content:center; gap:26px; margin-bottom:7px; }
.ppt { display:flex; flex-direction:column; align-items:center; } .ppm { font-size:7.4pt; color:#7B7A99; }
.ppv { font-size:10pt; font-weight:bold; color:#1A1830; white-space:nowrap; }
.pparrow { color:#C4B5FD; font-size:14pt; font-weight:bold; }
.ppnote { font-size:7.8pt; color:#7B7A99; line-height:1.4; padding-top:6px; border-top:1px solid #E5E3F5; text-align:center; }
table.sem3 { border-spacing:5px 3px; }
table.sem3 td.sc { padding:6px 0; font-size:8.5pt; }
.muro { border-radius:8px; padding:6px 11px; margin-bottom:5px; }
.muro.logro { background:#F0FDF4; border-left:3px solid #86EFAC; }
.muro.alerta { background:#FEF6EE; border-left:3px solid #FDBA74; }
.mtag { font-size:6.6pt; font-weight:bold; letter-spacing:.5px; }
.muro.logro .mtag { color:#16A34A; } .muro.alerta .mtag { color:#C2560C; }
.mtt { font-weight:bold; font-size:8.6pt; margin-top:1px; } .mtb { color:#4A4860; font-size:7.9pt; margin-top:1px; }
/* compactado trimestral para asegurar 2 páginas */
h2 { margin:7px 0 4px; }
.reco { padding:7px 13px; margin-bottom:6px; }
.foot { margin-top:auto; padding-top:8px; display:block !important; }
@page :last .foot { display:block; }
/* ajustes de formato */
.pub { white-space:nowrap; margin-top:10px; }               /* pie de encabezado con espacio visual */
.badge { white-space:nowrap; }              /* "+ Excedente" en una línea */
table.sem3 { width:auto; margin:2px auto 0; } /* semáforo centrado (pilares + celdas juntos) */
table.sem3 td.sc { min-width:74px; }
.semkey { justify-content:center; }         /* leyenda del semáforo centrada */
"""

def render_html(m, analysis, cmp, prev, prev_months_list, user_name, publish_date=None, logo=None):
    if publish_date is None: publish_date=datetime.date.today()
    pub=f"{publish_date.day} de {MESES_FULL[publish_date.month-1].lower()} de {publish_date.year}"
    plabel=period_label(m["months"]); pshort=period_short(m["months"])
    extra=(" "+analysis["diagnostico_extra"]) if analysis.get("diagnostico_extra") else ""
    return f"""<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Análisis Trimestral {pshort} · {user_name}</title><style>{CSS}{CSS_Q}</style></head><body>
<div class="header"><div class="l">{logo_svg(logo)}
  <div><h1>ANÁLISIS TRIMESTRAL</h1>
    <div class="sub">Informe de Comportamiento, Presupuestos y Salud Financiera</div></div></div>
  <div class="r"><div class="uname">{user_name}</div>
    <div class="chip">Trimestre: {pshort}</div>
    <div class="pub">Publicado: {pub} · Fuente: Base de datos ORUS</div></div></div>
<div class="kpis">
  <div class="kpi"><div class="kl">Ingresos del Trim.</div><div class="kv">{money(m["ingTot"])}</div><div class="ks">Promedio: {moneyM(m["ingTot"]/m["n"])} / mes</div></div>
  <div class="kpi r"><div class="kl">Gastos del Trim.</div><div class="kv">{money(m["gasTot"])}</div><div class="ks">Ejecutado: {m["gastoPctIngreso"]}% del ingreso</div></div>
  <div class="kpi g"><div class="kl">Ahorro Formal</div><div class="kv">{money(m["ahorroFormal"])}</div><div class="ks">Meta trim.: {moneyM(m["ahorroBud"])}</div></div>
  <div class="kpi g"><div class="kl">Liquidez Libre</div><div class="kv">{money(m["liquidez"])}</div><div class="ks">{m["liqPct"]}% sin comprometer</div></div>
</div>
{_salud(m, analysis["verdict"])}
{_comparativa(m, cmp, prev, prev_months_list)}
<h2>1. Diagnóstico del Trimestre · 50/30/20</h2>
<div class="row"><div class="col">{_tabla_503020(m)}
  <div class="tnote">"Gasto Trim." = gastado en los 3 meses. "% del Ingreso" = gasto del pilar ÷ ingresos del trimestre.</div></div>
  <div class="col narrow"><div class="ctitle">Distribución del Gasto · {pshort}</div>{_donut(m)}
    <div class="dnote">% sobre el gasto total ({moneyM(m["gasTot"])}).</div></div></div>
<div class="concl"><b>Lectura rápida:</b> usaste el <b>{m["necesidadesPct"]}%</b> del ingreso en Necesidades
y el <b>{m["deseosPct"]}%</b> en Deseos, con un superávit libre del <b>{m["liqPct"]}%</b>.{extra}</div>

<div class="pageb"></div>
<h2>2. Comportamiento Mensual del Trimestre</h2>
<div class="row" style="align-items:stretch">
  <div class="col" style="flex:1.7"><div class="ctitle" style="text-align:left">Gasto por Pilar · mes a mes</div>{_bars(m)}</div>
  <div class="col mompanel" style="flex:1">{_momentos(m)}</div></div>
<div class="ctitle" style="text-align:left;font-size:9pt;margin:14px 0 5px">Semáforo Mensual: Gasto vs Presupuesto</div>
{_semaforo(m)}
{A._budget_note(m.get("budgetChanges"))}
<h2>3. Categorías, Logros y Alertas</h2>
<div class="row"><div class="col" style="flex:1.15">
  <div class="ctitle" style="text-align:left">Top Categorías del Trimestre</div>{_topcats(m)}</div>
  <div class="col"><div class="ctitle" style="text-align:left">Balance del Trimestre</div>{_muro(analysis["muro"])}</div></div>
<h2>4. Plan de Acción · Próximos 3 Meses</h2>
{_recos(analysis["recomendaciones"])}
<div class="foot">Informe trimestral generado automáticamente para <b>{user_name}</b> · ORUS Finanzas ·
{plabel} · {m["nTx"]} transacciones ({m["nGastos"]} gastos + {m["nIng"]} ingresos)</div>
</body></html>"""

def generate_quarterly_report(transactions, budgets, months, user, out_path,
                              llm_call=None, logo=None, publish_date=None):
    """`user`: registro del usuario desde la BD ({'nombre':..., 'email':...})."""
    from file_manager import save_report_json
    import os

    cur = compute_period(transactions, budgets, months)
    if cur is None: raise ValueError("No hay transacciones en el periodo indicado.")
    pm = prev_months(months)
    prev = compute_period(transactions, budgets, pm)
    cmp = compare(cur, prev)
    analysis = generate_analysis_q(cur, cmp, llm_call=llm_call)
    html = render_html(cur, analysis, cmp, prev, pm, A.display_name(user), publish_date, logo)

    # Guardar JSON
    folder_path = os.path.dirname(out_path)
    year = months[0][0]
    quarter = (months[0][1] - 1) // 3 + 1

    report_data = {
        "titulo": f"Informe Trimestral Q{quarter}/{year}",
        "tipo": "trimestral",
        "trimestre": quarter,
        "año": year,
        "meses": months,
        "fecha_generacion": datetime.date.today().isoformat(),
        "estado": "completado",
        "datos": cur,
        "comparativa": cmp,
        "analisis": analysis
    }
    save_report_json(folder_path, report_data)

    return A.to_pdf(html, out_path)


if __name__ == "__main__":
    import os
    base=os.path.dirname(os.path.abspath(__file__))
    tx=json.load(open(os.path.join(base,"data","transactions_db.json")))
    budgets=json.load(open(os.path.join(base,"data","budgets.json")))
    user=json.load(open(os.path.join(base,"data","user.json")))
    months=[(2026,3),(2026,4),(2026,5)]
    out=generate_quarterly_report(tx, budgets, months, user,
        os.path.join(base,"output",A.report_filename("trimestral",months=months)),
        llm_call=None, publish_date=datetime.date(2026,6,5))
    print("PDF trimestral:", out)
