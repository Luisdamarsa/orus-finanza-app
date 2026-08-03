# 🎯 Botones que Necesitan Efecto de Presionado/Soltado

## ✅ Archivos Encontrados

### 1. **ReportsPage.jsx** - Botón "Mis Informes"
**Estado:** ✅ YA TIENE EL EFECTO (líneas 287-298)
```javascript
onMouseDown={(e) => {
  e.currentTarget.style.opacity = "0.85";
  e.currentTarget.style.transform = "scale(0.98)";
  console.log("🎤 ReportsPage: Botón 'Mis Informes' PRESIONADO");
}}
onMouseUp={(e) => {
  e.currentTarget.style.opacity = "1";
  e.currentTarget.style.transform = "scale(1)";
  console.log("🎤 ReportsPage: Botón 'Mis Informes' SOLTADO");
}}
```

---

### 2. **AutomatizacionesPage.jsx** - Tarjeta "Notificaciones de Wallet"
**Estado:** ❌ FALTA EL EFECTO (línea 95)

**Ubicación actual:**
```jsx
<button
  onClick={() => setScreen("notifications-setup")}
  style={{
    width: "100%",
    background: t.card,
    border: `1px solid ${t.border}`,
    // ... más estilos
  }}
>
```

**Agregar:**
```javascript
onMouseDown={(e) => {
  e.currentTarget.style.opacity = "0.8";
  e.currentTarget.style.transform = "scale(0.98)";
  console.log("📱 AutomatizacionesPage: Tarjeta 'Notificaciones' PRESIONADA");
}}
onMouseUp={(e) => {
  e.currentTarget.style.opacity = "1";
  e.currentTarget.style.transform = "scale(1)";
  console.log("📱 AutomatizacionesPage: Tarjeta 'Notificaciones' SOLTADA");
}}
onMouseLeave={(e) => {
  e.currentTarget.style.opacity = "1";
  e.currentTarget.style.transform = "scale(1)";
}}
```

---

### 3. **AutomatizacionesPage.jsx** - Tarjeta "Atajos iOS"
**Estado:** ❌ FALTA EL EFECTO (probablemente línea ~200+)

**Debe llevar el mismo efecto:**
```javascript
onMouseDown={(e) => {
  e.currentTarget.style.opacity = "0.8";
  e.currentTarget.style.transform = "scale(0.98)";
  console.log("🎯 AutomatizacionesPage: Tarjeta 'Atajos' PRESIONADA");
}}
onMouseUp={(e) => {
  e.currentTarget.style.opacity = "1";
  e.currentTarget.style.transform = "scale(1)";
  console.log("🎯 AutomatizacionesPage: Tarjeta 'Atajos' SOLTADA");
}}
onMouseLeave={(e) => {
  e.currentTarget.style.opacity = "1";
  e.currentTarget.style.transform = "scale(1)";
}}
```

---

### 4. **MyReportsPage.jsx** - Filtros (Mensual/Trimestral/Anual)
**Estado:** ❌ FALTA EL EFECTO (líneas ~164-187)

**Ubicación actual:**
```jsx
{TABS.map((tab) => (
  <button
    key={tab.id}
    onClick={() => toggleFilter(tab.id)}
    style={{
      padding: "8px 14px",
      borderRadius: 20,
      // ... más estilos
    }}
  >
```

**Agregar:**
```javascript
onMouseDown={(e) => {
  e.currentTarget.style.opacity = "0.8";
  e.currentTarget.style.transform = "scale(0.95)";
  console.log(`📊 MyReportsPage: Filtro '${tab.label}' PRESIONADO`);
}}
onMouseUp={(e) => {
  e.currentTarget.style.opacity = "1";
  e.currentTarget.style.transform = "scale(1)";
  console.log(`📊 MyReportsPage: Filtro '${tab.label}' SOLTADO`);
}}
onMouseLeave={(e) => {
  e.currentTarget.style.opacity = "1";
  e.currentTarget.style.transform = "scale(1)";
}}
```

---

### 5. **SubscriptionPage.jsx** - Botones "Elegir ORUS" y "Continuar"
**Estado:** ❌ FALTA EL EFECTO (búsqueda pendiente)

*Necesito ver el archivo para identificar las líneas exactas*

---

## 🎬 Patrón de Efecto a Usar

```javascript
// PRESIONAR (mouse down)
onMouseDown={(e) => {
  e.currentTarget.style.opacity = "0.8";           // Más oscuro
  e.currentTarget.style.transform = "scale(0.98)"; // Más pequeño
  console.log("🎯 NOMBRE: PRESIONADO");
}}

// SOLTAR (mouse up)
onMouseUp={(e) => {
  e.currentTarget.style.opacity = "1";             // Original
  e.currentTarget.style.transform = "scale(1)";    // Original
  console.log("🎯 NOMBRE: SOLTADO");
}}

// SALIR DEL BOTÓN (mouse leave)
onMouseLeave={(e) => {
  e.currentTarget.style.opacity = "1";
  e.currentTarget.style.transform = "scale(1)";
}}
```

---

## 📋 Checklist

- [ ] AutomatizacionesPage: Tarjeta "Notificaciones" + console.log
- [ ] AutomatizacionesPage: Tarjeta "Atajos" + console.log
- [ ] MyReportsPage: Filtros (3 botones) + console.log
- [ ] SubscriptionPage: Botones "Elegir ORUS" + console.log
- [ ] Verificar en navegador que console muestra todos los logs

---

**Objetivo:** Cuando presiones cada botón, debe:
1. Cambiar de aspecto (opacidad + scale)
2. Mostrar en consola que fue presionado
3. Volver a lo normal al soltar
