/**
 * budget-history-flow.test.js
 *
 * Test para validar que el flujo de historial de presupuestos funciona correctamente:
 * 1. Editar presupuesto → se registra en historial con timestamp
 * 2. Recuperar presupuesto de período anterior → devuelve valor histórico
 * 3. Recuperar presupuesto de período actual → devuelve valor actual
 */

import { describe, it, expect, beforeEach } from "vitest";
import { addHistoryEntry, getAttributeAtDate } from "../services/attributeHistoryService";
import { setCategoryBudget } from "../services/categoryCatalogService";
import { ALL_CATS } from "../constants";

describe("Budget History Flow", () => {
  let testCategory;

  beforeEach(() => {
    // Crear una categoría de prueba CON valor inicial en historial
    // ⭐ IMPORTANTE: El historial SIEMPRE debe comenzar con el valor inicial
    testCategory = {
      id: "test_deuda",
      name: "Deuda Test",
      pillar: "deuda",
      budget: 100000,  // Presupuesto ACTUAL
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-08-01T00:00:00Z",
      deletedAt: null,
      history: [
        // ⭐ Valor inicial siempre registrado
        { field: "budget", old: null, new: 100000, changedAt: "2025-01-01T00:00:00Z" }
      ]
    };

    // Agregar a ALL_CATS simulado
    if (!ALL_CATS.find(c => c.id === testCategory.id)) {
      ALL_CATS.push(testCategory);
    }
  });

  it("Debería registrar cambios de presupuesto en historial con timestamp", () => {
    // Simular edición de presupuesto en agosto
    const oldBudget = testCategory.budget;
    const newBudget = 500000;

    addHistoryEntry(testCategory, "budget", oldBudget, newBudget);
    testCategory.budget = newBudget;

    // Verificar que el cambio está en el historial
    expect(testCategory.history.length).toBe(1);
    expect(testCategory.history[0]).toMatchObject({
      field: "budget",
      old: 100000,
      new: 500000,
    });
    expect(testCategory.history[0].changedAt).toBeDefined();
  });

  it("Debería devolver valor histórico para período anterior al cambio", () => {
    // Presupuesto inicial: 100k (hasta agosto 14)
    // Cambio en agosto 15: 100k → 500k

    const changeDate = new Date("2025-08-15T10:00:00Z");
    addHistoryEntry(
      testCategory,
      "budget",
      100000,
      500000
    );
    // Actualizar changedAt manualmente para simular fecha
    testCategory.history[0].changedAt = changeDate.toISOString();
    testCategory.budget = 500000;

    // Consultar presupuesto para mayo (período anterior)
    const mayBudget = getAttributeAtDate(testCategory, "budget", "2025-05-15");
    expect(mayBudget).toBe(100000);  // Debe devolver valor actual en mayo

    // Consultar presupuesto para agosto 5 (antes del cambio)
    const augEarlyBudget = getAttributeAtDate(testCategory, "budget", "2025-08-05");
    expect(augEarlyBudget).toBe(100000);  // Debe devolver el valor antes del 15
  });

  it("Debería devolver valor actual para período después del cambio", () => {
    const changeDate = new Date("2025-08-15T10:00:00Z");
    addHistoryEntry(
      testCategory,
      "budget",
      100000,
      500000
    );
    testCategory.history[0].changedAt = changeDate.toISOString();
    testCategory.budget = 500000;

    // Consultar presupuesto para agosto 20 (después del cambio)
    const augLateBudget = getAttributeAtDate(testCategory, "budget", "2025-08-20");
    expect(augLateBudget).toBe(500000);  // Debe devolver el valor actual
  });

  it("Debería manejar múltiples cambios en el historial", () => {
    // Agosto 1: 100k
    // Agosto 10: 100k → 200k
    // Agosto 20: 200k → 500k

    testCategory.history = [
      {
        field: "budget",
        old: 100000,
        new: 200000,
        changedAt: "2025-08-10T10:00:00Z"
      },
      {
        field: "budget",
        old: 200000,
        new: 500000,
        changedAt: "2025-08-20T10:00:00Z"
      }
    ];
    testCategory.budget = 500000;

    // Verificar valores en diferentes fechas
    expect(getAttributeAtDate(testCategory, "budget", "2025-08-05")).toBe(100000);  // Antes del 10
    expect(getAttributeAtDate(testCategory, "budget", "2025-08-15")).toBe(200000);  // Entre 10 y 20
    expect(getAttributeAtDate(testCategory, "budget", "2025-08-25")).toBe(500000);  // Después del 20
  });

  it("Debería NO registrar cambio si valor es igual", () => {
    const initialLength = testCategory.history.length;

    // Intentar guardar el mismo valor
    addHistoryEntry(testCategory, "budget", 100000, 100000);

    // No debe agregar entrada al historial
    expect(testCategory.history.length).toBe(initialLength);
  });

  it("Debería devolver valor inicial para período anterior sin cambios", () => {
    // Categoría creada el 2025-01-01 con presupuesto 100k
    // Nunca se editó hasta agosto 15, cuando se cambió a 500k

    addHistoryEntry(
      testCategory,
      "budget",
      100000,
      500000
    );
    // Actualizar changedAt manualmente para simular fecha
    testCategory.history[1].changedAt = "2025-08-15T10:00:00Z";
    testCategory.budget = 500000;

    // Consultar presupuesto para Mayo (período anterior, sin cambios)
    const mayBudget = getAttributeAtDate(testCategory, "budget", "2025-05-15");

    // Debe devolver el valor inicial (100k), NO el valor actual (500k)
    expect(mayBudget).toBe(100000);
    expect(mayBudget).not.toBe(500000);  // Validar que NO devuelve el actual
  });

  it("Debería devolver valor actual para período después del último cambio", () => {
    // Agregar cambios
    addHistoryEntry(testCategory, "budget", 100000, 300000);
    testCategory.history[1].changedAt = "2025-06-01T10:00:00Z";

    addHistoryEntry(testCategory, "budget", 300000, 500000);
    testCategory.history[2].changedAt = "2025-08-15T10:00:00Z";
    testCategory.budget = 500000;

    // Consultar presupuesto para Septiembre (después de todos los cambios)
    const septBudget = getAttributeAtDate(testCategory, "budget", "2025-09-15");

    // Debe devolver el valor actual (500k)
    expect(septBudget).toBe(500000);
  });
});
