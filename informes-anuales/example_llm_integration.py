#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ejemplo de integración del hook de IA con orus_annual_report.py
================================================================
Muestra 3 formas de `llm_call(messages) -> str(JSON)`:
  A) Anthropic (Claude)     · producción
  B) OpenAI (GPT)           · producción
  C) mock (analista IA)     · demo offline, para ver el resultado sin API key

En producción usas A o B. Aquí ejecutamos C para renderizar el PDF con narrativa "de IA".
"""
import os, json, datetime
import orus_annual_report as orus


# ---------------------------------------------------------------------------
# A) ANTHROPIC (Claude)  ·  pip install anthropic ; export ANTHROPIC_API_KEY=...
# ---------------------------------------------------------------------------
def anthropic_llm_call(messages):
    from anthropic import Anthropic
    client = Anthropic()  # toma ANTHROPIC_API_KEY del entorno
    system = next(m["content"] for m in messages if m["role"] == "system")
    user   = next(m["content"] for m in messages if m["role"] == "user")
    resp = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1500,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return resp.content[0].text  # debe ser JSON puro (lo pide el SYSTEM_PROMPT)


# ---------------------------------------------------------------------------
# B) OPENAI (GPT)  ·  pip install openai ; export OPENAI_API_KEY=...
# ---------------------------------------------------------------------------
def openai_llm_call(messages):
    from openai import OpenAI
    client = OpenAI()  # toma OPENAI_API_KEY del entorno
    resp = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        response_format={"type": "json_object"},  # fuerza JSON válido
        temperature=0.4,
    )
    return resp.choices[0].message.content


# ---------------------------------------------------------------------------
# C) MOCK · narrativa tal como la devolvería la IA para los datos 2025.
#    (Reemplaza a A/B solo para esta demostración sin conexión.)
# ---------------------------------------------------------------------------
_AI_JSON_2025 = {
  "verdict": {
    "label": "Excelente",
    "sub": "Ahorras 4 de cada 10 pesos y ningún pilar se te descontroló."
  },
  "diagnostico_extra": "Tu perfil es el de un ahorrador disciplinado con holgura de sobra para empezar a invertir.",
  "comportamiento": {
    "fijos":  "Impecable: 12 de 12 meses bajo el techo, con un colchón anual de <b>$3.88M</b> sin usar.",
    "deuda":  "Bajo control. Solo Abril rozó el límite (<b>$520.000</b>); el resto del año promediaste $437.500/mes.",
    "ahorro": "Tu mejor jugada: superaste la meta anual y en 8 de 12 meses aportaste 100% o más de lo previsto.",
    "ocio":   "Muy contenido: gastaste solo el <b>67%</b> de tu presupuesto de Ocio. Tienes margen para disfrutar más.",
    "varios": "Sin techo asignado; dominado por Supermercado (<b>$1.635.000</b>), que es una necesidad, no un gusto."
  },
  "logros": [
    {"titulo": "Meta de Ahorro Superada",
     "detalle": "Acumulaste <b>$3.650.000</b> frente a un objetivo de $3.60M: un año redondo para tus metas de Viaje y Emergencia."},
    {"titulo": "Dominio Total de Fijos",
     "detalle": "Ni un solo mes superó el presupuesto de gastos fijos (máximo 78% del techo). Consistencia total."},
    {"titulo": "Cobertura Sólida",
     "detalle": "Tus ingresos cubrieron <b>1.41×</b> tus gastos: por cada peso que gastas, ingresa 1.41."},
    {"titulo": "Liquidez para Crecer",
     "detalle": "Cerraste con <b>$10.020.000</b> libres (29.1% del ingreso), listos para invertir en 2026."}
  ],
  "recomendaciones": [
    {"titulo": "Sincera el presupuesto de Tarjeta Visa",
     "detalle": "Fijaste $300.000/mes pero gastaste <b>$437.500</b> en promedio (pico de $520.000 en Abril). Súbelo a $450.000 y dejarás de ver falsas alertas."},
    {"titulo": "Formaliza el gasto de Supermercado",
     "detalle": "Está en Varios sin presupuesto, pero pesa <b>$1.635.000</b> al año. Muévelo a Fijos con una cuota de ~$140.000/mes para verlo en tus alertas."},
    {"titulo": "Pon a trabajar tu liquidez",
     "detalle": "De los <b>$10.02M</b> libres, destina un 50% a inversión de bajo riesgo. Dejarlos quietos es perder poder adquisitivo."},
    {"titulo": "Automatiza el aporte de Ahorro",
     "detalle": "Ahorras bien, pero irregular (pico de $380.000 en Diciembre). Una cuota fija mensual te da consistencia sin depender de sobrantes."},
    {"titulo": "Crea un Fondo para picos",
     "detalle": "Abril fue tu mes más caro (<b>$2.4M</b>). Aparta un poco desde mitad de año y suaviza los meses fuertes."}
  ]
}

def mock_llm_call(messages):
    # Simula al modelo: valida que recibió DATA y devuelve el JSON como texto.
    assert any("DATA" in m["content"] for m in messages)
    return json.dumps(_AI_JSON_2025, ensure_ascii=False)


if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    tx      = json.load(open(os.path.join(base, "data", "transactions_db.json")))
    budgets = json.load(open(os.path.join(base, "data", "budgets.json")))
    user    = json.load(open(os.path.join(base, "data", "user.json")))   # registro desde la BD

    # Cambia mock_llm_call por anthropic_llm_call / openai_llm_call en producción.
    out = orus.generate_annual_report(
        transactions=tx, budgets=budgets, user=user,
        year=2025, out_path=os.path.join(base, "output", "Informe_ORUS_Anual_2025.pdf"),
        llm_call=mock_llm_call, publish_date=datetime.date(2026, 7, 25))
    print("PDF con narrativa de IA:", out)
