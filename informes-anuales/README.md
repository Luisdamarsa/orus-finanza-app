# Informes Anuales · ORUS

Genera el **Análisis Financiero anual** en PDF (3 páginas), idéntico en diseño para cualquier
año/usuario. El **diseño y los números son deterministas** (código); la **narrativa** (veredicto,
comportamiento por pilar, logros, recomendaciones) la escribe una **IA** con los datos reales del año.

> Se dispara cuando el usuario toca **"Informes anuales"** en la app y llega por correo.

---

## Estructura de la carpeta

```
informes-anuales/
├── orus_annual_report.py         # GENERADOR ANUAL (3 pág.; fuente de verdad del diseño + cálculos)
├── orus_quarterly_report.py      # GENERADOR TRIMESTRAL (2 pág.; 3 meses; comparativa/punto de partida)
├── orus_monthly_report.py        # GENERADOR MENSUAL (1 pág.; táctico "Tu mes en números")
├── prompts.json                  # PROMPTS EDITABLES de la IA (base + instrucción por informe)
├── example_llm_integration.py    # Conexión a la IA para el anual (Anthropic / OpenAI / mock)
├── run_quarterly_ia.py           # Ejemplo: trimestral con narrativa de IA (mock)
├── run_monthly_ia.py             # Ejemplo: mensual con narrativa de IA (mock)
├── ORUS_INFORME_ANUAL_SPEC.md    # Especificación completa (tokens, layout, fórmulas, contrato IA)
├── data/                         # Entradas de ejemplo
│   ├── transactions_db.json      #   ← FUENTE ÚNICA (DUMMY_TRANSACTIONS: 2025 + 2026)
│   ├── transactions_2025.json    #   (solo 2025, para el demo anual)
│   └── budgets.json              #   presupuestos por pilar y categoría
├── output/                       # ← Aquí caen los PDF generados
└── README.md
```

> **Fuente de datos:** la app usa `DUMMY_TRANSACTIONS`. `transactions_db.json` es su export (2025 + 2026),
> la **única** fuente. El generador filtra por rango de fechas, así que sirve igual para anual o trimestral.

---

## Cómo funciona (pipeline)

```
transacciones + presupuestos
  → compute_metrics()      # números (determinista, siempre cuadran)
  → generate_analysis()    # narrativa (IA; o fallback determinista si no hay IA)
  → render_html()          # plantilla ORUS exacta (letra, colores, layout)
  → to_pdf()               # WeasyPrint · A4 · 3 páginas → output/
  → email_report()         # adjunta el PDF al correo (stub)
```

Regla de oro: **la IA nunca calcula cifras.** Recibe las métricas ya calculadas y solo redacta texto,
así los montos siempre cuadran (Ingresos − Gastos = Liquidez).

---

## De dónde vienen los datos

El generador es **agnóstico a la fuente**: solo necesita una lista de transacciones y los presupuestos.
Hoy los datos son locales (JSON), pero da igual el origen — cuando exista la BD, basta con pasar:

```python
metrics = compute_metrics(transactions, budgets, year)
```

donde `transactions` es una lista de dicts. Cada transacción:

```json
{ "date": "2025-03-12", "amount": -85000, "pillar": "ocio",
  "category": "Restaurantes", "method": "Tarjeta" }
```

- `amount`: negativo = gasto, positivo = ingreso (COP).
- `pillar`: `fijos | deuda | ahorro | ocio | varios | ingreso`.
- `category`: **nombre** de la categoría (no el id); `null` para ingresos.
- `method`: `Llave | Banco | Tarjeta | Efectivo`.

`budgets`:
```json
{
  "pillars": { "fijos": 1200000, "deuda": 500000, "ahorro": 300000, "ocio": 400000, "varios": null },
  "categories": { ... },
  "pillars_by_month": { "2026-04": { "ocio": 600000 } }   // OPCIONAL · presupuestos que varían por mes
}
```

**Presupuestos que varían mes a mes:** si un pilar cambió de presupuesto durante el periodo, se pasa el
override en `pillars_by_month` (clave `"AAAA-MM"`). El motor usa el presupuesto **vigente cada mes**: el
semáforo compara cada mes contra su propio presupuesto y el presupuesto del periodo = **suma de los meses**
(no `presupuesto × N`). Sin overrides, se usa el valor de `pillars` (comportamiento constante). En
producción, el backend resuelve el `historial` de presupuestos de la app a este mapa por mes.

**Pilares/categorías sin presupuesto** (`null`, p. ej. Varios): se analizan por **gasto y distribución**
(totales, donut, % del ingreso, top categorías, tendencia, picos), pero **no** por cumplimiento (no entran
en semáforo, barras, ni alertas de sobregasto) y no cuentan en el componente de Cumplimiento de la Salud.

---

## Uso rápido

Requiere: `pip install weasyprint`

**Demo (sin IA, fallback determinista):**
```bash
python3 orus_annual_report.py
# → output/Informe_ORUS_demo.pdf
```

**Demo con narrativa de IA (usa un mock que simula al modelo):**
```bash
python3 example_llm_integration.py
# → output/Informe_ORUS_IA.pdf
```

**Informe TRIMESTRAL (3 meses):**
```bash
python3 orus_quarterly_report.py   # demo sin IA
python3 run_quarterly_ia.py        # con narrativa de IA (mock) → output/Informe_Trimestral_...pdf
```
```python
import orus_quarterly_report as Q
pdf = Q.generate_quarterly_report(
    transactions = tx, budgets = budgets,
    months       = [(2026,3),(2026,4),(2026,5)],   # cualquier ventana de 3 meses
    user_name    = "Luis Daniel Martínez",
    out_path     = "output/Informe_Trimestral.pdf",
    llm_call     = anthropic_llm_call)             # None = fallback sin IA
```
El trimestral es de **2 páginas** e incluye la **comparativa vs. el trimestre anterior** (momentum ↑↓
por pilar). Si no hay trimestre previo (primer trimestre del usuario), lo reemplaza por un
**"Punto de Partida"** con la tendencia dentro del propio trimestre. El "Muro de Logros" del anual se
adapta a **2 Logros + 2 Alertas**.

**Informe MENSUAL (1 página, táctico):**
```bash
python3 orus_monthly_report.py     # demo sin IA
python3 run_monthly_ia.py          # con narrativa de IA (mock) → output/Informe_Mensual_...pdf
```
```python
import orus_monthly_report as Mo
pdf = Mo.generate_monthly_report(
    tx, budgets, year=2026, month=4, user_name="Luis Daniel Martínez",
    out_path="output/Informe_Mensual.pdf", llm_call=anthropic_llm_call, trailing=6)
```
"Tu mes en números" — checkup rápido y operativo. 4 secciones: **Foto del mes** (Ingresos/Egresos/Saldo,
gauges de cumplimiento por pilar, Salud del mes 0–100), **Comparativa vs. promedio** de los últimos N
meses (gasto y por pilar ↑↓), **Alertas tácticas** (pilares excedidos, picos de categoría, días de mayor
gasto) y **Recomendaciones para este mes**. No incluye comparativa histórica ni narrativa larga.

**En producción** (una sola llamada):
```python
import orus_annual_report as orus
from example_llm_integration import anthropic_llm_call   # o openai_llm_call

user = get_user_from_db(user_id)     # {"nombre":..., "email":..., "moneda":"COP", ...}

pdf = orus.generate_annual_report(
    transactions = tx,            # desde la BD
    budgets      = budgets,       # desde la BD
    user         = user,          # registro del usuario (nombre/email salen de aquí, NO hardcodeados)
    year         = 2025,
    out_path     = "output/Informe_2025.pdf",
    llm_call     = anthropic_llm_call,   # None = fallback sin IA
    logo         = "<svg>…</svg>",       # logo real de ORUS (opcional)
)
orus.email_report(pdf, user, year=2025)   # destinatario = user["email"], nombre = user["nombre"]
```
El **nombre y el correo salen del registro `user` de la BD**, nunca hardcodeados. `user` es un dict tipo
`{"id","nombre","email","moneda","idioma","plan",...}` (ver `data/user.json` de ejemplo).

Conectar la IA real: exporta tu API key (`ANTHROPIC_API_KEY` o `OPENAI_API_KEY`) y pasa
`anthropic_llm_call` / `openai_llm_call` como `llm_call`. Sin key, usa `llm_call=None` (fallback).

---

## Qué cambia con la IA (y qué no)

**No cambia:** diseño, colores, tipografía, layout, gráficos y **todas las cifras**.
**Cambia:** el texto de análisis — veredicto de salud, comportamiento por pilar, muro de logros y
recomendaciones. Con datos distintos, esa narrativa se adapta sola (si la deuda se dispara un año,
el veredicto baja y las recomendaciones se reordenan).

---

## Personalización

- **Logo:** pasa `logo="<svg>…</svg>"` (o un `<img>`) a `generate_annual_report`. Sin él, se usa una
  marca placeholder con los colores de pilar.
- **Diseño:** todos los tokens (colores, tamaños, layout) están en `orus_annual_report.py`
  (constantes de arriba + la constante `CSS`). Es la referencia exacta; ver `ORUS_INFORME_ANUAL_SPEC.md`.
- **Prompts de la IA:** están en **`prompts.json`** (editable sin tocar código). Tiene un `base_system`
  compartido (rol, reglas de dominio, tono, "periodo vencido") que aplica a los tres informes, y una
  `instrucciones` por informe (`annual` / `quarterly` / `monthly`) que define su esquema JSON y enfoque.
  Editar `base_system` cambia los tres; editar una instrucción cambia solo ese informe. Si el archivo falta,
  el código usa los valores de fábrica (`_DEFAULT_PROMPTS`).

---

## Notas

- Salida garantizada a **3 páginas A4**. Si algún año el contenido crece a 4, compactar densidades (no partir bloques).
- Índice de Salud (0–100) = 0.40·Ahorro + 0.35·Cumplimiento + 0.25·Cobertura. En Ahorro, superar el presupuesto **cuenta como positivo**.
- Costo IA: ~1 llamada por informe. Cachear el JSON del análisis por (usuario, año) para no re-generar si los datos no cambian.
