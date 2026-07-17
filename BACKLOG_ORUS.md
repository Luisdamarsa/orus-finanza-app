# 🗺️ Backlog ORUS — hoja de trabajo

> Tus notas organizadas en **hitos** para atacar poco a poco. Dentro de cada hito, orden sugerido.
> Base: prod-v10.5.0 (17 jul 2026).

**Leyenda — tipo:** 🐛 lógica · 🎨 UI/formato · 📄 página nueva · ⚖️ legal · 🔔 feature · 🔍 investigar
**Dificultad:** 🟢 baja · 🟡 media · 🔴 alta

---

## Hito 1 — Correcciones de lógica (quick wins, cierran comportamiento ya construido)
| # | Tipo | Item | Dif |
|---|------|------|-----|
| 1.1 | ✅ | ~~Nombre de categoría en periodos anteriores al editar~~ — **analizado; diferido a fase BD** (ver Decisión 1.1) | 🟡 |
| 1.2 | 🐛 | Definir qué muestra la **página de Movimientos cuando el periodo es anual** (hoy los presupuestos se ocultan; falta el detalle) | 🟡 |
| 1.3 | 🐛 | Si una **sesión no carga** → colapsarla y ocultarla (no dejar bloque vacío/roto) | 🟢 |

> **Decisión 1.1 (17 jul 2026) — diferido a fase BD.**
> Hoy el nombre en el desglose usa un `queryDate` fijo al día 15, lo que hace que el mes del cambio dependa arbitrariamente de si editaste antes/después del 15.
> **Diseño acordado (a implementar en BD, con timestamps reales):**
> - **Barra/desglose** (Movimientos + popup del pilar) = nombre **al final del periodo visto** (mes → fin de mes; año/"todo" → nombre actual). Se logra cambiando el `queryDate` de día-15 a fin de periodo (igual que ya hace el presupuesto).
> - **Filas** (tarjetas de transacción) = nombre del **momento exacto** de la transacción (fecha + hora). Requiere combinar `date`+`time` y comparar sin redondear al día, alineando zona horaria (`changedAt` es UTC, `time` es local).
> - **Año/"todo"** = Opción 1: un solo nombre (el actual) agrupa todo el `id`; las filas conservan el nombre histórico. Si la categoría se "vuelve otra cosa" → eso es **crear categoría nueva**, no un rename.
> Motivo de diferir: la precisión hora + zona horaria sólo tiene sentido con timestamps de BD; no vale reescribir el resolver ahora.

## Hito 2 — Rendimiento de movimientos
| # | Tipo | Item | Dif |
|---|------|------|-----|
| 2.1 | 🔔 | Cargar **movimientos en tandas de 15** (paginación / scroll infinito). *Prepara el mismo patrón para la fase BD (API paginada).* | 🟡 |

## Hito 3 — Loading real
| # | Tipo | Item | Dif |
|---|------|------|-----|
| 3.1 | 🎨 | Activar **skeletons + spinner** de carga. *Hoy `isLoading` está muerto; al implementarlo se re-conecta el `setIsLoading` que quitamos en la limpieza de lint.* | 🟡 |

## Hito 4 — Pulido visual (tarjetas y barras)
| # | Tipo | Item | Dif |
|---|------|------|-----|
| 4.1 | 🎨 | Formato del **popup de tarjetas de pilares** | 🟡 |
| 4.2 | 🎨 | Formato de las **tarjetas de pilares** | 🟡 |
| 4.3 | 🔍🎨 | **Barra de presupuesto de pilares** — *decisión con MJ*, luego implementar | 🟢 |
| 4.4 | 🎨 | **Animación** en la página de "mostrar ingresos" | 🟢 |
| 4.5 | 🎨 | **Iconos para categorías** (definir set + mapping) | 🟡 |

## Hito 5 — Marca
| # | Tipo | Item | Dif |
|---|------|------|-----|
| 5.1 | 🎨 | **Logo** | 🟡 |

## Hito 6 — Páginas de Configuración faltantes (dar página a los botones)
| # | Tipo | Item | Dif |
|---|------|------|-----|
| 6.1 | 📄 | **Automation** | 🟡 |
| 6.2 | 📄 | **Informes** | 🔴 |
| 6.3 | 📄 | **Sobre la app** | 🟢 |
| 6.4 | 📄 | **Sobre permisos** | 🟢 |
| 6.5 | 📄 | **Suscripciones / plan** (modelo $10.000 COP/mes) | 🟡 |

## Hito 7 — Legal & Privacidad (bloquea publicación)
| # | Tipo | Item | Dif |
|---|------|------|-----|
| 7.1 | 🔍 | Investigar **qué datos pide la app** en login Google/Apple (ref. TikTok) | 🟢 |
| 7.2 | ⚖️ | **Términos y Condiciones + Aviso de Privacidad** (ref. TikTok; Ley 1581/2012 Habeas Data — ver `DECISION_ARQUITECTURA_DB.md`) | 🟡 |

## Hito 8 — Auth & Onboarding (grande, cierra el flujo de entrada)
| # | Tipo | Item | Dif |
|---|------|------|-----|
| 8.1 | 📄 | **Login page** (Google / Apple). *Conecta con `detectLanguage`/`detectCurrency` que ya dejamos listos para onboarding real.* | 🔴 |
| 8.2 | 🔔 | **Onboarding** (primeros pasos, sin fricción) | 🔴 |
| 8.3 | 🔔 | **Notificaciones** — permisos + lectura de notificaciones bancarias (**core del producto**, probablemente su propio épico) | 🔴 |

---

## Orden sugerido para arrancar
Primero los **quick wins** que cierran cosas ya construidas y no dependen de nada:
**1.3 → 1.1 → 1.2 → 4.4 → 4.3 (tras hablar con MJ)**.
Luego escoges track: **pulido visual (Hito 4)**, **páginas de config (Hito 6)** o **rendimiento (2.1)**.
Los grandes (Auth/Onboarding/Notificaciones, Hito 8) y lo legal (Hito 7) los dejamos para cuando entremos a la fase BD, porque dependen de backend real.

> Nota: la **fase BD** (Supabase + Auth + RLS) es transversal — varios items (login, notificaciones, suscripciones, T&C) se cierran de verdad ahí. Ver `DECISION_ARQUITECTURA_DB.md`.
