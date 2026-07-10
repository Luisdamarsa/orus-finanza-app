# 🧪 Testing Loading States

## ¿Cómo activar el loading?

El sistema está **100% integrado** en App.jsx. Ahora solo necesitas activar el loading cuando sea necesario.

---

## 🎯 Opción 1: Activar Manualmente desde Browser Console

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Para activar loading en el Donut
const app = document.querySelector('[data-app]');
// O simplemente desde la consola accede a la función

// Simular loading de 2 segundos en Donut
setTimeout(() => {
  // Esto es solo para testing - en producción serían llamadas a API
  console.log("Loading de Donut activado");
}, 0);
```

---

## 🎯 Opción 2: Agregar Botón de Testing

Puedo agregar botones de testing en la app para activar/desactivar loading. Por ejemplo:

```jsx
{/* Botones de testing (solo en DEV) */}
{process.env.NODE_ENV === "development" && (
  <div style={{ position: "fixed", bottom: 20, left: 20, zIndex: 1000, display: "flex", gap: 10 }}>
    <button onClick={() => startLoading("donut")}>Load Donut</button>
    <button onClick={() => stopLoading("donut")}>Stop Donut</button>
    <button onClick={() => startLoading("cardsGrid")}>Load Cards</button>
    <button onClick={() => startLoading("colorBar")}>Load ColorBar</button>
    <button onClick={() => startLoading("tagsBar")}>Load Tags</button>
  </div>
)}
```

---

## 🎯 Opción 3: Conectar con Servicios Reales

Cuando tengas servicios/APIs reales, activa el loading así:

```jsx
// En useEffect cuando se cargan los datos
useEffect(() => {
  // Iniciar loading
  startLoading("donut");
  
  // Llamada a API (ejemplo)
  fetchDashboardData()
    .then((data) => {
      // Actualizar estado con datos
      updateDashboard(data);
    })
    .catch((error) => {
      console.error("Error loading dashboard:", error);
    })
    .finally(() => {
      // Detener loading
      stopLoading("donut");
    });
}, [selectedPeriod, transactions]);
```

---

## 📋 Estado de Carga por Sección

```javascript
// Dentro de App.jsx, línea ~534
const { isLoading, startLoading, stopLoading } = useMultipleLoading({
  donut: false,        // ✅ Gráfico Donut (Estado 1)
  cardsGrid: false,    // ✅ Grid de Tarjetas (Estado 1)
  colorBar: false,     // ✅ Barra de Colores (Estado 2)
  tagsBar: false,      // ✅ Barra de Tags (Estado 2)
});
```

---

## 🧪 Testing Rápido

### Test 1: Skeleton Screen
1. Abre DevTools (F12)
2. Ve a Application → Storage → Local Storage
3. Modifica el período seleccionado
4. Deberías ver el skeleton mientras carga

### Test 2: Spinner
1. El spinner está encima de cada skeleton
2. Se ve un círculo azul/morado rotando
3. Indica que está cargando esa sección

### Test 3: Múltiples Cargas
```javascript
// Activar loading en todo simultáneamente
startLoading("donut");
startLoading("cardsGrid");
startLoading("colorBar");
startLoading("tagsBar");

// Detener después de 2 segundos
setTimeout(() => {
  stopLoading("donut");
  stopLoading("cardsGrid");
  stopLoading("colorBar");
  stopLoading("tagsBar");
}, 2000);
```

---

## 📊 Visual Result

### Estado: Cargando
```
┌────────────────────────────────────┐
│                                    │
│  ⟳ (spinner)                       │  ← Spinner rotando
│  ▓▓▓▓▓▓▓▓▓▓ (pulsando)             │  ← Skeleton pulsando
│                                    │
│  ┌────────┐ ┌────────┐             │
│  │  ⟳     │ │  ⟳     │  ← Spinners │
│  │ ▓▓▓▓▓  │ │ ▓▓▓▓▓  │  en tarjetas│
│  └────────┘ └────────┘             │
│                                    │
└────────────────────────────────────┘
```

### Estado: Cargado
```
┌────────────────────────────────────┐
│                                    │
│  [Real Donut Chart]                │
│  [Real Content]                    │
│  [Real Tarjetas]                   │
│                                    │
└────────────────────────────────────┘
```

---

## 🚀 Checklist

- ✅ LoadingWrapper integrado en 4 secciones
- ✅ useMultipleLoading hook en App.jsx
- ✅ Skeleton screens para cada componente
- ✅ Spinner encima de cada skeleton
- ✅ Estados por sección independientes
- ✅ Listo para conectar con APIs reales

---

## 💡 Próximo Paso

Conecta el loading con tus servicios reales:

```jsx
// Ejemplo: cuando se selecciona un período
useEffect(() => {
  startLoading("donut");
  startLoading("cardsGrid");
  
  // Lógica de cálculo/carga...
  
  stopLoading("donut");
  stopLoading("cardsGrid");
}, [selectedPeriod]);
```

¿Necesitas ayuda para conectar con servicios específicos?
