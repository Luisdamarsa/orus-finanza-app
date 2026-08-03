#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ORUS · Generador de Informe MENSUAL (1 página, táctico · "Tu mes en números")
=============================================================================
Checkup rápido y operativo de un mes. Mismo lenguaje visual que anual/trimestral.
Secciones: 1) Foto del mes (KPIs + gauges + salud)  2) vs. promedio (últimos N meses)
           3) Alertas tácticas  4) Recomendaciones para ESTE mes.
NO incluye: comparativa histórica larga, narrativa extensa, foco en meses pasados.
Diseño + números deterministas; alertas/recomendaciones por IA (con fallback).
"""
import json, math, datetime
from collections import defaultdict
import orus_annual_report as A
from orus_annual_report import (money, moneyM, ORDER, LABEL, PASTEL, PILBG, PILTX,
                                 MESES, MESES_FULL, ACCENT, CSS, logo_svg)

# ---------------------------------------------------------------------------
def _prev_months(y, m, n):
    out=[]
    for _ in range(n):
        m-=1
        if m==0: m=12; y-=1
        out.append((y,m))
    return list(reversed(out))

def compute_month(transactions, budgets, year, month, trailing=6):
    pil_bud=budgets["pillars"]
    def inmonth(y,mo): return [t for t in transactions if t["date"][:7]==f"{y}-{mo:02d}"]
    cur=inmonth(year,month)
    if not cur: raise ValueError("No hay transacciones en el mes indicado.")
    gastos=[t for t in cur if t["amount"]<0]
    ing=sum(t["amount"] for t in cur if t["amount"]>0)
    byPil={p:0 for p in ORDER}
    for t in gastos:
        if t["pillar"] in byPil: byPil[t["pillar"]]+=-t["amount"]
    gas=sum(byPil.values()); saldo=ing-gas; ahf=byPil["ahorro"]

    # presupuesto VIGENTE de cada pilar en ESTE mes
    bud_month={p: A.budget_for(budgets, p, year, month) for p in ORDER}
    # cumplimiento por pilar (con presupuesto)
    cumpl={p: (round(byPil[p]/bud_month[p]*100) if bud_month[p] else None) for p in ORDER}
    # ¿cambió el presupuesto vs. el mes anterior?
    _pm=_prev_months(year,month,1)[0]
    budgetChanges=[]
    for p in ["fijos","deuda","ahorro","ocio"]:
        if bud_month[p] is None: continue
        pb=A.budget_for(budgets,p,_pm[0],_pm[1])
        if pb is not None and pb!=bud_month[p]:
            budgetChanges.append({"pillar":p,"from":pb,"to":bud_month[p]})

    # salud del mes (escala simplificada, misma fórmula, clampeada)
    eff_savings=(ahf+saldo)/ing if ing else 0        # ingreso menos consumo
    scoreA=max(0,min(100,round(eff_savings/0.30*100)))
    budgeted=[p for p in ["fijos","deuda","ahorro","ocio"] if bud_month[p] is not None]
    ok=sum(1 for p in budgeted if (cumpl[p]<=100 if p!="ahorro" else cumpl[p]>=100 or cumpl[p]<=100))
    # cumplimiento: en no-ahorro dentro si <=100; en ahorro siempre suma (exceder es bueno)
    ok=sum(1 for p in budgeted if (cumpl[p]<=100 if p!="ahorro" else True))
    scoreB=round(ok/len(budgeted)*100) if budgeted else 0
    ic=ing/gas if gas else 0
    scoreC=max(0,min(100,round((ic-1)/(1.5-1)*100)))
    health=round(0.40*scoreA+0.35*scoreB+0.25*scoreC)

    # promedio de meses previos (trailing con datos)
    pm=[(yy,mm) for (yy,mm) in _prev_months(year,month,trailing)]
    tot_p=defaultdict(list); tot_all=[]; cat_prev=defaultdict(list)
    have=0
    for (yy,mm) in pm:
        mx=inmonth(yy,mm)
        if not mx: continue
        have+=1
        bp=defaultdict(int); cp=defaultdict(int)
        for t in mx:
            if t["amount"]<0:
                bp[t["pillar"]]+=-t["amount"]; cp[t["category"]]+=-t["amount"]
        tot_all.append(sum(bp.values()))
        for p in ORDER: tot_p[p].append(bp[p])
        for c,v in cp.items(): cat_prev[c].append(v)
    avg={p:(round(sum(tot_p[p])/len(tot_p[p])) if tot_p[p] else 0) for p in ORDER}
    avg_tot=round(sum(tot_all)/len(tot_all)) if tot_all else 0
    def pctd(a,b): return round((a-b)/b*100) if b else None
    delta_tot=pctd(gas,avg_tot)
    delta_pil={p:pctd(byPil[p],avg[p]) for p in ORDER}

    # picos de categoría (Abril vs su promedio previo)
    cat_cur=defaultdict(int)
    for t in gastos: cat_cur[t["category"]]+=-t["amount"]
    spikes=[]
    for c,val in cat_cur.items():
        prevs=cat_prev.get(c,[])
        av=round(sum(prevs)/len(prevs)) if prevs else 0
        d=pctd(val,av)
        if d is not None and d>=60 and val>=150000:   # pico relevante
            spikes.append({"cat":c,"val":val,"avg":av,"delta":d})
    spikes.sort(key=lambda x:-x["delta"])

    # días pico
    byday=defaultdict(int)
    for t in gastos: byday[t["date"]]+=-t["amount"]
    peak_days=sorted(byday.items(), key=lambda x:-x[1])[:3]
    peak_days=[{"date":d,"val":v} for d,v in peak_days]

    return {
        "year":year,"month":month,"trailingHave":have,
        "ing":ing,"gas":gas,"saldo":saldo,"ahf":ahf,"ahorroBudMonth":bud_month.get("ahorro") or 0,
        "byPil":byPil,"cumpl":cumpl,"pilBudMonth":bud_month,"budgetChanges":budgetChanges,
        "health":health,"scoreA":scoreA,"scoreB":scoreB,"scoreC":scoreC,
        "savingsRate":round(eff_savings*100,1),"ic":round(ic,2),
        "avg":avg,"avg_tot":avg_tot,"delta_tot":delta_tot,"delta_pil":delta_pil,
        "spikes":spikes,"peak_days":peak_days,
        "nTx":len(cur),"nGastos":len(gastos),
        "budBreached":[p for p in budgeted if p!="ahorro" and cumpl[p]>100],
    }

# ---------------------------------------------------------------------------
# análisis IA (alertas + recomendaciones)
# ---------------------------------------------------------------------------
def default_analysis_m(m):
    label = "Excelente" if m["health"]>=85 else "Sólido" if m["health"]>=70 else "Mejorable" if m["health"]>=50 else "En riesgo"
    alertas=[]
    if m["saldo"]<0:
        alertas.append({"titulo":"Saldo negativo","detalle":f"Gastaste {money(-m['saldo'])} más de lo que ingresaste este mes."})
    for p in m["budBreached"]:
        alertas.append({"titulo":f"{LABEL[p]} excedido","detalle":f"Llegó al {m['cumpl'][p]}% de su presupuesto."})
    if m["spikes"]:
        s=m["spikes"][0]
        alertas.append({"titulo":f"Pico en {s['cat']}","detalle":f"{money(s['val'])} vs. {money(s['avg'])} de promedio (+{s['delta']}%)."})
    recs=[{"titulo":"Frena el pilar disparado","detalle":"Recorta el gasto del pilar más excedido para volver al presupuesto el próximo mes."},
          {"titulo":"Cubre el saldo","detalle":"Si cerraste en negativo, cúbrelo con liquidez antes de que arrastre al mes siguiente."},
          {"titulo":"Sostén lo que va bien","detalle":"Mantén los pilares dentro de meta; no toques lo que ya funciona."}]
    return {"verdict":{"label":label,"sub":"Tu mes en números — revisa las alertas y actúa."},
            "alertas":alertas[:4],"recomendaciones":recs[:3]}

def generate_analysis_m(m, llm_call=None):
    if llm_call is None: return default_analysis_m(m)
    instruccion=A.PROMPTS["instrucciones"]["monthly"]
    user=instruccion+"\n\nDATA:\n"+json.dumps({"metrics":m},ensure_ascii=False)
    msgs=[{"role":"system","content":A.SYSTEM_PROMPT},{"role":"user","content":user}]
    return json.loads(llm_call(msgs))

# ---------------------------------------------------------------------------
# render
# ---------------------------------------------------------------------------
def _salud(m, verdict):
    def bm(lbl, val):
        return (f'<div class="hmini"><div class="hml">{lbl}</div><div class="htrack">'
                f'<div class="hfill" style="width:{val}%"></div></div><div class="hmv">{val}<span class="hpts">pts</span></div></div>')
    hcol = "#16A34A" if m["health"]>=70 else "#B45309" if m["health"]>=50 else "#DC2626"
    lblA=f"Tasa de ahorro efectiva ({m['savingsRate']}%)"; lblB=f"Cumplimiento de presupuesto ({m['scoreB']}%)"; lblC=f"Índice de cobertura ({m['ic']}×)"
    return (f'<div class="healthband"><div class="hscore"><div class="hnum" style="color:{hcol}">{m["health"]}<span class="hden">/100</span></div>'
            f'<div class="hcap">Índice de Salud<br>del Mes</div></div>'
            f'<div class="hbars"><div class="htitle">Componentes del puntaje (0–100)</div>'
            f'{bm(lblA,m["scoreA"])}{bm(lblB,m["scoreB"])}{bm(lblC,m["scoreC"])}</div>'
            f'<div class="hverdict"><div class="hvbig" style="color:{hcol}">{verdict["label"]}</div>'
            f'<div class="hvsub">{verdict["sub"]}</div></div></div>')

def _cumpl_bars(m):
    """Barras de cumplimiento en escala común (pesos). La línea de cada pilar = su presupuesto.
    ORDENADAS POR GASTO DESCENDENTE (mayor a menor)."""
    pillars=[p for p in ["fijos","deuda","ahorro","ocio"] if m["pilBudMonth"].get(p)]
    spent={p:m["byPil"][p] for p in pillars}
    budget={p:m["pilBudMonth"][p] for p in pillars}
    # ORDENAR por gasto descendente (solo en mensual)
    pillars=sorted(pillars, key=lambda p: spent[p], reverse=True)
    S=max(max(spent[p],budget[p]) for p in pillars)*1.04   # escala común con un pelín de aire
    rows=""
    for p in pillars:
        sp,bd=spent[p],budget[p]; pct=round(sp/bd*100) if bd else 0
        mark=bd/S*100                       # posición de la línea del presupuesto (proporcional)
        base_w=min(sp,bd)/S*100             # parte dentro del presupuesto (termina en la línea si se pasó)
        over_w=(sp-bd)/S*100 if sp>bd else 0
        if p=="ahorro":                     # en Ahorro pasar la meta es POSITIVO
            basecol="#22C55E" if pct>=100 else "#FBBF24" if pct>=70 else "#EF4444"; overcol="#16A34A"
            vcol="#16A34A" if pct>=100 else "#B45309" if pct>=70 else "#DC2626"
        elif pct<=100:
            basecol="#22C55E" if pct<70 else "#FBBF24"; overcol=None
            vcol="#16A34A" if pct<70 else "#B45309"
        else:
            basecol="#FBBF24"; overcol="#EF4444"; vcol="#DC2626"
        over_html=f'<div class="cbseg" style="width:{over_w:.1f}%;background:{overcol}"></div>' if over_w>0 else ''
        rows+=(f'<div class="cbar"><div class="cblbl"><span class="pill" style="background:{PILBG[p]};color:{PILTX[p]}">{LABEL[p]}</span></div>'
               f'<div class="cbtrack"><div class="cbseg" style="width:{base_w:.1f}%;background:{basecol}"></div>{over_html}'
               f'<div class="cblim" style="left:{mark:.1f}%"></div></div>'
               f'<div class="cbval" style="color:{vcol}">{pct}%</div></div>')
    return rows

def _delta(d, good_up=False):
    if d is None: return '<span class="dz">—</span>'
    if d==0: return '<span class="dz">=</span>'
    up=d>0; good=(up==good_up); col="#16A34A" if good else "#DC2626"; ar="▲" if up else "▼"
    return f'<span style="color:{col};font-weight:bold">{ar} {abs(d)}%</span>'

def render_html(m, an, user_name, publish_date=None, logo=None):
    if publish_date is None: publish_date=datetime.date.today()
    pub=f"{publish_date.day} de {MESES_FULL[publish_date.month-1].lower()} de {publish_date.year}"
    mlabel=f"{MESES_FULL[m['month']-1]} {m['year']}"
    saldo_cls="r" if m["saldo"]<0 else "g"
    saldo_txt=("−"+money(-m["saldo"])) if m["saldo"]<0 else money(m["saldo"])
    cbars=_cumpl_bars(m)
    bchg_html=""
    if m.get("budgetChanges"):
        _p=[f'<b>{LABEL[c["pillar"]]}</b> {money(c["from"])}→{money(c["to"])}' for c in m["budgetChanges"]]
        bchg_html=(f'<div class="bchg">Presupuesto ajustado vs. el mes anterior: {" · ".join(_p)}. '
                   f'Las barras usan el presupuesto de este mes.</div>')
    # Sección 2: comparativa vs. promedio, o "Punto de Partida" si es el primer mes con datos
    if m["delta_tot"] is None or m["trailingHave"]==0:
        sec2_title="2. Punto de Partida · Primer Mes"
        sec2=(f'<div class="cmp2"><div class="cmp2a"><div class="ck">Gasto del mes</div>'
              f'<div class="bigbase">{money(m["gas"])}</div><div class="cmpsub">tu línea base</div></div>'
              f'<div class="cmpdiv"></div>'
              f'<div class="basenote">Es tu <b>primer mes con datos</b>: aún no hay promedio para comparar. '
              f'Estos números son tu <b>línea base</b> — desde el próximo mes verás aquí cuánto subiste o bajaste en cada pilar.</div></div>')
    else:
        pil_rows="".join(f'<div class="cmpk"><div class="ck"><span class="pill" style="background:{PILBG[p]};color:{PILTX[p]}">{LABEL[p]}</span></div>'
                         f'<div class="cv">{_delta(m["delta_pil"][p], good_up=(p=="ahorro"))}</div></div>' for p in ORDER)
        trend_up = (m["delta_tot"] or 0) > 10
        trend_txt = "↑ por encima de lo normal" if trend_up else "↓ dentro de lo normal"
        trend_col = "#DC2626" if trend_up else "#16A34A"
        sec2_title=f"2. Comparativa vs. Promedio (últimos {m['trailingHave']} meses)"
        sec2=(f'<div class="cmp2"><div class="cmp2a"><div class="ck">Gasto del mes vs. promedio</div>'
              f'<div class="bigd">{_delta(m["delta_tot"])}</div>'
              f'<div class="cmpsub">{money(m["gas"])} vs. {money(m["avg_tot"])} normal</div>'
              f'<div class="trend" style="color:{trend_col}">{trend_txt}</div></div>'
              f'<div class="cmpdiv"></div><div class="cmp2b">{pil_rows}</div></div>')
    # alertas
    if an["alertas"]:
        alertas="".join(f'<div class="al"><div class="alt">{a["titulo"]}</div><div class="alb">{a["detalle"]}</div></div>' for a in an["alertas"][:4])
    else:
        alertas='<div class="okbox">Sin alertas este mes. Todo dentro de lo esperado. ✔</div>'
    recs="".join(f'<div class="reco"><div class="rt">{i+1}. {r["titulo"]}</div><div class="rb">{r["detalle"]}</div></div>'
                 for i,r in enumerate(an["recomendaciones"][:3]))
    # picos de categoría (para sección alertas, compacto)
    spikes_html=""
    if m["spikes"]:
        chips="".join(f'<span class="spk">{s["cat"]} <b style="color:#DC2626">+{s["delta"]}%</b></span>' for s in m["spikes"][:4])
        spikes_html=f'<div class="spikes"><span class="spktit">Picos de categoría:</span> {chips}</div>'
    days="".join(f'<span class="day">{int(d["date"][8:10])} {MESES[m["month"]-1]} · <b>{money(d["val"])}</b></span>' for d in m["peak_days"][:3])

    return f"""<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Informe Mensual {MESES_FULL[m['month']-1]} {m['year']} · {user_name}</title><style>{CSS}{CSS_M}</style></head><body>
<div class="header"><div class="l">{logo_svg(logo)}
  <div><h1>INFORME MENSUAL</h1><div class="sub">Tu mes en números</div></div></div>
  <div class="r"><div class="uname">{user_name}</div><div class="chip">Mes: {MESES[m['month']-1]} {m['year']}</div>
    <div class="pub">Publicado: {pub} · Fuente: Base de datos ORUS</div></div></div>

<h2>1. Foto del Mes</h2>
<div class="row" style="gap:10px;align-items:stretch">
  <div class="kpi" style="flex:1"><div class="kl">Ingresos</div><div class="kv">{money(m['ing'])}</div><div class="ks">del mes</div></div>
  <div class="kpi r" style="flex:1"><div class="kl">Egresos</div><div class="kv">{money(m['gas'])}</div><div class="ks">{round(m['gas']/m['ing']*100) if m['ing'] else 0}% del ingreso</div></div>
  <div class="kpi g" style="flex:1"><div class="kl">Ahorro Formal</div><div class="kv">{money(m['ahf'])}</div><div class="ks">Meta mes: {moneyM(m['ahorroBudMonth'])}</div></div>
  <div class="kpi {saldo_cls}" style="flex:1"><div class="kl">Saldo del Mes</div><div class="kv">{saldo_txt}</div><div class="ks">{'gastaste de más' if m['saldo']<0 else 'te sobró'}</div></div>
</div>
{_salud(m, an['verdict'])}
<div class="cbars"><div class="cbtit">Cumplimiento de presupuesto por pilar</div>{cbars}
  <div class="cbnote"><b>Escala común</b> en pesos · la línea de cada pilar es su presupuesto · lo que la cruza es <b>sobregasto</b> (rojo) · en Ahorro es positivo (verde)</div>{bchg_html}</div>

<h2>{sec2_title}</h2>
{sec2}

<h2>3. Alertas Tácticas</h2>
{alertas}
{spikes_html}
<div class="daysrow"><span class="spktit">Días de mayor gasto:</span> {days}</div>

<h2>4. Recomendaciones para el Próximo Mes</h2>
{recs}
<div class="foot">Informe mensual · <b>{user_name}</b> · ORUS Finanzas · {mlabel} · {m['nGastos']} gastos registrados</div>
</body></html>"""

CSS_M = """
/* A4 page simulation for screen viewing */
html { background:#ccc; padding:15px; }
body { width:210mm; margin:0 auto 20mm; padding:9mm 11mm 11mm 11mm;
  background:white; box-shadow:0 0 15px rgba(0,0,0,0.2);
  display:flex; flex-direction:column; position:relative; min-height:297mm; }

/* Print styles */
@page { size:A4; margin:9mm 11mm 11mm 11mm; }
@media print {
  html { background:white; padding:0; }
  body { width:100%; height:auto; margin:0; box-shadow:none; padding:0; }
}
h2 { font-size:12.5pt; margin:10px 0 5px; padding-bottom:4px; border-bottom:2px solid #E5E3F5; }
.kpi { padding:8px 12px; border-radius:12px; }
.kpi .kv { font-size:14pt; }
.healthband { margin-top:10px; margin-bottom:10px; padding:9px 16px; border-radius:12px; }
.cbars { margin-top:10px; margin-bottom:10px; border:1px solid #E5E3F5; border-radius:12px; padding:8px 16px; background:#FAFAFE; }
.cbtit { font-size:7.5pt; font-weight:bold; color:#4A4860; margin-bottom:4px; }
.cbar { display:flex; align-items:center; gap:8px; margin:3px 0; }
.cblbl { flex:0 0 56px; font-size:7.8pt; }
.cbtrack { position:relative; flex:1; height:11px; background:#EFEDF7; border-radius:5px; overflow:hidden; display:flex; }
.cbseg { height:100%; }
.cblim { position:absolute; top:0; bottom:0; width:1.5px; background:#1A1830; opacity:.45; }
.cbval { flex:0 0 40px; text-align:right; font-weight:bold; font-size:7.8pt; }
.cbnote { font-size:6.8pt; color:#A9A5BC; margin-top:4px; line-height:1.3; }
.cmp2 { display:flex; align-items:stretch; gap:12px; border:1px solid #E5E3F5; border-radius:10px; padding:8px 12px; margin-top:6px; margin-bottom:6px; }
.cmp2a { flex:0 0 auto; text-align:center; padding-right:4px; }
.bigd { font-size:13pt; margin:1px 0; }
.bigbase { font-size:12.5pt; font-weight:bold; color:#1A1830; margin:1px 0; }
.basenote { flex:1; font-size:7.5pt; color:#7B7A99; line-height:1.4; align-self:center; padding-left:2px; }
.cmpsub { font-size:7.6pt; color:#7B7A99; } .trend { font-size:8pt; font-weight:bold; margin-top:3px; }
.cmp2b { display:flex; flex:1; justify-content:space-around; align-items:center; }
.cmpk { text-align:center; display:flex; flex-direction:column; align-items:center; }
.ck { font-size:7pt; color:#7B7A99; } .cv { font-size:9pt; margin-top:3px; white-space:nowrap; }
.cmpdiv { flex:0 0 1px; width:1px; background:#E5E3F5; align-self:stretch; }
.dz { color:#A9A5BC; font-weight:bold; }
.al { background:#FEF6EE; border-left:2px solid #FDBA74; border-radius:6px; padding:4px 9px; margin-bottom:3px; }
.alt { font-weight:bold; font-size:8.4pt; color:#C2560C; } .alb { color:#4A4860; font-size:7.6pt; margin-top:0.5px; }
.okbox { background:#F0FDF4; border-left:2px solid #86EFAC; border-radius:6px; padding:6px 9px; font-size:8pt; color:#16A34A; font-weight:bold; }
.spikes { margin:3px 0 4px; font-size:7.6pt; color:#4A4860; }
.spktit { font-weight:bold; color:#4A4860; font-size:7.4pt; }
.spk { display:inline-block; background:#FEF2F2; border-radius:5px; padding:1px 6px; margin:1px 3px 1px 0; font-size:7.4pt; }
.daysrow { font-size:7.6pt; color:#4A4860; margin-top:4px; margin-bottom:6px; }
.day { display:inline-block; margin-right:10px; }
.reco { background:#F5F3FF; border-left:3px solid #9B6DFF; border-radius:6px; padding:5px 10px; margin-bottom:3px; }
.rt { font-weight:bold; font-size:8.8pt; } .rb { color:#4A4860; font-size:8pt; margin-top:2px; }
.foot { margin-top:auto; text-align:center; color:#A9A5BC; font-size:7.6pt; padding-top:8px; border-top:1px solid #E5E3F5; background:white; display:block; }
.kpi.g .kv { color:#16A34A; }
"""

def generate_monthly_report(transactions, budgets, year, month, user, out_path,
                            llm_call=None, logo=None, publish_date=None, trailing=6):
    """`user`: registro del usuario desde la BD ({'nombre':..., 'email':...})."""
    from file_manager import create_report_folder, save_report_json, get_report_pdf_path

    m=compute_month(transactions,budgets,year,month,trailing)
    an=generate_analysis_m(m, llm_call=llm_call)
    html=render_html(m, an, A.display_name(user), publish_date, logo)

    # Extraer folder del out_path (es la carpeta del informe)
    import os
    folder_path = os.path.dirname(out_path)

    # Guardar JSON
    report_data = {
        "titulo": f"Informe Mensual {month}/{year}",
        "tipo": "mensual",
        "mes": month,
        "año": year,
        "fecha_generacion": datetime.date.today().isoformat(),
        "estado": "completado",
        "datos": m,
        "analisis": an
    }
    save_report_json(folder_path, report_data)

    # Generar PDF
    return A.to_pdf(html, out_path)


if __name__ == "__main__":
    import os
    base=os.path.dirname(os.path.abspath(__file__))
    tx=json.load(open(os.path.join(base,"data","transactions_db.json")))
    budgets=json.load(open(os.path.join(base,"data","budgets.json")))
    user=json.load(open(os.path.join(base,"data","user.json")))
    out=generate_monthly_report(tx,budgets,2026,4,user,
        os.path.join(base,"output",A.report_filename("mensual",year=2026,month=4)),
        llm_call=None, publish_date=datetime.date(2026,5,3))
    print("PDF mensual:", out)
