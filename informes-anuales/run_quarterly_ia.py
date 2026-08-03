#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera el trimestral Mar-May 2026 con narrativa de IA (mock del analista)."""
import os, json, datetime
import orus_quarterly_report as Q

# JSON tal como lo devolvería la IA para este trimestre (grounded en las métricas reales)
AI = {
  "verdict": {"label": "Sólido", "sub": "Un Abril desbordado en Ocio te costó ahorro; el resto, firme."},
  "diagnostico_extra": "El trimestre lo define <b>Abril</b>: sin ese mes, tus números serían de sobresaliente.",
  "comportamiento": {p: "" for p in Q.ORDER},
  "muro": [
    {"tipo":"logro","titulo":"Necesidades bajo control",
     "detalle":"Fijos y Deuda sumaron <b>43.1%</b> del ingreso, cómodamente bajo el 50% de la regla."},
    {"tipo":"logro","titulo":"Nunca gastaste de más",
     "detalle":"Pese al pico, tus ingresos cubrieron <b>1.28×</b> los gastos: cerraste el trimestre en positivo."},
    {"tipo":"alerta","titulo":"Ocio se disparó en Abril",
     "detalle":"$2.016.000 en un mes (<b>504%</b> del presupuesto), <b>+141%</b> vs. el trimestre anterior. Es tu foco #1."},
    {"tipo":"alerta","titulo":"Ahorro por debajo de meta",
     "detalle":"Aportaste <b>$520.000</b> de $900.000 previstos (−42.9% vs. el trimestre anterior); Marzo quedó sin aporte."}
  ],
  "recomendaciones": [
    {"titulo":"Recupera el ritmo de ahorro",
     "detalle":"Programa una cuota fija de ~$300.000/mes para volver a la meta trimestral de $900.000 y compensar Marzo."},
    {"titulo":"Ponle un tope al Ocio",
     "detalle":"Restaurantes, Domicilios y Bares fueron el grueso del gasto. Define un límite semanal y evita otro Abril."},
    {"titulo":"Entiende qué pasó en Abril",
     "detalle":"52 transacciones y $3.9M en el mes: confirma si fue un evento puntual (viaje/celebración) o un hábito formándose."},
    {"titulo":"Usa el superávit con propósito",
     "detalle":"De los $1.876.000 libres, destina una parte a reponer el ahorro que no aportaste este trimestre."}
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
        transactions=tx, budgets=budgets, months=[(2026,3),(2026,4),(2026,5)],
        user=user,
        out_path=os.path.join(base, "output", "Informe_ORUS_Trimestral_Mar-May_2026.pdf"),
        llm_call=mock_llm_call, publish_date=datetime.date(2026,6,5))
    print("PDF:", out)
