# ORUS Finanzas — v10.8.1 (Página de Perfil + Mi Plan)

**Fecha**: 3 de Agosto 2026  
**Estado**: ✅ Completo

---

## RESUMEN DE CAMBIOS

Redesign visual clay exacto de 4 componentes principales:
1. **SettingsPage.jsx** — 10 SVG icons con especificaciones exactas
2. **ProfilePage.jsx** — Página de Perfil con tarjeta editable + FAB flotante
3. **DeleteAccountModal.jsx** — Popup confirmación eliminación cuenta
4. **SubscriptionPage.jsx** — Página "Mi Plan" + Pantalla "Confirmar Plan"

---

## COMPONENTES ACTUALIZADOS

### 1. SettingsPage.jsx
**Cambios:**
- Reemplazados 10 emojis por SVG icons con especificaciones exactas
- Todos los iconos: `15×15px`, `viewBox="0 0 24 24"`, `stroke-width: 1.8`, `stroke-linecap/linejoin: round`
- Heredan color del badge (`currentColor`)

**Iconos implementados:**
- Perfil: círculo + path persona
- Categorías: etiqueta con punto
- Presupuestos: círculo con +
- Mostrar Ingresos: tendencia ascendente
- Mi Plan: gema
- Automatizaciones: rayo
- Permisos: escudo
- Informes: barras verticales
- Preferencias: sliders con círculos
- Acerca de: info en círculo

**Fuente**: Manrope (toda la página)

---

### 2. ProfilePage.jsx
**Cambios:**
- Layout clay exacto: `position:absolute;inset:0;overflow-y:auto;padding:26px 22px 60px`
- Header: Botón Atrás (13px/700) + Botón Cerrar Sesión (12px/700)
- Título: Ícono persona SVG (34×34px) + "Perfil" (18px/800)
- Tarjeta Nombre de Usuario:
  - Input editable (NO div)
  - User ID copiable con SVG icon (12×12px)
  - Estilos: padding 16px 18px, gradient surface, shadow sm
- Sección "INFORMACIÓN PERSONAL":
  - Labels en MAYÚSCULAS (10.5px/700)
  - Campos input (13.5px/600)
  - Todos alineados izquierda
- Botón "Eliminar Cuenta": Gradiente rojo (#FF8A8A→#E4574B), shadow exacto
- FAB flotante: Check icon (52×52px), gradient morado, siempre visible pero deshabilitado si no hay cambios (opacity: 0.4)

**Fuente**: Manrope (toda la página)  
**Shadow**: `0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)`

---

### 3. DeleteAccountModal.jsx
**Cambios:**
- Backdrop: `rgba(0,0,0,0.6)`, `backdrop-filter: blur(3px)`, `z-index: 50`
- Tarjeta centrada: `border-radius: 22px`, surface gradient, shadow lg
- Animación: `clayRise .3s ease both`
- Ícono: Círculo 56×56px, basura tachada SVG (24×24px)
- Textos:
  - Título: `17px/800`
  - Descripción: `13px/700`
  - Advertencia: `11.5px/600` (palabra "irreversible" en 800)
- Botones: "Cancelar" (raised) + "Eliminar Cuenta" (gradiente rojo)

**Fuente**: Manrope

---

### 4. SubscriptionPage.jsx
**Cambios principales:**

#### Pantalla "Mi Plan"
- Header: Botón Atrás (13px/700, #8B87A3)
- Título: Gema SVG (17×17px, stroke-width: 1.8) + "MI PLAN" (18px/800, letter-spacing: .3px)
- Subtítulo: `12.5px/600, #8B87A3`, centrado, line-height: 1.5

**Tarjetas de Plan:**
- Container: `border-radius: 22px`, surface gradient, shadow lg, `padding: 18px`
- Bordes:
  - Free: `1px solid rgba(255,255,255,0.07)`
  - Plus: `1.5px solid #8B5CF6`
  - Pro: `1.5px solid rgba(245,185,61,0.5)`
- Tags flotantes: "MÁS POPULAR" (#8B5CF6) / "+ MÁS COMPLETO" (#F5B93D)
- Ícono plan: 34×34px, radius: 11px, bg: raised
  - Free: Donut real (18×18px) con colores pilares
  - Plus: ⭐ #F5B93D
  - Pro: 👑
- Nombre: `14.5px/800`
- Badge "PLAN ACTUAL": `rgba(134,239,172,0.16)`, `#86EFAC`, `8.5px/800`
- Tagline: `11px/600/sub`, line-height: 1.3
- Chevron: `16×16`, rota 180° al expandir

**Contenido Expandido:**
- Precio: `28px/800` + "USD/mes" `11px/700/sub` + "≈ $COP" `11px/600/muted`
- Features: Check verde (13×13) / X roja (13×13), `12px/600`, italic en highlights
- Botón CTA: `14px padding`, `16px radius`, `13.5px/800`
  - Free: raised, sub color (deshabilitado, opacity: 0.6)
  - Plus: gradient morado (#B18CFF→#8B5CF6), blanco
  - Pro: gradient dorado (#FBBF54→#F5B93D), #241a02

**Footer**: `10px/600/muted`, centrado, margin-top: 18px

#### Pantalla "Confirmar Plan" (Nuevo)
- Accesible haciendo click en "Elegir ORUS Plus/Pro"
- Header: Botón Atrás + Título con gradiente cian→morado (`linear-gradient(90deg,#7DD3FC,#B18CFF)`, `background-clip: text`)
- Tarjeta resumen: Borde `1.5px solid {{accentColor}}` (Plus: #8B5CF6, Pro: #F5B93D)
- Sección "Lo que obtienes": Checks verdes + perks específicos
- Sección "Lo que dicen quienes lo usan": Reseñas con estrellas
  - Plus: Camila R. (5★), Andrés M. (5★), Valentina P. (4★)
  - Pro: Jorge T. (5★), Natalia G. (5★), Simón A. (4★)
- Botones: "Continuar" (gradientes exactos) + "Cancelar"
- Footer: 🔒 + texto seguridad

**Fuente**: Manrope (toda la página)

---

## ESPECIFICACIONES TÉCNICAS

### Tokens de Diseño
- **Surface**: `linear-gradient(155deg,#211d2c 0%,#141220 100%)`
- **Raised**: `linear-gradient(155deg,#262231 0%,#17151f 100%)`
- **Shadow Lg**: `0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`
- **Shadow Sm**: `0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)`

### Fuente Global
- **Font Family**: Manrope (toda la app)
- Tamaños exactos: 8.5px → 28px
- Pesos: 600, 700, 800

### Animaciones
- **Reveal por Scroll**: `opacity 0.5s ease, transform 0.5s ease`
- **Press Effect**: `scale(0.97)`, `opacity: 0.85`
- **Chevron Toggle**: `transform 0.25s ease`, rota 180°
- **clayRise**: `0.3s ease both`

---

## ARCHIVOS MODIFICADOS

```
src/components/
├── SettingsPage.jsx           ✅ SVG icons + Manrope
├── ProfilePage.jsx            ✅ Diseño clay + FAB flotante
├── DeleteAccountModal.jsx     ✅ Popup confirmación
└── SubscriptionPage.jsx       ✅ Mi Plan + Confirmar Plan
```

---

## VERIFICACIÓN

- ✅ Todas las fuentes en Manrope
- ✅ Todos los tamaños/pesos exactos
- ✅ Bordes correctos por plan (Free/Plus/Pro)
- ✅ Colores y gradientes exactos
- ✅ SVG icons en especificaciones
- ✅ Animaciones clayRise + press effects
- ✅ Responsive y accesible
- ✅ Sin imágenes externas (solo SVG/emoji)

---

## PRÓXIMAS FASES

1. Integración con backend de pagos (IAP)
2. Notificaciones push
3. Descargas (jsPDF)
4. Email (EmailJS)
5. Base de datos sincronizada

---

**Versión**: prod-v10.8.1  
**Estado**: Ready for testing  
**Branches**: main (sin cambios de git aún)
