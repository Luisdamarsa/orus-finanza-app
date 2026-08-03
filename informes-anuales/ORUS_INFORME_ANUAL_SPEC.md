# ORUS · Especificación del Informe Anual

**Objetivo:** cuando el usuario toca **"Informes anuales"** en ORUS, el sistema genera un PDF de
**3 páginas** idéntico en diseño (letra, colores, layout, gráficos) y lo envía por correo. El diseño y
los números son **deterministas** (código); la **narrativa** (veredicto, comportamiento por pilar,
logros, recomendaciones) la escribe una **IA** con los datos reales del año, que cambian.

Este documento es la fuente de verdad. La implementación de referencia es `orus_annual_report.py`
(reproduce exactamente el informe). Un modelo de IA que reciba este spec + ese código puede replicarlo 1:1.

---

## 1. Arquitectura (pipeline)

```
transacciones crudas + presupuestos
  └─> compute_metrics(tx, budgets, year)      # DETERMINISTA · todos los números
        └─> generate_analysis(metrics, llm)   # IA · solo la narrativa (JSON estricto)
              └─> render_html(metrics, analysis, user, year)   # plantilla ORUS exacta
                    └─> to_pdf(html)           # WeasyPrint · A4 · 3 páginas
                          └─> email_report()   # adjunta el PDF al correo
```

Regla de oro: **la IA NO calcula cifras.** Recibe las métricas ya calculadas y solo redacta texto.
Así los montos siempre cuadran (Ingresos − Gastos = Liquidez) y solo cambia la prosa.

---

## 2. Entradas

**Transacción** (mínimo requerido):
```json
{ "date":"2025-03-12", "amount":-85000, "pillar":"ocio",
  "category":"Restaurantes", "method":"Tarjeta" }
```
- `amount`: negativo = gasto, positivo = ingreso (COP).
- `pillar`: `fijos | deuda | ahorro | ocio | varios | ingreso`.
- `category`: **nombre** de la categoría (no el id). Los ingresos usan `null`.
- `method`: `Llave | Banco | Tarjeta | Efectivo` (métodos vigentes del modelo).

**Presupuestos:**
```json
{ "pillars": { "fijos":1200000, "deuda":500000, "ahorro":300000, "ocio":400000, "varios":null },
  "categories": { "cat_arriendo": {"name":"Arriendo","pillar":"fijos","budget":700000}, ... },
  "pillars_by_month": { "2026-04": { "ocio":600000 } }   // OPCIONAL · presupuesto vigente por mes
}
```
Los presupuestos pueden **variar mes a mes** (`pillars_by_month`, clave `AAAA-MM`). El motor usa el
presupuesto vigente de cada mes: el semáforo compara cada mes contra el suyo, y el presupuesto del periodo
= suma de los meses. Sin override se usa `pillars`. Pilares/categorías sin presupuesto (`null`) se analizan
por gasto/distribución/tendencia, no por cumplimiento.

---

## 3. Sistema de diseño (tokens ORUS · tema Light)

**Tipografía:** `Helvetica, Arial, sans-serif`.
Tamaños (pt): H1 16.5 · H2 12.5 · título sección 9 · cuerpo 8.7 · secundario 8.3 · notas 7–7.6 ·
número de salud 30 · métricas KPI 14.

**Colores base:**

| Uso | Hex |
|---|---|
| Texto principal | `#1A1830` |
| Texto secundario | `#7B7A99` / `#4A4860` |
| Texto terciario / notas | `#A9A5BC` |
| Fondo tarjeta | `#FFFFFF` |
| Fondo suave / bloques | `#FAFAFE` |
| Borde ligero | `#E5E3F5` |
| Acento ORUS (morado) | `#9B6DFF` |
| Header fondo | `#F5F3FF` |

**Colores por pilar** (orden fijo del donut: Fijos → Deuda → Ahorro → Ocio → Varios):

| Pilar | Pastel (donut/barras) | Chip fondo | Chip texto |
|---|---|---|---|
| Fijos | `#93C5FD` | `#EFF6FF` | `#2563EB` |
| Deuda | `#FCA5A5` | `#FEF2F2` | `#DC2626` |
| Ahorro | `#86EFAC` | `#F0FDF4` | `#16A34A` |
| Ocio | `#C4B5FD` | `#F5F3FF` | `#7C3AED` |
| Varios | `#FDE68A` | `#FFFBEB` | `#B45309` |

**Estados del semáforo:** Sano `#DCFCE7` · En el límite `#FEF3C7` · Fuera de meta `#FEE2E2`.
Celda que **supera 100%** lleva recuadro interno en los 4 lados (`box-shadow: inset 0 0 0 2px`):
**verde `#22C55E`** en Ahorro (positivo, fondo `#BBF7D0`) · **rojo `#EF4444`** en los demás.

**Formas:** radios 8–14px · KPIs y bloques con borde `#E5E3F5` · header con barra izquierda morada 5px.
**Moneda:** separador de miles con punto (`$1.635.000`); resumidos como `$X.XXM`.

> El CSS completo (byte a byte) está en la constante `CSS` de `orus_annual_report.py`. Es la referencia
> exacta; cualquier reimplementación debe copiarlo tal cual.

---

## 4. Layout (3 páginas A4, márgenes 9/11/8/11 mm)

**Página 1**
1. **Header:** slot de logo (izq.) + título `ANÁLISIS FINANCIERO {año}` + subtítulo; a la derecha nombre
   del usuario, chip de período y fecha de publicación.
2. **KPIs (4):** Ingresos Totales · Gastos Totales (rojo) · Ahorro Formal (verde) · Liquidez Libre (verde).
3. **Índice de Salud Financiera:** número grande `NN/100` + 3 componentes con puntaje (0–100) + veredicto (IA).
4. **Sección 1 — Diagnóstico 50/30/20:** tabla (Gasto Anual, % del Ingreso, Regla, Estado) + **donut**
   (distribución del gasto, orden de pilares) + conclusión.
5. **Sección 2 (inicio):** barras apiladas de gasto mensual por pilar + panel **"Momentos del Año"**.

**Página 2**
6. **Cumplimiento por pilar:** presupuesto mensual, promedio real, desfase anual, comportamiento (IA).
7. **Semáforo mensual** 12 meses × 4 pilares con presupuesto (Varios excluido).
8. **Sección 3:** Top 8 categorías + **Muro de Logros** (IA).

**Página 3**
9. **Sección 4 — Adopción por método de captura** (barras).
10. **Sección 5 — Recomendaciones** (IA) + pie de página.

---

## 5. Cálculos (deterministas)

```
INGRESOS      = Σ amount  (amount > 0)
GASTO_PILAR   = Σ |amount| por pillar  (amount < 0)
GASTOS        = Σ GASTO_PILAR
LIQUIDEZ      = INGRESOS − GASTOS
AHORRO_FORMAL = GASTO_PILAR("ahorro")

% del Ingreso (tabla)      = GASTO_PILAR / INGRESOS
% del Gasto (donut)        = GASTO_PILAR / GASTOS          # las tajadas suman 100%
Necesidades                = (Fijos + Deuda) / INGRESOS    # vs 50%
Deseos                     = (Ocio + Varios) / INGRESOS    # vs 30%

Semáforo[pilar][mes] (%)   = gasto_mes / (presupuesto_mensual_pilar) × 100
  Cumple si  ≤100%  (en general)  ·  en AHORRO, ≥100% también cumple (positivo)

Índice de Salud (0–100) = 0.40·A + 0.35·B + 0.25·C
  A = min(100, tasa_ahorro_efectiva / 30% × 100)      tasa = (Ahorro + Liquidez) / Ingresos
  B = % de celdas pilar-mes que cumplen (semáforo)
  C = clamp((cobertura − 1) / (1.5 − 1) × 100, 0, 100) cobertura = Ingresos / Gastos
Veredicto por rango: ≥85 Excelente · ≥70 Sólido · ≥50 Mejorable · <50 En riesgo
```

Top categorías: agrupa gastos por nombre → total, frecuencia (ops) y mes pico.
Momentos del año: mes de mayor gasto total, mayor deuda, mejor ahorro, mayor ocio, más austero.

---

## 6. Contrato de la IA (la parte que se adapta a los datos)

La IA recibe el objeto `metrics` y devuelve **solo** este JSON (validar antes de renderizar):

```json
{
  "verdict": { "label": "Excelente|Sólido|Mejorable|En riesgo", "sub": "resumen <=90 chars" },
  "diagnostico_extra": "1 frase que complementa la conclusión (HTML <b> permitido)",
  "comportamiento": { "fijos":"...", "deuda":"...", "ahorro":"...", "ocio":"...", "varios":"..." },
  "logros": [ { "titulo":"...", "detalle":"..." } ],           // 3–4
  "recomendaciones": [ { "titulo":"...", "detalle":"..." } ]   // 3–5, accionables, con cifras
}
```

**Prompts editables (`prompts.json`):** un `base_system` compartido por los 3 informes + una `instrucciones`
por tipo (`annual`/`quarterly`/`monthly`). Editable sin tocar código; si falta el archivo se usan los
valores de fábrica. El código lo carga con `load_prompts()`.

**Prompt de sistema** (resumen; versión literal en `prompts.json` → `base_system`):
- Analista de ORUS; español; tono directo, motivador pero honesto; frases cortas.
- **No recalcular ni inventar cifras**: usar exactamente las de `metrics`, con separador de miles.
- Pilares por nombre, nunca por id. En **Ahorro**, superar el presupuesto es **positivo**;
  en los demás es negativo. Varios no tiene presupuesto. Liquidez = superávit disponible.
- **Periodo vencido:** el informe siempre cubre un periodo ya cerrado (mes/trimestre/año vencido); el
  usuario lo lee cuando terminó. La narrativa nunca asume el periodo en curso (nada de "el resto del mes",
  "aún a tiempo", acciones dentro del periodo). Hechos en pasado; recomendaciones siempre hacia el próximo periodo.
- Cada `comportamiento` = 1 frase evaluando el pilar (usar `cumpl`/`semaforo`).
- Devolver únicamente JSON válido (sin markdown ni texto extra).

Si no hay IA disponible, el código usa `default_analysis(metrics)` (fallback determinista) para no romper.

---

## 7. Integración con la app y el correo

1. Usuario toca **"Informes anuales"** → backend reúne transacciones del año + presupuestos.
2. `generate_annual_report(tx, budgets, user_name, year, out_path, llm_call=tu_llm)`.
   - `llm_call(messages) -> str(JSON)`: envuelve tu proveedor (OpenAI/Anthropic).
   - `logo=` : pasa el SVG/`<img>` del logo real de ORUS (reemplaza el placeholder).
3. `email_report(pdf_path, to_email, user_name, year)` → adjunta el PDF.
   Asunto sugerido: `Tu Análisis Financiero {año} · ORUS`.

**Costo IA (control de negocio):** ~1 llamada por informe (salida ~600–900 tokens). A $10.000 COP/mes
por usuario, un informe anual por usuario es marginal. Cachear el JSON del análisis por (usuario, año)
para no re-generar si los datos no cambian.

---

## 8. Reproducibilidad — checklist

- [ ] Fuente Helvetica/Arial; tamaños y colores exactos de la sección 3.
- [ ] Donut con pilares en orden Fijos→Deuda→Ahorro→Ocio→Varios; centro "GASTADO {total}".
- [ ] % de tabla sobre ingreso; % de donut sobre gasto (etiquetado en el informe).
- [ ] Semáforo: recuadro 4 lados si >100% (verde Ahorro / rojo resto); Varios excluido.
- [ ] Números con separador de miles; Ingresos − Gastos = Liquidez.
- [ ] Índice de salud con la ponderación 0.40/0.35/0.25.
- [ ] La IA solo redacta; jamás produce cifras.
- [ ] Salida: 3 páginas A4. Si crece a 4, compactar densidades (no partir bloques).

---

*Archivos del paquete:* `orus_annual_report.py` (generador), `transactions_2025.json` +
`budgets.json` (entrada de ejemplo), este spec. Demo: `python3 orus_annual_report.py`.
