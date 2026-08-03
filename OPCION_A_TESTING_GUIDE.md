# 🧪 Opción A: Guía de Prueba Paso a Paso

## 🎯 Objetivo
Probar el flujo completo: Exportar datos → Congelar período → Generar PDFs automáticamente

---

## 📋 Pre-requisitos

✅ Node.js instalado (v18+)  
✅ Python 3.8+  
✅ Los wrappers Python ya están en: `informes-anuales/generate_*_wrapper.py`  
✅ El servidor Node.js está listo en `server/`  

---

## 🚀 PASO 1: Limpiar la carpeta `output/`

**En tu terminal:**
```bash
# Ir a la carpeta
cd Codigo/informes-anuales/output

# Eliminar TODO excepto .gitkeep (Windows PowerShell)
Remove-Item -Path * -Exclude .gitkeep -Force -Recurse

# O en Bash/Git Bash:
find . -mindepth 1 ! -name '.gitkeep' -delete
```

**Resultado esperado:**
```
output/
└─ .gitkeep (vacío)
```

---

## 🌐 PASO 2: Iniciar el Servidor Node.js

```bash
cd Codigo/server
npm install  # Primera vez solamente
npm run dev
```

**Esperado en terminal:**
```
╔══════════════════════════════════════╗
║  🚀 ORUS Reports Server              ║
║  Servidor: http://localhost:3001     ║
╚══════════════════════════════════════╝

⏰ Scheduler iniciado - verifica cada hora si es fin de período
```

✅ **Servidor corriendo en puerto 3001**

---

## ⚛️ PASO 3: Iniciar React App

**En OTRA terminal:**
```bash
cd Codigo
npm run dev
```

✅ **App corriendo en localhost:5173**

---

## 🧪 PASO 4: Abrir el Panel de Prueba

**En la app React:**

1. Navega a cualquier pantalla
2. Agrega el componente de prueba temporalmente

**En `src/App.jsx` o `src/main.jsx`:**
```javascript
import ReportsTestPanel from './components/ReportsTestPanel';

// Dentro del JSX:
<ReportsTestPanel />
```

O mejor: en la pantalla Settings, agrega:
```javascript
import ReportsTestPanel from '../components/ReportsTestPanel';

export default function SettingsPage() {
  return (
    <div>
      {/* ... otras cosas ... */}
      <ReportsTestPanel />
    </div>
  );
}
```

---

## ✅ PASO 5: Probar los Botones

### **Button 1: Exportar Datos**

```
📤 Click en "Exportar Datos"
  ↓
Debería ver en la consola:
  ✅ Datos exportados correctamente
  
Archivos creados:
  ├─ informes-anuales/data/transactions_db.json
  ├─ informes-anuales/data/budgets.json
  └─ informes-anuales/data/user.json
```

### **Button 2: Congelar Período**

```
Fecha: 2026-01-31
🔒 Click en "Congelar Período"
  ↓
Debería ver en la consola:
  📅 Generando: Informe_ORUS_Mensual_January2026
  ✅ Período congelado y PDFs generados
  
En la terminal del servidor:
  [generate_monthly_report_wrapper.py] ✅ Informe_ORUS_Mensual_January2026
  [orus_monthly_report.py] PDF: ...report.pdf
  
Archivos generados:
  └─ informes-anuales/output/Informe_ORUS_Mensual_January2026/
     ├─ info.json (congelado)
     └─ report.pdf ✅ (NUEVO!)
```

### **Button 3: Ver Estado**

```
📊 Click en "Ver Estado"
  ↓
Debería mostrar:
  {
    "status": "running",
    "hasClientData": true,
    "currentData": {
      "transactions": 160,
      "pillars": 5,
      "user": "Luis Daniel Martinez"
    }
  }
```

---

## 🔄 Probar Varios Períodos

Repite el Button 2 con diferentes fechas:

```
Fechas importantes:
├─ 2026-01-31  → Genera enero (monthly)
├─ 2026-03-31  → Genera marzo + Q1 2026 (monthly + quarterly)
├─ 2025-12-31  → Genera diciembre + Q4 2025 + anual 2025 (monthly + quarterly + annual)
└─ 2026-05-31  → Genera mayo + Q2 2026 (monthly + quarterly)
```

**Cada vez deberías ver nuevas carpetas en `informes-anuales/output/`**

---

## ✨ Verificar Resultados

```bash
# Terminal adicional
cd Codigo/informes-anuales/output

# Ver estructura generada
ls -la
# Deberías ver carpetas como:
# Informe_ORUS_Mensual_January2026/
# Informe_ORUS_Trimestral_Q1_2026/
# Informe_ORUS_Anual_2025/
# ... etc
```

**Cada carpeta contiene:**
```
Informe_XXX/
├─ info.json  (metadatos congelados)
└─ report.pdf (PDF generado automáticamente)
```

---

## 🐛 Troubleshooting

### "Error: Cannot find module 'express'"
```bash
cd Codigo/server
npm install
```

### "Error executing Python"
- Verifica que Python 3.8+ está instalado: `python3 --version`
- Verifica que los wrappers existen: `ls informes-anuales/generate_*_wrapper.py`
- Verifica permisos: `chmod +x informes-anuales/generate_*_wrapper.py`

### "No hay datos del cliente para congelar"
- Primero click en **"Exportar Datos"** antes de congelar

### Los PDFs no se generan
- Revisa la consola del servidor Node.js (terminal 1)
- Revisa que `data/transactions_db.json` existe
- Revisa que los scripts Python tienen permisos: `chmod +x informes-anuales/orus_*.py`

---

## 📊 Resultado Esperado Final

Después de probar todo:

```
informes-anuales/
├─ data/
│  ├─ transactions_db.json  ✅
│  ├─ budgets.json          ✅
│  └─ user.json             ✅
│
├─ output/
│  ├─ Informe_ORUS_Mensual_January2026/
│  │  ├─ info.json  ✅
│  │  └─ report.pdf ✅
│  │
│  ├─ Informe_ORUS_Mensual_March2026/
│  │  ├─ info.json  ✅
│  │  └─ report.pdf ✅
│  │
│  ├─ Informe_ORUS_Trimestral_Q1_2026/
│  │  ├─ info.json  ✅
│  │  └─ report.pdf ✅
│  │
│  └─ ... más períodos ...
│
└─ public/informes-anuales/
   └─ (sincronizado automáticamente con output/)
```

---

## 🎉 ¡Éxito!

Si ves todo lo anterior, el sistema está funcionando perfectamente:

✅ Exportación de datos → OK  
✅ Congelamiento de períodos → OK  
✅ Generación automática de PDFs → OK  
✅ Estructura de carpetas → OK  

**Siguiente paso:** Agregar UI permanente para generar reportes en la app.
