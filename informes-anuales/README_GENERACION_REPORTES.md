# ORUS Informes: Generación de HTML → PDF

## 📋 Descripción General

Este sistema genera tres tipos de informes financieros automatizados para ORUS:
- **Anual**: 3 páginas | Análisis completo del año
- **Trimestral**: 2 páginas | Comparativa vs trimestre anterior
- **Mensual**: 1 página | Foto rápida del mes

**Arquitectura:**
```
Datos crudos (BD)
    ↓
compute_*() → métricas deterministas (números, gráficos, barras)
    ↓
generate_analysis_*() → IA genera narrativa (veredicto, alertas, recomendaciones)
    ↓
render_html() → plantilla ORUS con diseño fijo
    ↓
to_pdf() → WeasyPrint (A4, márgenes precisos, footer solo última página)
    ↓
PDF final
```

---

## 🗂️ Estructura de Carpetas

```
informes-anuales_nuevo/
├── orus_annual_report.py          # Generador anual (3 pág)
├── orus_quarterly_report.py       # Generador trimestral (2 pág)
├── orus_monthly_report.py         # Generador mensual (1 pág)
├── prompts.json                   # Prompts externalizados para IA
├── data/
│   ├── transactions_db.json       # Transacciones (Ene 2025 - Mayo 2026)
│   ├── budgets.json               # Presupuestos por pilar y mes
│   └── user.json                  # Datos del usuario (nombre, email, plan)
├── output/                        # PDFs generados + HTMLs temporales
├── example_llm_integration.py     # Ejemplo: anual 2025 con narrativa IA
├── run_annual_2025.py             # Ejemplo: anual 2025 con mock IA
├── run_quarterly_q1_2025.py       # Ejemplo: trimestral Q1 2025
├── run_monthly_ia.py              # Ejemplo: mensual Abril 2026
└── README_GENERACION_REPORTES.md  # Este archivo
```

---

## 🔧 Generación Paso a Paso

### **1. ENTRADA: Datos de la Base de Datos**

#### `data/transactions_db.json`
```json
[
  {
    "date": "2025-01-15",
    "amount": -150000,
    "category": "Supermercado",
    "pillar": "fijos",
    "description": "Compra semanal"
  }
]
```
- **date**: ISO format YYYY-MM-DD
- **amount**: negativo = egreso, positivo = ingreso
- **pillar**: fijos | deuda | ahorro | ocio | varios
- **category**: Supermercado, Tarjeta Visa, etc. (usado para análisis)

#### `data/budgets.json`
```json
{
  "pillars": {
    "fijos": 900000,
    "deuda": 400000,
    "ahorro": 300000,
    "ocio": 400000,
    "varios": null
  },
  "pillars_by_month": {
    "2026-04": {"ocio": 600000}  // Override mensual
  }
}
```
- `pillars`: Presupuesto por defecto de cada pilar
- `pillars_by_month`: Override mes específico (opcional)
- Si un pilar es `null` → sin presupuesto, sin alertas

#### `data/user.json`
```json
{
  "id": "u_luisd",
  "nombre": "Luis Daniel Martínez",
  "email": "nassirsamur@gmail.com",
  "moneda": "COP",
  "plan": "PRO"
}
```

---

### **2. PROCESAMIENTO: Funciones Core**

#### **2.1 Cálculo de Métricas (Determinista)**

**Anual**: `compute_metrics(transactions, budgets, year)`
```python
# Devuelve:
{
  "ingTot": 45000000,           # Ingreso total del año
  "gasTot": 25000000,           # Gasto total del año
  "necesidadesPct": 45,         # % de Fijos + Deuda
  "deseosPct": 28,              # % de Ocio + Varios
  "salud": 75,                  # Health Score (0-100)
  "semaforo": {...},            # Estado mes a mes por pilar
  "budgetChanges": [...]        # Cambios de presupuesto detectados
}
```

**Trimestral**: `compute_period(transactions, budgets, months)`
```python
# months = [(2025, 1), (2025, 2), (2025, 3)]  # Tuplas (año, mes)
# Similar al anual pero para 3 meses
```

**Mensual**: `compute_month(transactions, budgets, year, month, trailing=6)`
```python
# Devuelve:
{
  "byPil": {"fijos": 850000, ...},      # Gasto por pilar
  "cumpl": {"fijos": 94, ...},          # % de cumplimiento
  "health": 68,                          # Salud del mes
  "delta_pil": {"fijos": +5, ...},      # Variación vs promedio
  "spikes": [{"cat":"Ocio", ...}],      # Categorías que subieron
  "peak_days": [{"date":"2026-04-15"}]  # Días más gastadores
}
```

---

#### **2.2 Presupuestos Vigentes**

**Función**: `budget_for(budgets, pillar, year, month)`
```python
# Retorna presupuesto de un pilar en un mes específico
# Prioridad: pillars_by_month[mes] > pillars[pilar] > None

bud = budget_for(budgets, "ocio", 2026, 4)
# Si 2026-04 tiene override → 600000
# Si no → 400000 (default)
```

**Función**: `budget_sum(budgets, pillar, months)`
```python
# Suma presupuesto de un pilar sobre varios meses
total_ahorro = budget_sum(budgets, "ahorro", [(2025, 1), (2025, 2), (2025, 3)])
# Suma: presupuesto enero + febrero + marzo
```

---

#### **2.3 Detección de Cambios**

**Función**: `budget_changes(budgets, months)`
```python
# Devuelve qué pilares cambiaron de presupuesto en el periodo
[
  {"pillar": "ocio", "changes": [{"mes": "Abr", "from": 400000, "to": 600000}]}
]
```

---

### **3. NARRATIVA: IA (Externalizada)**

#### `prompts.json`
```json
{
  "base_system": "Eres un asesor financiero...",
  "instrucciones": {
    "annual": "Analiza métricas anuales y devuelve JSON con...",
    "quarterly": "Analiza trimestre y devuelve...",
    "monthly": "Analiza mes y devuelve..."
  }
}
```

**Función**: `generate_analysis_m(metrics, llm_call=None)`
- Si `llm_call` es None → usa fallback determinista
- Si `llm_call` está presente → llama IA
- IA retorna JSON con: `verdict`, `alertas`, `recomendaciones`

**Prompts retornan JSON con este schema**:
```json
{
  "verdict": {
    "label": "Excelente|Sólido|Mejorable|En riesgo",
    "sub": "Texto breve de diagnóstico"
  },
  "alertas": [
    {"titulo": "Ocio fuera de control", "detalle": "Gastaste $X..."}
  ],
  "recomendaciones": [
    {"titulo": "Título de la rec", "detalle": "Acción específica..."}
  ]
}
```

---

### **4. RENDERIZADO: HTML → PDF**

#### **4.1 Función `render_html()`**

**Anual**:
```python
render_html(metrics, analysis, user_name, year, publish_date, logo)
```
- Retorna string HTML completo
- Incluye todos los `<style>` inlineados (no CSS externo)
- Una `<div class="foot">` con pie de página

**Trimestral**:
```python
render_html(m, analysis, cmp, prev, prev_months_list, user_name, ...)
```
- `m`: métricas del trimestre actual
- `cmp`: comparativa vs trimestre anterior (o None)
- `prev_months_list`: tuplas del trimestre anterior

**Mensual**:
```python
render_html(m, an, user_name, publish_date, logo)
```
- `m`: métricas del mes
- `an`: análisis IA

---

#### **4.2 Design Tokens (Constantes Visuales)**

```python
ORDER = ["fijos", "deuda", "ahorro", "ocio", "varios"]

LABEL = {
  "fijos": "Fijos",
  "deuda": "Deuda",
  ...
}

PASTEL = {  # Colores donut/barras
  "fijos": "#93C5FD",  # azul pastel
  "ahorro": "#86EFAC",  # verde pastel
  ...
}

PILBG = {  # Fondo de chips
  "fijos": "#EFF6FF",  # azul muy clarito
  ...
}

PILTX = {  # Texto de chips
  "fijos": "#2563EB",  # azul oscuro
  ...
}
```

---

#### **4.3 Bloques Visuales**

**Anual (3 páginas)**:
1. Header + KPIs (Ingresos, Egresos, Ahorro, Liquidez)
2. Health Score + 50/30/20 tabla + Donut
3. Comportamiento mensual + Barras + Semáforo
4. Top categorías + Logros
5. Adopción por método de captura

**Trimestral (2 páginas)**:
1. Header + Health Score
2. Punto de Partida OR Comparativa vs trimestre anterior
3. Muro (2 logros + 2 alertas)
4. Semáforo + Recomendaciones

**Mensual (1 página)**:
1. Header + KPIs (Ingresos, Egresos, Ahorro Formal, Saldo)
2. Health Band (componentes del puntaje)
3. Barras de cumplimiento (ORDENADAS POR GASTO)
4. Comparativa vs promedio O Punto de Partida
5. Alertas + Picos de categoría + Días pico
6. Recomendaciones

---

#### **4.4 Semáforo (Tabla Mensual)**

Lógica especial:
- **Fijos, Deuda, Ocio**: ROJO si > 100%, AMARILLO si 70-100%, VERDE si < 70%
- **Ahorro**: VERDE si ≥ 100%, AMARILLO si 70-99%, ROJO si < 70%
- **Varios**: Sin presupuesto → no aparece

Colores:
```
< 70%:   #DCFCE7 (verde suave)    Texto: #16A34A
70-100%: #FEF3C7 (amarillo suave) Texto: #B45309
> 100%:  #FEE2E2 (rojo suave)     Texto: #DC2626 + borde rojo
```

---

#### **4.5 Barras de Cumplimiento (Mensual)**

**Escala común** en pesos:
```python
S = max(spent[p], budget[p] para todos los pilares) * 1.04

Para cada pilar:
  mark = budget[p] / S * 100  # Línea del presupuesto
  base_w = min(spent[p], budget[p]) / S * 100  # Parte verde/amarilla
  over_w = (spent[p] - budget[p]) / S * 100    # Parte roja (si existe)
```

**Ordenadas por gasto** (mayor a menor):
```python
pillars = sorted(pillars, key=lambda p: spent[p], reverse=True)
```

---

### **5. PDF: WeasyPrint**

#### `to_pdf(html, out_path)`

**Parámetros de @page**:

**Anual**:
```css
@page { size:A4; margin:9mm 11mm 11mm 11mm; }
```

**Trimestral**:
```css
@page { size:A4; margin:9mm 11mm 11mm 11mm; }  /* Heredado de anual */
```

**Mensual**:
```css
@page { size:A4; margin:5mm 7mm 12mm 7mm; }
```

#### Footer: Solo Última Página

```css
.foot { 
  position: fixed; 
  bottom: 3mm; 
  left: 11mm; 
  right: 11mm; 
  display: none;  /* Escondido por defecto */
}

@page :last .foot { 
  display: block;  /* Visible solo en última página */
}
```

---

## 🚀 Ejemplos de Uso

### **Anual 2025 (con IA)**
```bash
python3 example_llm_integration.py
```
- Lee `data/transactions_db.json`, `data/budgets.json`, `data/user.json`
- Llama IA para narrativa
- Genera `output/Informe_ORUS_Anual_2025.pdf`

### **Trimestral Q1 2025 (sin IA)**
```bash
python3 run_quarterly_q1_2025.py
```
- Meses: Enero, Febrero, Marzo 2025
- IA mock (sin API)
- Genera `output/Informe_ORUS_Trimestral_Ene-Mar_2025.pdf`

### **Mensual Abril 2026 (sin IA)**
```bash
python3 run_monthly_ia.py
```
- Mes: Abril 2026
- IA mock (sin API)
- Genera `output/Informe_ORUS_Mensual_Abril2026.pdf`

---

## 📊 Cómo Se Ven los Reportes

### **Anual (3 páginas)**
- **Pág 1**: Encabezado ORUS + KPIs + Health Score + Tabla 50/30/20 + Donut
- **Pág 2**: Gráfico mensual + Tabla de cumplimiento + Semáforo + Budget changes
- **Pág 3**: Top categorías + Logros + Adopción por método + Footer

### **Trimestral (2 páginas)**
- **Pág 1**: Encabezado + Health Score + Comparativa vs trimestre anterior (o Punto de Partida)
- **Pág 2**: Muro (logros + alertas) + Semáforo + Recomendaciones + Footer

### **Mensual (1 página)**
- **Header**: ORUS logo + "INFORME MENSUAL" + KPIs en 4 columnas
- **Health Band**: Índice de salud con 3 componentes (Ahorro, Cumplimiento, Cobertura)
- **Barras**: Cumplimiento por pilar (ordenadas por gasto, escala común)
- **Comparativa**: vs promedio últimos 6 meses O Punto de Partida (primer mes)
- **Alertas**: Máximo 4, con picos de categoría y días pico
- **Recomendaciones**: Máximo 3
- **Footer** (solo en esta página, fijo abajo): Mes, usuario, transacciones

---

## 🎨 Detalles Visuales

### **Título del Documento PDF**
```html
<title>Análisis Financiero 2025 · Luis Daniel Martínez</title>          <!-- Anual -->
<title>Análisis Trimestral Ene–Mar 2025 · Luis Daniel Martínez</title>   <!-- Trimestral -->
<title>Informe Mensual Abril 2026 · Luis Daniel Martínez</title>        <!-- Mensual -->
```

### **Colores por Pilar**
| Pilar | Pastel | Chip BG | Chip Texto |
|-------|--------|---------|-----------|
| Fijos | #93C5FD | #EFF6FF | #2563EB |
| Deuda | #FCA5A5 | #FEF2F2 | #DC2626 |
| Ahorro | #86EFAC | #F0FDF4 | #16A34A |
| Ocio | #C4B5FD | #F5F3FF | #7C3AED |
| Varios | #FDE68A | #FFFBEB | #B45309 |

### **Health Score Formula**
```
Health = 0.40 × (Ahorro%) + 0.35 × (Cumplimiento%) + 0.25 × (Cobertura ratio)
Rango: 0-100
Verde: ≥ 70 | Amarillo: 50-69 | Rojo: < 50
```

---

## 🔌 Integración con Backend

**Para producción:**

1. **Reemplazar mock data** con queries a BD:
   ```python
   # En lugar de json.load(open(...))
   transactions = db.query_transactions(user_id, start_date, end_date)
   budgets = db.query_budgets(user_id)
   user = db.query_user(user_id)
   ```

2. **Reemplazar IA mock** con llamada real:
   ```python
   # En lugar de mock_llm_call
   from anthropic import Anthropic
   
   def anthropic_llm_call(messages):
       client = Anthropic()
       resp = client.messages.create(...)
       return resp.content[0].text
   ```

3. **Email integration** (stub):
   ```python
   def email_report(user_email, pdf_path):
       # Usar Resend, SendGrid, SES, etc.
       pass
   ```

---

## 🛠️ Reglas de Desarrollo

- **Design tokens** en constants → nunca hardcodear colores
- **Presupuestos variable** via `pillars_by_month` → soportar cambios mes a mes
- **Mes vencido**: Siempre hechos en pasado, recomendaciones futuro
- **Footer solo última página**: `@page :last` selector
- **Barras mensual ordenadas por gasto**: `sorted(pillars, key=lambda p: spent[p])`
- **Sin espacios en blanco**: Márgenes adaptativos, componentes compactados
- **Fallback IA**: Si no hay LLM, usar análisis determinista

---

## 📝 Cambios Recientes (v10.7.7)

✅ Footer fijo solo en última página (todos los informes)
✅ Pilares en mensual ordenados por gasto (descendente)
✅ Títulos dinámicos en PDF (`<title>` tag)
✅ Espaciado inteligente (no se ve apretado ni con huecos)
✅ Prompts externalizados en `prompts.json`
✅ Presupuestos variable por mes (`pillars_by_month`)

---

## 📞 Preguntas Frecuentes

**¿Cómo cambio el presupuesto de un mes?**
→ Edita `budgets.json` → `pillars_by_month["2026-04"]["ocio"] = 600000`

**¿Cómo agrego una nueva categoría?**
→ Agrega en `transactions_db.json`. Las categorías se detectan automáticamente.

**¿Puedo cambiar los prompts de IA?**
→ Sí, edita `prompts.json`. Los generadores cargan de ahí automáticamente.

**¿Por qué el mensual cabe en 1 página?**
→ CSS compactado: márgenes ajustados, fuentes pequeñas, espacios minimizados. Todo en componentes.

**¿Qué pasa si no hay datos de un mes?**
→ La función `compute_month()` lanza `ValueError`. Verifica que existan transacciones.

---

**Versión**: 10.7.7
**Última actualización**: Julio 2026
**Mantenedor**: ORUS Finanzas
