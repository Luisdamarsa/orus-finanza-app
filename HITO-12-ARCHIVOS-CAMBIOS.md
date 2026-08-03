# HITO 12: MAPA DE ARCHIVOS → CAMBIOS

## 📍 DASHBOARD (Vista Principal)

### 1. HEADER (Luis Daniel, Buenos días)
**Archivo:** `HeaderService.jsx`
**Línea aprox:** 49 (div principal del header)
**Cambios:**
- Aplicar `t.bg` (color de fondo correcto) ✓ YA ESTÁ
- Aplicar `t.border` (borde inferior correcto) ✓ YA ESTÁ
- Texto "Luis Daniel": color `t.text`, weight 800
- Texto "Buenos días": color `t.sub`, weight 600
- Botón Settings: gradient `raised`, shadow `shadow`, icon stroke 1.6

**Subcomponentes dentro:**
- Settings button (row 1)
- GastadoIngresosBar (condicionalmente)

---

### 2. BOTONES GASTADO / INGRESOS
**Archivo:** `GastadoIngresosBar.jsx`
**Línea aprox:** 14-60 (dos botones)
**Estado actual:** Tiene estilos hardcodeados de colores y fondos
**Cambios necesarios:**
- Botón GASTADO inactivo: `surfaceFlat` + `border` + `text.sub`
- Botón GASTADO activo: `#EF444433` (rojo con alpha) + borde rojo + text `#EF4444`
- Botón INGRESOS inactivo: `surfaceFlat` + `border` + `text.sub`
- Botón INGRESOS activo: `#86EFAC33` (verde con alpha) + borde verde + text `#86EFAC`
- Aplicar `shadowSm` cuando activo
- Usar `RADIUS.sm` en lugar de hardcodeado `8`

---

### 3. PERIODO BUTTON (May, Junio, etc.)
**Archivo:** `Periodo.jsx`
**Línea aprox:** 18 (botón derecho)
**Cambios:**
- Background inactivo: `surfaceFlat`
- Background activo: `raised` gradient
- Border: `border` token
- Text: `accent` color cuando activo
- Shadow: `shadowSm` cuando activo
- Icon calendar: Lucide icon en lugar de emoji 📅

---

### 4. STICKY ZONE (zona con donut y tarjetas)
**Archivo:** `DashboardScreen.jsx`
**Línea aprox:** 85 (div con ref stickyZoneRef)
**Cambios:**
- Background: debe ser `t.bg` (ya está correctamente)
- Shadow dinámico: correctamente usa `p1 > 0.05` ✓

---

### 5. DONUT CHART
**Archivo:** `DonutChart.jsx`
**Cambios realizados:** 
- ✅ rotateX(8deg) + drop-shadow para efecto flotante
- ✅ Colores dinámicos con tokens
- ✅ Textos con `tokens.sub` y `tokens.text`

**Aún pendiente:** Verificar que los colores pilares sean exactos

---

### 6. TAGS DE PILARES (debajo del donut)
**Archivo:** `DonutTagsBar.jsx`
**Cambios:**
- Tag inactivo: `surfaceFlat` background + `border`
- Tag activo: pillar color con alpha 0.16 (dark) / 0.14 (light) + border pillar color
- Shadow: `shadowSm` cuando activo
- Border radius: `RADIUS.pill`
- Text color: dinámico según estado activo/inactivo

---

### 7. TARJETAS DE PILARES (grid 2x3)
**Archivo:** `PillarCardsGrid.jsx`
**Cambios realizados:**
- ✅ Gradient surface en lugar de color plano
- ✅ Shadow "main" en lugar de "sm"
- ✅ `className="clay-hoverable"` para hover effect

**Aún pendiente:**
- Verificar borde (1.5px solid `border`)
- Verificar padding interno (14px)
- Verificar radius (16-24px, mejor 20px)

---

### 8. BARRA DE PRESUPUESTO dentro de tarjetas
**Archivo:** `PillarProgressBar.jsx` (o similar)
**Cambios:**
- Background: pillar color + alpha 0.16/0.14
- Border: 1.5px dashed pillar color
- Fill: pillar color saturado (left-to-right)
- Cuando excedido: rojo (#EF4444) o verde (#22C55E para ahorro)
- Aplicar clip-path para el fill rounded

---

### 9. BARRA DE MOVIMIENTOS (bottom)
**Archivo:** `MovimientosBar.jsx`
**Cambios:**
- Background: `surfaceFlat`
- Border top: 1px `border`
- Shadow: `shadowSm`
- Texto: `text.primary`
- Icon chevron: Lucide icon, rotar en X cuando expanded

---

### 10. FAB BUTTONS (Lupa, Lápiz, Micrófono)
**Archivo:** `FloatingActionButtons.jsx`
**Cambios realizados:**
- ✅ `className="clay-tap"` en todos
- ✅ Importa useTheme y tokens
- ✅ Icon stroke width correcto

**Aún pendiente:**
- Verificar que Lupa use `raised` gradient
- Verificar que Lápiz use `raised` gradient
- Verificar que Micrófono use `accent` gradient + `shadow`
- Icon size: 16px (lupa, lápiz), 22px (micrófono)

---

## 📍 OTROS COMPONENTES (Secundarios)

### 11. PILLAR TAGS BAR (etiquetas horizontales de pilares)
**Archivo:** `PillarTagsBar.jsx`
**Cambios realizados:**
- ✅ Usa getPillarColor() dinámicamente
- ✅ Border radius con RADIUS.md

---

### 12. PÁGINA DE SETTINGS
**Archivo:** `SettingsPage.jsx`
**Cambios realizados:**
- ✅ Usa Lucide icons
- ✅ `className="clay-tap"` en botones

---

### 13. PÁGINA DE CATEGORÍAS
**Archivo:** `CategoriesPage.jsx`
**Cambios realizados:**
- ✅ Lucide icon en título

---

### 14. PÁGINA DE AUTOMATIZACIONES
**Archivo:** `AutomatizacionesPage.jsx`
**Cambios realizados:**
- ✅ Lucide icon en título

---

### 15. PÁGINA DE INFORMES
**Archivo:** `ReportsPage.jsx`
**Cambios realizados:**
- ✅ Lucide icon en título

---

### 16. PÁGINA DE MIS INFORMES
**Archivo:** `MyReportsPage.jsx`
**Cambios realizados:**
- ✅ Lucide icon en título

---

## 🎯 RESUMEN DE PRIORIDADES

### FASE 1 - HEADER (Alto impacto visual)
1. ✅ HeaderService - estilos header
2. ✅ GastadoIngresosBar - botones GASTADO/INGRESOS
3. ✅ Periodo - botón período

### FASE 2 - DONUT + TARJETAS (Core dashboard)
4. ✅ DonutChart - float effect + colores
5. ✅ DonutTagsBar - tags styling
6. ✅ PillarCardsGrid - surface gradient + shadow
7. ✅ PillarProgressBar - barra presupuesto

### FASE 3 - INTERACCIÓN (FABs + bottom)
8. ✅ FloatingActionButtons - gradients + shadows
9. ✅ MovimientosBar - estilos bar

### FASE 4 - LIGHT MODE VERIFICATION
10. Verificar todos los elementos en light mode con colores saturados

---

## 🔗 ARCHIVOS RELACIONADOS (No tocar en Hito 12, pero referencia)
- `clayStyles.js` - utilidades de estilos clay (ya están listas)
- `colorUtils.js` - utilidades de color (ya existen getPillarColor, etc.)
- `tokens.js` - design tokens (ya actualizados a valores exactos)
- `DashboardContext.jsx` - contexto global (mantener igual)
- `ThemeContext.jsx` - contexto de tema (mantener igual)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] HeaderService: header texts + settings button
- [ ] GastadoIngresosBar: colores + sombras + radios
- [ ] Periodo: gradient raised + border + accent color
- [ ] DonutChart: verify pillar colors exactos
- [ ] DonutTagsBar: tag styling + active states
- [ ] PillarCardsGrid: borde + padding + radius exactos
- [ ] PillarProgressBar: dashed border + pillar colors
- [ ] FloatingActionButtons: verify all shadows + icon sizes
- [ ] MovimientosBar: surface + border + shadow
- [ ] Light mode: test all components light mode

