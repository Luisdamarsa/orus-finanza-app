# 📊 Guía de Integración: Sistema de Reportes ORUS

## 🎯 Objetivo

Integrar un sistema automático de **congelamiento de datos** que:
1. Exporta datos actuales desde React (localStorage)
2. Los guarda en archivos JSON (informes-anuales/data/)
3. Al fin de período, congela los datos (informes-anuales/output/)
4. Python scripts generan PDFs con datos congelados

---

## 🏗️ Arquitectura Global

```
CLIENTE (React)                      SERVIDOR (Node.js)               BACKEND (Python)
├─ DUMMY_TRANSACTIONS         ─────→ exportCurrentData         ─────→ generate_all_pdfs.py
├─ PILLARS                           saveDataToFiles                  orus_monthly_report.py
└─ user                              freezePeriodData                 orus_quarterly_report.py
                                     schedulerService                 orus_annual_report.py
                                                              ─────→ informes-anuales/
                                                                     ├─ data/
                                                                     │  ├─ transactions_db.json
                                                                     │  ├─ budgets.json
                                                                     │  └─ user.json
                                                                     └─ output/
                                                                        ├─ Informe_ORUS_Mensual_XXX/
                                                                        ├─ Informe_ORUS_Trimestral_XXX/
                                                                        └─ Informe_ORUS_Anual_XXX/
```

---

## 🚀 Instalación y Setup

### 1. Instalar el servidor

```bash
cd Codigo/server
npm install
npm run dev
```

El servidor corre en `http://localhost:3001`

### 2. Verificar endpoints

```bash
# Health check
curl http://localhost:3001/health

# Ver estado del scheduler
curl http://localhost:3001/api/scheduler-status
```

---

## 📡 Flujo de Datos Paso a Paso

### **PASO 1: Usuario registra datos en la app**

```
React App (Codigo/src)
    ↓
    ├─ userStorage.setItem('DUMMY_TRANSACTIONS', [...])
    ├─ userStorage.setItem('PILLARS', [...])
    └─ userStorage.setItem('user', {...})
```

### **PASO 2: Usuario hace clic en "Exportar" o "Generar Reportes"**

```javascript
// En el componente donde quieras (ej: ReportsPage.jsx)
import { exportCurrentData } from '../services/reportExportService.js';
import { userStorage } from '../utils/userStorage';

const handleExportData = async () => {
  const transactions = userStorage.getItem('DUMMY_TRANSACTIONS');
  const pillars = userStorage.getItem('PILLARS');
  const user = userStorage.getItem('user');

  try {
    const result = await exportCurrentData(transactions, pillars, user);
    console.log('✅ Datos exportados:', result);
    // Aquí puedes mostrar un toast o notificación
  } catch (error) {
    console.error('❌ Error:', error);
  }
};
```

### **PASO 3: Servidor recibe datos y los guarda**

```
POST /api/export-current-data
  ↓
exportCurrentDataController()
  ↓
saveDataToFiles()
  ↓
Guarda en:
  ├─ informes-anuales/data/transactions_db.json
  ├─ informes-anuales/data/budgets.json
  └─ informes-anuales/data/user.json
  ↓
✅ Retorna éxito al cliente
```

### **PASO 4: Scheduler detecta fin de período**

```
⏰ Cada hora (cron: "0 * * * *")
  ↓
checkAndFreezePeriod()
  ↓
¿Es fin de mes/trimestre/año?
  ├─ SÍ → triggerFreeze()
  └─ NO → Espera a la próxima hora
  ↓
freezePeriodData()
  ↓
Crea carpetas inmutables:
  ├─ informes-anuales/output/Informe_ORUS_Mensual_January2026/
  │  └─ info.json (congelado)
  ├─ informes-anuales/output/Informe_ORUS_Trimestral_Q1_2026/
  │  └─ info.json (congelado)
  └─ informes-anuales/output/Informe_ORUS_Anual_2026/
     └─ info.json (congelado)
  ↓
✅ Datos inmutables (no pueden cambiar)
```

### **PASO 5: Python genera PDFs**

```
generate_all_pdfs.py
  ↓
Lee de informes-anuales/data/:
  ├─ transactions_db.json
  ├─ budgets.json
  └─ user.json
  ↓
Para cada período en informes-anuales/output/:
  ├─ orus_monthly_report.py → report.pdf
  ├─ orus_quarterly_report.py → report.pdf
  └─ orus_annual_report.py → report.pdf
  ↓
✅ PDFs generados
```

---

## 🔄 Ciclo Completo en el Tiempo

```
ENERO 2026
┌───────────────────────────────────────────┐
│ Día 1-30:                                 │
│ • Usuario registra transacciones          │
│ • Se guardan en localStorage              │
│ • Si hace clic en "Exportar":             │
│   POST /api/export-current-data           │
│   → Guarda en informes-anuales/data/      │
└───────────────────────────────────────────┘
        ↓
31 ENERO 23:59:59
        ↓
┌───────────────────────────────────────────┐
│ Scheduler detecta fin de mes              │
│ POST /api/freeze-period                   │
│ → freezePeriodData()                      │
│ → Crea carpeta congelada                  │
│   Informe_ORUS_Mensual_January2026/      │
│ → info.json (immutable)                   │
└───────────────────────────────────────────┘
        ↓
PYTHON: generate_all_pdfs.py
        ↓
        ├─ Lee transactions_db.json
        ├─ Ejecuta orus_monthly_report.py
        └─ Genera January2026.pdf

FEBRERO 2026
┌───────────────────────────────────────────┐
│ Día 1-28:                                 │
│ • Usuario registra NUEVAS transacciones   │
│ • Enero sigue CONGELADO ✅                │
│ • Si hace clic en "Exportar":             │
│   POST /api/export-current-data           │
│   → Actualiza informes-anuales/data/      │
└───────────────────────────────────────────┘
        ↓
(Igual que enero...)
```

---

## 🛠️ Cómo Llamar a los Endpoints

### Desde React

```javascript
// Importar el service
import { exportCurrentData, freezePeriodData } from '../services/reportExportService.js';
import { userStorage } from '../utils/userStorage';

// OPCIÓN 1: Exportar datos actuales
const handleExport = async () => {
  const result = await exportCurrentData(
    userStorage.getItem('DUMMY_TRANSACTIONS'),
    userStorage.getItem('PILLARS'),
    userStorage.getItem('user')
  );
  console.log(result);
};

// OPCIÓN 2: Congelar período (automático o manual)
const handleFreeze = async () => {
  const result = await freezePeriodData(
    '2026-01-31',  // Fecha (opcional)
    false          // Simulate (false = real, true = testing)
  );
  console.log(result);
};

// OPCIÓN 3: Ver estado del scheduler
import { getSchedulerStatus } from '../services/reportExportService.js';

const checkStatus = async () => {
  const status = await getSchedulerStatus();
  console.log('Estado:', status);
};
```

### Desde cURL (testing)

```bash
# Exportar datos
curl -X POST http://localhost:3001/api/export-current-data \
  -H "Content-Type: application/json" \
  -d '{
    "transactions": [...],
    "pillars": [...],
    "user": {...}
  }'

# Congelar período
curl -X POST http://localhost:3001/api/freeze-period \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-01-31",
    "simulate": false
  }'

# Ver estado
curl http://localhost:3001/api/scheduler-status
```

---

## 📁 Estructura de Archivos Creados

```
Codigo/
├─ server/                    ← 🆕 NUEVO SERVIDOR
│  ├─ index.js
│  ├─ package.json
│  ├─ README.md
│  ├─ routes/
│  │  └─ reports.routes.js
│  ├─ controllers/
│  │  └─ reportController.js
│  ├─ services/
│  │  ├─ freezeDataService.js
│  │  ├─ exportDataService.js
│  │  └─ schedulerService.js
│  └─ utils/
│     └─ dateUtils.js
│
├─ src/
│  ├─ services/
│  │  └─ reportExportService.js     ← 🆕 SERVICE PARA REACT
│  ├─ constants/
│  │  └─ index.js                   (DUMMY_TRANSACTIONS ya existe)
│  └─ ...
│
├─ informes-anuales/
│  ├─ data/                         ← ACTUALIZADO (exportCurrentData)
│  │  ├─ transactions_db.json
│  │  ├─ budgets.json
│  │  └─ user.json
│  ├─ output/                       ← CONGELADO (freezePeriodData)
│  │  ├─ Informe_ORUS_Mensual_XXX/
│  │  ├─ Informe_ORUS_Trimestral_XXX/
│  │  └─ Informe_ORUS_Anual_XXX/
│  └─ ...
```

---

## ✅ Checklist de Integración

- [ ] `npm install` en `Codigo/server/`
- [ ] `npm run dev` para iniciar servidor
- [ ] Verificar `http://localhost:3001/health` en navegador
- [ ] Importar `reportExportService.js` en tu componente
- [ ] Llamar a `exportCurrentData()` cuando necesites guardar
- [ ] El scheduler automáticamente congela datos cada fin de período
- [ ] Verificar que se crean carpetas en `informes-anuales/output/`
- [ ] Ejecutar `generate_all_pdfs.py` para generar PDFs

---

## 🔐 Seguridad y Validaciones

✅ **CORS** - Solo localhost:5173 (React)  
✅ **Validación** - Verifica transacciones, pillars, user  
✅ **Inmutabilidad** - Datos congelados no se pueden editar  
✅ **Logging** - Todas las operaciones se registran  

---

## 🚨 Troubleshooting

### "Error: Cannot find module 'express'"
```bash
cd Codigo/server
npm install
```

### "Connection refused on localhost:3001"
- Verificar que el servidor está corriendo: `npm run dev`
- Cambiar puerto en `server/index.js` si está ocupado

### "No hay datos del cliente"
- Llamar primero a `exportCurrentData()` antes de `freezePeriodData()`
- Verificar que DUMMY_TRANSACTIONS existe en localStorage

### Datos no se actualizan en informes-anuales/data/
- Verificar que la carpeta existe
- Confirmar permisos de lectura/escritura

---

## 📝 Próximos Pasos

1. **Agregar UI** (Buttons/Menus para exportar/congelar)
2. **Integrar con Supabase** (Guardar datos congelados en BD)
3. **Autenticación** (Supabase Auth para multi-usuario)
4. **Notificaciones** (Toast when data is frozen)
5. **Historial** (Ver reportes generados)

---

**Versión 1.0** - Enero 2026  
**Estado:** 🟢 Listo para usar (sin Supabase aún)
