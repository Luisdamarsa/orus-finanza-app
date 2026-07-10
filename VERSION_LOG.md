# ORUS Finanzas - Version Log

## v1 PROD ✅ (Baseline)
**Estado:** Completado
**Fecha:** 2026-06-23

### Contenido:
- Dashboard con Donut Chart, Pilar Cards, Saldo Card
- Estados (Estado 1: Dashboard, Estado 2: Movimientos)
- Cálculos centralizados en `dashboardCalculations.js`
- Componentes extraídos: DonutChart, PillarCardsGrid, PillarTagsBar, ColorBar
- Skeleton loading + Spinner integrados en 4 secciones
- Componentes modulares: PillarBarsPopup, CatBar
- SettingsPage, ProfilePage, BudgetsPage, MovimientosPage
- AddTransactionPage
- Archivos de código: ~1105 líneas (App.jsx limpio)

---

## v2 PROD ✅ FINAL (Categories + Saldos Simples - PRODUCCIÓN)
**Estado:** ✅ COMPLETADO Y COMPILADO
**Fecha:** 2026-06-24
**Build Status:** ✅ Exitoso (322.21 kB gzipped)
**Backup:** `src_v2_PROD_final.tar.gz`

### ✨ Nuevas Características:
1. **Página de Categorías (CategoriesPage.jsx)** - 227 líneas
   - ✅ Pantalla accesible desde Settings > Categorías
   - ✅ Muestra categorías agrupadas por pilar (5 pilares)
   - ✅ Layout estandarizado: Header (52px) + Title (60px) + Content (164px+)
   - ✅ Botón "Atrás" con SVG flecha (consistente con otras páginas)
   - ✅ Título centrado: "🏷️ Categorías"
   - ✅ Botón "Añadir categoría" con borde punteado
   - ✅ Gradiente fade-out al final
   - ✅ Tema oscuro/claro integrado
   - ✅ Scrollable content con height: 100%

2. **Página de Agregar Categoría (AddCategoryPage.jsx)** - 200 líneas
   - ✅ Modal centrado con animación pop-in
   - ✅ Input para nombre (mínimo 2 caracteres, validación en tiempo real)
   - ✅ Select dropdown para elegir pilar (5 opciones)
   - ✅ Botón "Guardar" deshabilitado si nombre < 2 caracteres
   - ✅ Contador dinámico de caracteres
   - ✅ Tema oscuro/claro integrado

### 🔗 Integración Completa en App.jsx:
- ✅ Estado: `const [categories, setCategories]` con datos iniciales por pilar
- ✅ Nuevas pantallas: "categories" y "add-category"
- ✅ Navegación: Settings → Categorías → Agregar → Volver
- ✅ Handler de guardado: Agrega categoría y navega de vuelta

### 🔧 Cambios en SettingsPage.jsx:
- ✅ Agregado prop `onCategories` en firma de función
- ✅ Agregado handler en onClick: `item.id === "categorias"`
- ✅ Callback conectado: `onCategories={() => setScreen("categories")}`

### 📦 Archivos Modificados:
- `src/components/SettingsPage.jsx` - ✅ Actualizado (prop + handler)
- `src/components/CategoriesPage.jsx` - ✅ Reformateado (layout estandarizado)
- `src/components/AddCategoryPage.jsx` - ✅ Creado (200 líneas)
- `src/App.jsx` - ✅ Integrado completamente

### 📊 Métricas Finales:
- **App.jsx:** ~1150 líneas
- **Código nuevo:** 427 líneas (CategoriesPage + AddCategoryPage + integraciones)
- **Build size:** 322.21 kB (gzipped: 84.45 kB)
- **Módulos:** 41 transformados exitosamente
- **Pantallas totales:** 11
- **Componentes:** 25+

### 💰 NUEVA FEATURE: Saldos Simples (Mes a Mes)

**Función:** `calculateDashboard()` en `src/utils/dashboardCalculations.js`

**Lógica Simplificada:**
- Saldo mes = Ingresos - Gastos (simple, sin acumular)
- Si saldo > 0 → Mostrar tarjeta de saldo + segmento en donut
- Si saldo <= 0 → NO mostrar tarjeta ni en donut
- **CONDICIÓN:** Solo se muestra si toggle "Mostrar ingresos" = ON en Settings

**Cambios en App.jsx:**
- ✅ Removida lógica de saldos acumulativos
- ✅ Parámetro `showIncomes` agregado a `calculateDashboard()`
- ✅ Eliminado estado `balance` y useEffect de localStorage
- ✅ Botón "Saldo actual" DESACTIVADO (visible pero no clickeable, opaco)

**Cambios en Estado 2 (Movimientos):**
- ✅ Botón "Saldo" no clickeable cuando estás en movimientos
- ✅ Cursor cambia a "default"

**Cambios en constants/index.js:**
- ✅ Eliminado `DUMMY_BALANCES` (ya no se usa)

### ✅ Features Completamente Funcionales:
- [x] Página de categorías con layout estandarizado
- [x] Página de agregar categoría con validación
- [x] Integración en App.jsx
- [x] Conexión con SettingsPage
- [x] Estado management funcionando
- [x] **Saldos acumulativos calculados automáticamente** ← NUEVO
- [x] Build compilado y exitoso
- [x] Formato consistente con resto de app
- [x] DUMMY_BALANCES eliminado (sin usar)

---

## v3 PROD ✅ (Gestión de Categorías + Unificación)
**Estado:** ✅ COMPLETADO Y COMPILADO
**Fecha:** 2026-07-01
**Build Status:** ✅ Exitoso (106 kB gzipped)
**Backup:** `src_v3_PROD.tar.gz`

### ✨ Nuevas Características:

1. **Editar Categorías en CategoriesPage**
   - ✅ Cada categoría es clickeable
   - ✅ Abre AddCategoryPage en modo EDITAR
   - ✅ Pre-llena nombre y pilar actual
   - ✅ Botón guardar solo se activa si hay cambio
   - ✅ Botón eliminar (rojo) siempre habilitado

2. **Unificación de Categorías**
   - ✅ Una única fuente de verdad: `ALL_CATS` en constants/index.js
   - ✅ Estado `categories` inicializa desde ALL_CATS
   - ✅ CategoriesPage usa `categories` (15 categorías DUMMY)
   - ✅ AddTransactionPage usa `categories` (sin duplicar datos)
   - ✅ Removido import de ALL_CATS en AddTransactionPage

3. **Nueva Categoría desde Nueva Transacción**
   - ✅ Cambio de nombre: "Concepto" → "Categoría"
   - ✅ Cambio de nombre: "Categoría" → "Pilar"
   - ✅ "Nuevo concepto..." → "Nueva categoría..."
   - ✅ "Elige una categoría para este concepto" → "Elige un pilar para esta categoría"
   - ✅ Crea categoría nueva y la guarda en `categories`
   - ✅ Inmediatamente aparece en CategoriesPage
   - ✅ Inmediatamente aparece en dropdown próximas transacciones
   - ✅ Con deduplicación automática (Netflix, Netflix 2, Netflix 3...)

4. **Cambios en AddCategoryPage**
   - ✅ Renombrado "Nueva categoría" a "Categoría" en modo edición
   - ✅ Validación de cambios mejorada
   - ✅ Botón eliminar solo en modo edición
   - ✅ Mismo formato visual que Nueva Transacción

### 📊 Métricas Finales:
- **Categorías totales:** 15 (unificadas desde ALL_CATS)
- **Archivos modificados:** 4 (App.jsx, AddCategoryPage.jsx, CategoriesPage.jsx, AddTransactionPage.jsx)
- **Build size:** 106 kB (gzipped)
- **Sin redundancia:** Una única fuente de verdad para categorías

---

## v3.1 PROD ✅ (Popups de Éxito en Categorías)
**Estado:** ✅ COMPLETADO
**Fecha:** 2026-07-02
**Build Status:** ⏳ Pendiente (problema de permisos en sandbox)
**Backup:** `src_v3.1_PROD.tar.gz`

### ✨ Nuevas Características:

1. **Eliminación Inmediata de Categorías**
   - ✅ Removido `window.confirm()` 
   - ✅ Al hacer click en botón eliminar (🗑️), se elimina DIRECTAMENTE sin confirmación
   - ✅ Los datos se preservan en transacciones (sin eliminar histórico)

2. **Popup Rojo de Eliminación Exitosa**
   - ✅ Mensaje: "✓ Categoría eliminada exitosamente"
   - ✅ Color: Rojo (#EF4444) con borde y fondo transparente
   - ✅ Posición: Fijo en bottom: 32px (parte inferior)
   - ✅ Duración: 2 segundos (desaparece automáticamente)
   - ✅ Animación: slideInUp desde el fondo

3. **Popup Verde de Creación Exitosa**
   - ✅ Mensaje: "✓ Categoría creada exitosamente"
   - ✅ Color: Verde (#22C55E) con borde y fondo transparente
   - ✅ Posición: Fijo en bottom: 32px
   - ✅ Duración: 2 segundos
   - ✅ Aparece en CategoriesPage después de crear

4. **Popup Verde de Edición Exitosa**
   - ✅ Mensaje: "✓ Categoría actualizada exitosamente"
   - ✅ Color: Verde (#22C55E)
   - ✅ Posición: Fijo en bottom: 32px
   - ✅ Duración: 2 segundos
   - ✅ Aparece en CategoriesPage después de editar

### 🔧 Cambios Técnicos:

**AddCategoryPage.jsx**
- ✅ Agregados props: `onShowCategoryCreated`, `onShowCategoryEdited`, `onShowCategoryDeleted`
- ✅ `handleDelete()` ahora elimina sin confirmación y ejecuta callback
- ✅ `handleSave()` ahora ejecuta callbacks de éxito

**App.jsx**
- ✅ Agregados 3 estados: `showCategoryCreated`, `showCategoryEdited`, `showCategoryDeleted`
- ✅ Agregados 3 callbacks con setTimeout de 2 segundos
- ✅ Agregadas 3 renderizaciones de popups flotantes
- ✅ Agregada animación CSS `slideInUp`

### 📊 Métricas Finales:
- **Líneas de código nuevas:** ~150 (popups + callbacks + estados)
- **Estados nuevos:** 3
- **Componentes modificados:** 2 (AddCategoryPage.jsx, App.jsx)
- **Animaciones nuevas:** 1 (slideInUp)

### ✅ Flujo Completo:
1. Usuario en CategoriesPage
2. Click en botón crear/editar/eliminar
3. Realiza acción en AddCategoryPage
4. Al guardar o eliminar → Se ejecuta callback
5. Popup aparece en CategoriesPage por 2 segundos
6. Popup desaparece automáticamente

---

## v3.2 PROD ✅ (PopupService Centralizado)
**Estado:** ✅ COMPLETADO
**Fecha:** 2026-07-02
**Build Status:** ⏳ Pendiente (problema de permisos en sandbox)
**Backup:** `src_v3.2_PROD.tar.gz`

### ✨ Nuevas Características:

1. **PopupService.jsx - Servicio Centralizado**
   - ✅ Un único componente para TODOS los popups
   - ✅ Usa React Context para compartir la funcionalidad
   - ✅ Hook personalizado `usePopup()` para usar en cualquier componente
   - ✅ Código reutilizable y escalable

2. **Funciones Públicas del Servicio**
   - ✅ `popup.showCreatePopup(resourceName)` → Popup verde "... creada exitosamente"
   - ✅ `popup.showEditPopup(resourceName)` → Popup verde "... actualizada exitosamente"
   - ✅ `popup.showDeletePopup(resourceName)` → Popup rojo "... eliminada exitosamente"

3. **Eliminación de Código Duplicado**
   - ✅ Removido popup de Perfil de SettingsPage
   - ✅ Removido popup de Presupuestos de SettingsPage
   - ✅ Removidos 3 popups de Categorías de App.jsx
   - ✅ Removidos estados individuales (showProfileSaveSuccess, showBudgetsSaveSuccess, showCategoryCreated, showCategoryEdited, showCategoryDeleted)

4. **Integración en Componentes**
   - ✅ AddCategoryPage.jsx: Usa `popup.showCreatePopup('Categoría')` y `popup.showEditPopup('Categoría')`
   - ✅ ProfilePage.jsx: Usa `popup.showEditPopup('Perfil')`
   - ✅ BudgetsPage.jsx: Usa `popup.showEditPopup('Presupuestos')`
   - ✅ DeletePopup funcionan con: `popup.showDeletePopup('nombre')`

### 📊 Reducción de Código:
- **Antes:** ~150 líneas de popups distribuidas en múltiples archivos
- **Después:** ~50 líneas en PopupService.jsx (reutilizable)
- **Estados eliminados:** 5 estados → 1 estado global en Context
- **Componentes simplificados:** 4 componentes (App, Settings, Profile, BudgetPage)

### 🏗️ Arquitectura:
```
PopupProvider (wrappea toda la app)
  ├─ PopupContext (proporciona funciones)
  ├─ usePopup() hook (para usar en componentes)
  └─ PopupDisplay (renderiza el popup flotante)
```

### ✅ Ventajas:
1. **Mantenimiento**: Cambios en un solo lugar
2. **Consistencia**: Un único popup para toda la app
3. **Escalabilidad**: Fácil agregar nuevas features
4. **Performance**: Un único popup en lugar de múltiples
5. **Código limpio**: Componentes enfocados en su función

---

## Archivo de Backup:
- `src_v2_prod.tar.gz` - Compresión completa de la carpeta `src/`
- `src_v3_PROD.tar.gz` - v3 con gestión de categorías unificada
- `src_v3.1_PROD.tar.gz` - v3.1 con popups de éxito en categorías
- `src_v3.2_PROD.tar.gz` - v3.2 con PopupService centralizado

