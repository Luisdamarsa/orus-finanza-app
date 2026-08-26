/**
 * attributeHistoryService.js
 *
 * Servicio genérico para obtener valores históricos de atributos
 * (nombre, presupuesto, estado de categorías y pilares)
 *
 * Funciona tanto para categorías como pilares
 */

/**
 * Obtiene el valor de un atributo en una fecha específica
 *
 * @param {Object} entity - Entidad (categoría o pilar) con historial
 * @param {String} field - Campo a consultar (ej: "name", "budget")
 * @param {String} date - Fecha de consulta (formato ISO: "2025-01-15")
 * @returns {Any} El valor que tenía el campo en esa fecha
 *
 * Ejemplos:
 *   getAttributeAtDate(category, "name", "2025-01-15")
 *   getAttributeAtDate(pillar, "budget", "2025-06-20")
 */
export function getAttributeAtDate(entity, field, date) {
  // Si no hay historial, retornar valor actual
  if (!entity.history || entity.history.length === 0) {
    return entity[field];
  }

  // Filtrar cambios del campo especificado
  const fieldHistory = entity.history.filter(change => change.field === field);

  if (fieldHistory.length === 0) {
    // Si no hay historial para este field, retornar valor actual
    return entity[field];
  }

  // 🆕 CRÍTICO: Normalizar fecha consultada a MEDIANOCHE UTC
  // Esto evita problemas con horas dentro del mismo día
  const queryDate = new Date(date);
  queryDate.setUTCHours(0, 0, 0, 0);  // Medianoche UTC

  // 🆕 LÓGICA CORRECTA:
  // 1. Buscar si hay cambios DESPUÉS de la fecha consultada
  //    → Si SÍ, retornar el OLD value del cambio más antiguo después
  // 2. Si NO hay cambios DESPUÉS, buscar cambios ANTES
  //    → Si SÍ, retornar el NEW value del cambio más reciente ANTES
  // 3. Si NO hay cambios en absoluto, retornar valor actual

  // Ordenar por fecha (más antigua primero)
  fieldHistory.sort((a, b) => new Date(a.changedAt) - new Date(b.changedAt));

  // PASO 1: Buscar cambios DESPUÉS de la fecha consultada
  for (const change of fieldHistory) {
    const changeDate = new Date(change.changedAt);
    const changeDateMidnight = new Date(changeDate);
    changeDateMidnight.setUTCHours(0, 0, 0, 0);

    if (changeDateMidnight > queryDate) {
      // Este cambio ocurrió DESPUÉS → retornar el valor ANTERIOR (antes del cambio)
      return change.old;
    }
  }

  // PASO 2: Si no hay cambios DESPUÉS, buscar cambios ANTES (en orden inverso)
  for (let i = fieldHistory.length - 1; i >= 0; i--) {
    const change = fieldHistory[i];
    const changeDate = new Date(change.changedAt);
    const changeDateMidnight = new Date(changeDate);
    changeDateMidnight.setUTCHours(0, 0, 0, 0);

    if (changeDateMidnight <= queryDate) {
      // Este cambio ocurrió ANTES o EL MISMO DÍA → retornar el NEW value (el resultado del cambio)
      return change.new;
    }
  }

  // PASO 3: Si no hay cambios en absoluto, retornar valor actual
  return entity[field];
}

/**
 * Obtiene el valor ACTUAL de un atributo
 * (para páginas como Categorías, Presupuestos, Nueva Transacción)
 *
 * @param {Object} entity - Entidad (categoría o pilar)
 * @param {String} field - Campo a consultar
 * @returns {Any} El valor actual
 */
export function getAttributeCurrent(entity, field) {
  return entity[field];
}

/**
 * Agrega un cambio al historial
 * Llamar cuando se edite un atributo
 *
 * @param {Object} entity - Entidad a modificar
 * @param {String} field - Campo que cambió
 * @param {Any} oldValue - Valor anterior
 * @param {Any} newValue - Nuevo valor
 */
export function addHistoryEntry(entity, field, oldValue, newValue) {
  if (!entity.history) {
    entity.history = [];
  }

  // Solo agregar si realmente cambió
  if (oldValue !== newValue) {
    entity.history.push({
      field,
      old: oldValue,
      new: newValue,
      changedAt: new Date().toISOString(),
    });
  }
}

/**
 * Obtiene si una entidad fue eliminada en una fecha
 *
 * @param {Object} entity - Entidad
 * @param {String} date - Fecha de consulta
 * @returns {Boolean} true si estaba eliminada, false si existía
 */
export function wasDeletedAtDate(entity, field, date) {
  const deletedStatus = getAttributeAtDate(entity, field, date);
  return deletedStatus === true;
}
