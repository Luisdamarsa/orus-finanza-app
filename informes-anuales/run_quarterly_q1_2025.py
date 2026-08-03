#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Trimestral Ene-Mar 2025 (PRIMER trimestre: sin histórico -> Punto de Partida)."""
import os, json, datetime
import orus_quarterly_report as Q

AI = {
  "verdict": {"label": "Excelente", "sub": "Estrenas tu historial con un trimestre muy sólido: ahorras y cumples."},
  "diagnostico_extra": "Es tu <b>primer informe</b>: estos números son tu línea base para comparar de aquí en adelante.",
  "comportamiento": {p: "" for p in Q.ORDER},
  "muro": [
    {"tipo":"logro","titulo":"Presupuestos impecables",
     "detalle":"Ningún pilar superó su límite en los 3 meses: <b>cumplimiento del 100%</b>."},
    {"tipo":"logro","titulo":"Buen arranque de ahorro",
     "detalle":"Destinaste <b>$830.000</b> a tus metas, muy cerca del objetivo trimestral de $900.000."},
    {"tipo":"alerta","titulo":"Meta de ahorro casi lograda",
     "detalle":"Te faltaron <b>$70.000</b> para la meta; Marzo fue el mes más flojo ($250.000)."},
    {"tipo":"alerta","titulo":"Febrero, tu mes más caro",
     "detalle":"Gastaste <b>$2.25M</b> en Febrero, 27% más que en Marzo. Conviene entender ese pico."}
  ],
  "recomendaciones": [
    {"titulo":"Cierra la meta de ahorro",
     "detalle":"Te faltaron $70.000 para la meta trimestral. Un pequeño ajuste mensual la asegura el próximo trimestre."},
    {"titulo":"Observa tu estacionalidad",
     "detalle":"Febrero fue tu mes más alto ($2.25M). Anótalo: te servirá para anticipar el mismo patrón más adelante."},
    {"titulo":"Aprovecha tu superávit",
     "detalle":"Cerraste con $2.444.000 libres (28.8% del ingreso). Destina una parte a tus metas o a inversión."}
  ]
}

def mock_llm_call(messages):
    assert any("DATA" in m["content"] for m in messages)
    return json.dumps(AI, ensure_ascii=False)

if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    tx = json.load(open(os.path.join(base, "data", "transactions_db.json")))
    budgets = json.load(open(os.path.join(base, "data", "budgets.json")))
    user = json.load(open(os.path.join(base, "data", "user.json")))
    out = Q.generate_quarterly_report(
        transactions=tx, budgets=budgets, months=[(2025,1),(2025,2),(2025,3)],
        user=user,
        out_path=os.path.join(base, "output", "Informe_ORUS_Trimestral_Ene-Mar_2025.pdf"),
        llm_call=mock_llm_call, publish_date=datetime.date(2025,4,5))
    print("PDF:", out)
