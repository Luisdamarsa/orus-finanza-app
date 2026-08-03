#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mensual Enero 2025 (PRIMER mes con datos: sin promedio -> Punto de Partida)."""
import os, json, datetime
import orus_monthly_report as M

AI = {
  "verdict": {"label": "Excelente", "sub": "Estrenas tu historial con un mes redondo: ahorraste y no te pasaste."},
  "alertas": [],  # mes limpio -> se muestra el recuadro "Sin alertas"
  "recomendaciones": [
    {"titulo": "Mantén este ritmo en Febrero",
     "detalle": "Cerraste con <b>$770.000</b> de saldo y todos los pilares dentro de meta. Repetir esto es tu objetivo."},
    {"titulo": "Automatiza el aporte de Ahorro",
     "detalle": "Llegaste justo a la meta ($300.000). Una cuota fija mensual te asegura no bajar de ahí."},
    {"titulo": "Esta es tu línea base",
     "detalle": "Desde Febrero podrás comparar contra Enero. Úsalo como referencia de un mes sano."}
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
        tx, budgets, 2025, 1, user,
        os.path.join(base, "output", "Informe_ORUS_Mensual_Enero2025.pdf"),
        llm_call=mock_llm_call, publish_date=datetime.date(2025, 2, 3))
    print("PDF:", out)
