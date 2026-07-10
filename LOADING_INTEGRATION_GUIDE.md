# 📦 Loading States - Guía de Integración

## Componentes Creados

### 1. LoadingSpinner.jsx
Spinner circular que va encima de los skeletons

**Uso:**
```jsx
import LoadingSpinner from "./components/LoadingSpinner";

<LoadingSpinner isDark={isDark} size={40} />
```

---

### 2. LoadingSkeleton.jsx
Esqueletos para diferentes secciones con animación de pulsación

**Opciones disponibles:**
- `DonutSkeleton` - Para el gráfico donut
- `CardsGridSkeleton` - Para grid de tarjetas
- `ColorBarSkeleton` - Para barra de colores
- `TagsBarSkeleton` - Para barra de tags
- `TransactionListSkeleton` - Para lista de transacciones

**Uso:**
```jsx
import { DonutSkeleton, CardsGridSkeleton } from "./components/LoadingSkeleton";

<DonutSkeleton isDark={isDark} />
<CardsGridSkeleton isDark={isDark} />
```

---

### 3. useLoading Hook
Hook para manejar estados de carga

**Opciones:**

**useLoading() - Para una sola sección:**
```jsx
import { useLoading } from "./hooks/useLoading";

const { isLoading, startLoading, stopLoading } = useLoading();

// Simular carga
startLoading();
setTimeout(() => stopLoading(), 2000);
```

**useMultipleLoading() - Para varias secciones:**
```jsx
const { isLoading, startLoading, stopLoading } = useMultipleLoading({
  donut: false,
  cards: false,
  colorBar: false,
  tags: false,
});

startLoading("donut");
stopLoading("donut");
```

**useSimulatedLoading() - Para testing:**
```jsx
const { isLoading, simulateLoading } = useSimulatedLoading(1500);

// Llama simulateLoading() para iniciar
simulateLoading();
```

---

### 4. LoadingWrapper.jsx
Componente que alterna entre skeleton y contenido real

**Uso:**
```jsx
import LoadingWrapper from "./components/LoadingWrapper";
import { DonutSkeleton } from "./components/LoadingSkeleton";

<LoadingWrapper
  isLoading={isLoadingDonut}
  skeleton={<DonutSkeleton isDark={isDark} />}
  isDark={isDark}
>
  <DonutChartComponent {...props} />
</LoadingWrapper>
```

---

## 📝 Ejemplo Completo de Integración en App.jsx

### Paso 1: Imports
```jsx
import { useMultipleLoading } from "./hooks/useLoading";
import LoadingWrapper from "./components/LoadingWrapper";
import {
  DonutSkeleton,
  CardsGridSkeleton,
  ColorBarSkeleton,
  TagsBarSkeleton,
} from "./components/LoadingSkeleton";
```

### Paso 2: State
```jsx
// Dentro del componente App
const { isLoading, startLoading, stopLoading } = useMultipleLoading({
  donut: false,
  cardsGrid: false,
  colorBar: false,
  tagsBar: false,
});
```

### Paso 3: Integrar con Donut (Estado 1)
```jsx
{isMovementOpen === false && (
  <div>
    {/* Donut con loading */}
    <LoadingWrapper
      isLoading={isLoading("donut")}
      skeleton={<DonutSkeleton isDark={isDark} />}
      isDark={isDark}
    >
      <DonutChartComponent
        segments={segments}
        cx={114}
        cy={114}
        outerR={90}
        innerR={54}
        activeId={activeId}
        onSelect={handleSelectPillar}
        isDark={isDark}
        gastos={totalSpent}
        total={totalSpent + saldoForDonut}
        totalSpent={totalSpent}
        pillarSpends={pillarSpends}
        hasSaldoAsignado={saldoForDonut > 0}
        saldoValue={saldoForDonut}
      />
    </LoadingWrapper>

    {/* Cards Grid con loading */}
    <LoadingWrapper
      isLoading={isLoading("cardsGrid")}
      skeleton={<CardsGridSkeleton isDark={isDark} />}
      isDark={isDark}
    >
      <PillarCardsGrid {...props} />
    </LoadingWrapper>
  </div>
)}
```

### Paso 4: Integrar con Color Bar (Estado 2)
```jsx
{isMovementOpen === true && filterType !== "ingresos" && (
  <div style={{ overflow: "visible", marginBottom: 12 }}>
    {/* Color Bar con loading */}
    <LoadingWrapper
      isLoading={isLoading("colorBar")}
      skeleton={<ColorBarSkeleton isDark={isDark} />}
      isDark={isDark}
    >
      <div ref={colorBarRef} style={{ marginBottom: 9 }}>
        <ColorBar {...props} />
      </div>
    </LoadingWrapper>

    {/* Tags Bar con loading */}
    <LoadingWrapper
      isLoading={isLoading("tagsBar")}
      skeleton={<TagsBarSkeleton isDark={isDark} />}
      isDark={isDark}
    >
      <PillarTagsBar {...props} />
    </LoadingWrapper>
  </div>
)}
```

---

## ⚙️ Cómo Activar el Loading (Cuando llamar a servicios reales)

### Cuando carguE datos desde API:
```jsx
// Al iniciar la carga de datos
useEffect(() => {
  startLoading("donut");
  
  // Simular llamada a API
  fetchDashboardData()
    .then((data) => {
      // Actualizar estado con datos
      setData(data);
    })
    .finally(() => {
      stopLoading("donut");
    });
}, [selectedPeriod]);
```

---

## 🎨 Características

✅ Skeleton screens con animación de pulsación  
✅ Spinner encima indicando que está cargando  
✅ Múltiples secciones pueden cargar independientemente  
✅ Fácil de integrar con LoadingWrapper  
✅ Responsive y adaptado al tema (dark/light)  
✅ Perfecto para simular latencia de red  

---

## 📱 Resultado Visual

Cuando está cargando:
```
┌─────────────────────────┐
│  ⟳ (spinner)            │  ← Spinner encima
│  ▓▓▓▓▓▓▓▓▓▓  (pulsando)  │  ← Skeleton del contenido
│  ▓▓▓  ▓▓▓  (pulsando)    │
└─────────────────────────┘
```

Cuando termina:
```
┌─────────────────────────┐
│  Real content appears   │
│  Donut / Cards / etc    │
└─────────────────────────┘
```

---

## 🚀 Próximos Pasos

1. Importar los componentes en App.jsx
2. Agregar useMultipleLoading a App
3. Envolver cada sección con LoadingWrapper
4. Conectar con llamadas a servicios reales (cuando sea necesario)
5. Ajustar tiempos de loading según necesidad

¿Quieres que integre esto en App.jsx ahora?
