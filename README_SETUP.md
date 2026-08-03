# 🚀 ORUS - Finanzas Personales

## ⚡ Inicio Rápido

TODO está integrado en una sola carpeta. Solo ejecuta:

```bash
cd Codigo
npm install
npm run dev
```

Eso es. Punto. Fin.

---

## 📍 Qué se inicia

Cuando ejecutas `npm run dev`, se lanzan **DOS servidores en paralelo**:

### 1️⃣ **Frontend React** (Puerto 5173)
```
http://localhost:5173
```
- La app donde registras transacciones, editas presupuestos, ves reportes
- Hot reload automático cuando cambias archivos en `src/`

### 2️⃣ **Backend Node.js** (Puerto 3001)
```
http://localhost:3001
```
- Express + CORS
- Endpoints para exportar datos y congelar períodos
- Scheduler automático (verifica cada hora si es fin de período)
- Ejecuta Python automáticamente para generar PDFs

---

## 📁 Estructura Completa

```
Codigo/
├─ src/                          ← Frontend React
│  ├─ components/
│  │  ├─ ReportsTestPanel.jsx    ← Panel de prueba
│  │  └─ ...
│  ├─ services/
│  │  └─ reportExportService.js  ← Cliente que llama al backend
│  └─ ...
│
├─ server/                       ← Backend Node.js (TODO INTEGRADO)
│  ├─ index.js                   ← Entry point (corre en 3001)
│  ├─ routes/
│  │  └─ reports.routes.js       ← Rutas /api/...
│  ├─ services/
│  │  ├─ exportDataService.js    ← Exporta datos a JSON
│  │  ├─ freezeDataService.js    ← Congela datos
│  │  ├─ pythonExecutorService.js ← Ejecuta Python
│  │  └─ schedulerService.js     ← Scheduler automático
│  ├─ utils/
│  │  └─ dateUtils.js            ← Helpers de fechas
│  └─ package.json               ← ⚠️ OBSOLETO (usa el root)
│
├─ informes-anuales/             ← Generador de reportes
│  ├─ data/                       ← JSON exportados (transitorio)
│  ├─ output/                     ← PDFs congelados (permanente)
│  ├─ orus_monthly_report.py     ← Script Python
│  ├─ orus_quarterly_report.py   ← Script Python
│  ├─ orus_annual_report.py      ← Script Python
│  ├─ generate_monthly_report_wrapper.py    ← Wrapper
│  ├─ generate_quarterly_report_wrapper.py  ← Wrapper
│  └─ generate_annual_report_wrapper.py     ← Wrapper
│
└─ package.json                  ← ✅ ÚNICO (contiene todo)
   ├─ dependencies: react, express, cors, node-cron
   ├─ devDependencies: vite, concurrently, eslint
   └─ scripts:
      ├─ npm run dev           → Lanza ambos
      ├─ npm run dev:frontend  → Solo React
      ├─ npm run dev:backend   → Solo Node.js
      └─ npm run build         → Build production
```

---

## 🧪 Testeando (Opción A)

### Paso 1: Exportar datos

En la app React (`http://localhost:5173`):
1. Ve a cualquier pantalla donde haya el componente `ReportsTestPanel`
2. Click en **"📤 Exportar Datos"**

Verás en consola:
```
✅ Datos exportados correctamente
   Transacciones: 160
   Pilares: 5
   Usuario: Luis Daniel Martinez
```

Archivos creados:
```
Codigo/informes-anuales/data/
├─ transactions_db.json  ✅
├─ budgets.json          ✅
└─ user.json             ✅
```

### Paso 2: Congelar período

1. Cambia la fecha en el input (ej: `2026-01-31`)
2. Click en **"🔒 Congelar Período"**

En consola del **servidor Node.js** (terminal donde corre `npm run dev`):
```
✅ Mes congelado: Informe_ORUS_Mensual_January2026
🚀 Iniciando generación de PDFs...
✅ PDFs generados: { monthly: { success: true, ... } }
```

Archivos generados:
```
Codigo/informes-anuales/output/
└─ Informe_ORUS_Mensual_January2026/
   ├─ info.json    ← Datos congelados
   └─ report.pdf   ✅ ← PDF generado automáticamente
```

### Paso 3: Verificar estado

Click en **"📊 Ver Estado"**

Retorna:
```json
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

## 🔧 Scripts Disponibles

| Script | Qué hace |
|--------|----------|
| `npm run dev` | Lanza React + Node.js juntos (ESTO ES LO QUE USAS) |
| `npm run dev:frontend` | Solo React (puerto 5173) |
| `npm run dev:backend` | Solo Node.js (puerto 3001) |
| `npm run build` | Build production |
| `npm run server` | Corre Node.js una sola vez (sin watch) |
| `npm run server:dev` | Corre Node.js con auto-reload |

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```
(Instala todas las dependencias del proyecto)

### "Error executing Python"
1. Verifica que Python 3.8+ está instalado:
   ```bash
   python3 --version
   ```
2. Verifica que los scripts existen:
   ```bash
   ls Codigo/informes-anuales/generate_*_wrapper.py
   ```

### React y Node.js no se lanzan juntos
```bash
# Si algo falla, intenta:
npm install -g concurrently
npm run dev
```

### ¿Dónde están mis PDFs?
```bash
ls -la Codigo/informes-anuales/output/
```
Deberías ver carpetas como `Informe_ORUS_Mensual_January2026/`

---

## ✅ Checklist Antes de Empezar

- [ ] Node.js 18+ instalado
- [ ] Python 3.8+ instalado
- [ ] `cd Codigo` hecho
- [ ] `npm install` ejecutado
- [ ] `npm run dev` corriendo (verás ambos servidores iniciando)
- [ ] React en `http://localhost:5173` ✅
- [ ] Node.js en `http://localhost:3001` ✅ (health check funciona)

---

## 📊 Endpoints Disponibles

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/export-current-data` | POST | Exporta datos actuales a JSON |
| `/api/freeze-period` | POST | Congela período y genera PDFs |
| `/api/scheduler-status` | GET | Estado del scheduler |
| `/health` | GET | Health check del servidor |

---

**¡Listo para usar! 🎉**

Si preguntas aparecen, revisa `server/OPCION_B_FLUJO_COMPLETO.md` para más detalles técnicos.
