#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mensual Mayo 2026 (recuperación tras Abril; con comparativa vs. promedio)."""
import os, json, datetime
import orus_monthly_report as M

AI = {
  "verdict": {"label": "Excelente", "sub": "Recuperación total tras Abril: gastaste 21% menos y cerraste con superávit."},
  "alertas": [
    {"titulo": "Ahorro por debajo de meta",
     "detalle": "Aportaste <b>$200.000</b> de los $300.000 previstos (67%), pese a cerrar el mes con $1.01M de superávit."}
  ],
  "recomendaciones": [
    {"titulo": "Convierte el superávit en ahorro",
     "detalle": "Mayo dejó <b>$1.012.000</b> libres pero solo ahorraste $200.000. El próximo mes, lleva parte de ese excedente a tus metas."},
    {"titulo": "Sostén el nivel de Ocio",
     "detalle": "Ocio bajó a <b>$213.000</b> (53% del presupuesto), muy sano tras el pico de Abril. Mantén ese ritmo en Junio."},
    {"titulo": "Automatiza el aporte de Ahorro",
     "detalle": "Una cuota fija de $300.000 te asegura llegar a la meta sin depender de cuánto sobre a fin de mes."}
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
        tx, budgets, 2026, 5, user,
        os.path.join(base, "output", "Informe_ORUS_Mensual_Mayo2026.pdf"),
        llm_call=mock_llm_call, publish_date=datetime.date(2026, 6, 3))
    print("PDF:", out)
