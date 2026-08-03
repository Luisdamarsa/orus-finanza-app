#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mensual Abril 2026 con narrativa de IA (mock del analista táctico)."""
import os, json, datetime
import orus_monthly_report as M

AI = {
  "verdict": {"label": "En riesgo", "sub": "Abril se te fue de las manos: Ocio disparado y cerraste en rojo."},
  "alertas": [
    {"titulo": "Cerraste en rojo",
     "detalle": "Gastaste <b>$816.000 más</b> de lo que ingresaste: el primer saldo negativo del semestre."},
    {"titulo": "Ocio fuera de control",
     "detalle": "<b>$2.016.000</b> = 504% del presupuesto y <b>+734%</b> vs. tu promedio. Es el detonante del mes."},
    {"titulo": "Se multiplicó el gasto social",
     "detalle": "Bares <b>+744%</b>, Domicilios +779% y Cine +521% respecto a tu promedio de los últimos meses."},
    {"titulo": "Golpe al inicio de mes",
     "detalle": "El <b>1 de abril</b> gastaste $822.000 de un tirón. Revisa qué pasó ese día."}
  ],
  "recomendaciones": [
    {"titulo": "Baja el Ocio en Mayo",
     "detalle": "En Abril te pasaste <b>$1.6M</b> del presupuesto de Ocio. Para Mayo, ponle un tope y prioriza Restaurantes/Domicilios/Bares."},
    {"titulo": "Repón el saldo negativo",
     "detalle": "Abril cerró en <b>−$816.000</b>. Cúbrelo con liquidez o ahorro en Mayo para que no arrastre el mes."},
    {"titulo": "Fija un tope semanal de salidas",
     "detalle": "De cara a los próximos meses, un límite de ~$100.000/semana en Ocio evita que se repita un Abril así."}
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
    out = M.generate_monthly_report(
        tx, budgets, 2026, 4, user,
        os.path.join(base, "output", "Informe_ORUS_Mensual_Abril2026.pdf"),
        llm_call=mock_llm_call, publish_date=datetime.date(2026, 5, 3))
    print("PDF:", out)
