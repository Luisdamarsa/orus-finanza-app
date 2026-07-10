# 🎨 PillarProgressBar - Guía de Uso

## Componentes Creados

| Archivo | Propósito |
|---------|-----------|
| `PillarProgressBar.jsx` | Barra visual segmentada con pilares |
| `usePillarProgressAnimation.js` | Hook con lógica de animación |
| `PillarProgressBar.demo.jsx` | Demo interactiva para ver la animación |

---

## ¿Por qué esta arquitectura?

✅ **Separación de responsabilidades:**
- `PillarProgressBar.jsx` = Renderización visual
- `usePillarProgressAnimation.js` = Lógica de animación

✅ **Reutilizable:**
- Usa el mismo componente en Estado 1 y Estado 2
- Cambia solo los datos (pillars, saldo)

✅ **Mantenible:**
- Cambios de animación = edita solo el hook
- Cambios visuales = edita solo el componente

✅ **Lógica centralizada:**
- Keyframes en un solo lugar
- Control de animación (shouldAnimate)

---

## 🔧 ARREGLO DE ANIMACIÓN (v2)

### El Problema
La animación no era visible porque usaba `width: 100%` en el keyframe, pero cada segmento tiene un ancho diferente.

### La Solución
✅ **Variables CSS dinámicas:** Ahora cada segmento usa `--target-width` con su ancho específico.

```javascript
// Antes (❌ NO FUNCIONABA)
width: `${segmentWidth}%`
animation: `pillarFill 0.6s ease-out ${index * 0.1}s forwards`

// Ahora (✅ FUNCIONA)
"--target-width": `${segmentWidth}%`,
width: shouldAnimate ? "0%" : `${segmentWidth}%`,
animation: shouldAnimate ? `pillarFill 0.6s ease-out ${index * 0.1}s forwards` : "none",
```

El keyframe ahora usa:
```css
@keyframes pillarFill {
  from { width: 0 !important; }
  to { width: var(--target-width, 100%) !important; }
}
```

---

## Cómo Usar

### En MovimientosPage.jsx

```jsx
import PillarProgressBar from "./PillarProgressBar";

// Dentro del componente:
export default function MovimientosPage({ isDark, pilar, ... }) {
  // ... código existente ...

  // Datos de pilares en orden: Fijos, Deuda, Ahorro, Ocio, Varios
  const pillarData = [
    { id: "fijos", label: "Fijos", color: "#22C55E", percentage: 30 },
    { id: "deuda", label: "Deuda", color: "#EF4444", percentage: 25 },
    { id: "ahorro", label: "Ahorro", color: "#10B981", percentage: 20 },
    { id: "ocio", label: "Ocio", color: "#F59E0B", percentage: 15 },
    { id: "varios", label: "Varios", color: "#8B5CF6", percentage: 10 },
  ];

  const saldoData = {
    exists: true,
    percentage: 5,
    color: "#94A3B8",
  };

  return (
    <div>
      {/* Barra solo anima en primer load */}
      <PillarProgressBar
        pillars={pillarData}
        saldo={saldoData}
        shouldAnimate={true}  // true en primer load
        isDark={isDark}
        height={32}
      />

      {/* Cuando filtra por sección, NO anima */}
      {selectedCategories.length > 0 && (
        <PillarProgressBar
          pillars={pillarData}
          saldo={saldoData}
          shouldAnimate={false}  // false al filtrar
          isDark={isDark}
          height={32}
        />
      )}
    </div>
  );
}
```

---

## Props del Componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `pillars` | Array | `[]` | Array de pilares: `{id, label, color, percentage}` |
| `saldo` | Object | `null` | Objeto saldo: `{exists, percentage, color}` |
| `shouldAnimate` | Boolean | `true` | Anima el relleno (false al filtrar) |
| `isDark` | Boolean | `false` | Tema oscuro |
| `height` | Number | `32` | Alto de la barra en píxeles |

---

## Animación

### Características

- **Duración:** 0.6 segundos
- **Easing:** ease-out (suave)
- **Tipo:** Width: 0% → target-width
- **Staggered:** Cada segmento se anima con 0.1s de delay
- **Sin animación al filtrar:** `shouldAnimate={false}` desactiva animación

### Keyframe (ARREGLADO)

```css
@keyframes pillarFill {
  from {
    width: 0 !important;
    opacity: 0.7;
  }
  to {
    width: var(--target-width, 100%) !important;
    opacity: 1;
  }
}
```

Usa `var(--target-width)` en lugar de `100%` para respetar el ancho específico de cada segmento.

---

## Orden de Pilares (Fijo)

La barra siempre muestra en este orden, independientemente de datos:

1. 🟢 **Fijos** - Verde
2. 🔴 **Deuda** - Rojo
3. 🟢 **Ahorro** - Verde oscuro
4. 🟠 **Ocio** - Naranja
5. 🟣 **Varios** - Púrpura
6. ⚪ **Saldo** - Gris (si existe)

---

## Ejemplo Completo en MovimientosPage

```jsx
// En MovimientosPage.jsx, reemplazar la barra actual con:

import PillarProgressBar from "./PillarProgressBar";

export default function MovimientosPage({
  isDark,
  pilar,
  transactions,
  selectedPeriod,
  categories = {},
}) {
  // ... código existente ...

  // Calcular porcentajes de pilares
  const PILLAR_ORDER = [
    { id: "fijos", label: "Fijos", color: "#22C55E" },
    { id: "deuda", label: "Deuda", color: "#EF4444" },
    { id: "ahorro", label: "Ahorro", color: "#10B981" },
    { id: "ocio", label: "Ocio", color: "#F59E0B" },
    { id: "varios", label: "Varios", color: "#8B5CF6" },
  ];

  const pillarPercentages = {}; // Calcular desde datos
  const pillarData = PILLAR_ORDER.map(p => ({
    ...p,
    percentage: pillarPercentages[p.id] || 0,
  }));

  const hasBalance = true; // Verificar si hay saldo
  const saldoData = {
    exists: hasBalance,
    percentage: 5, // Calcular desde datos
    color: "#94A3B8",
  };

  return (
    <div>
      {/* Nueva barra segmentada con animación arreglada */}
      <PillarProgressBar
        pillars={pillarData}
        saldo={saldoData}
        shouldAnimate={!selectedCategories.length > 0}  // Anima solo sin filtro
        isDark={isDark}
        height={32}
      />
      
      {/* ... resto del código ... */}
    </div>
  );
}
```

---

## ✨ Ventajas de esta arquitectura

1. **Limpio:** Dos archivos con responsabilidades claras
2. **Reutilizable:** Usa el mismo componente en múltiples lugares
3. **Mantenible:** Cambios centralizados en un solo lugar
4. **Escalable:** Fácil agregar nuevos pilares o funciones
5. **Testeables:** Cada pieza se prueba por separado
6. **Performante:** Animación CSS pura (no JavaScript)

---

## 🎯 Control de Animación

```jsx
// ANIMAR (primer load)
<PillarProgressBar shouldAnimate={true} ... />

// NO ANIMAR (al filtrar)
<PillarProgressBar shouldAnimate={false} ... />
```

El hook detecta automáticamente cuándo animar basado en `shouldAnimate`.

---

## 🧪 Ver Demo

Para ver la barra en acción con animación, importa y usa:

```jsx
import PillarProgressBarDemo from "./PillarProgressBar.demo";

export default function App() {
  return <PillarProgressBarDemo />;
}
```

---

**Versión:** 2.0 (ARREGLADA)  
**Fecha:** 2026-07-08  
**Estado:** ✅ Animación funcional
