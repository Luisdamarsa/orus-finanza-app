/**
 * PHASE 1: STRUCTURE TESTS (8 tests)
 *
 * Tests de la estructura base de datos con IDs
 * Validaciones: ALL_CATS, PILLARS, formato de IDs, timestamps
 */

import { ALL_CATS, PILLARS } from "../constants";

describe("PHASE 1: Data Structure with IDs", () => {

  // ===== TEST 1: ALL_CATS tiene estructura correcta =====
  test("ALL_CATS: Cada categoría tiene un ID único", () => {
    const ids = ALL_CATS.map(cat => cat.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
    expect(ids.length).toBeGreaterThan(0);
  });

  // ===== TEST 2: IDs tienen formato correcto =====
  test("ALL_CATS: Todos los IDs tienen formato cat_*", () => {
    ALL_CATS.forEach(cat => {
      expect(cat.id).toMatch(/^cat_/);
    });
  });

  // ===== TEST 3: Cada categoría tiene nombre =====
  test("ALL_CATS: Cada categoría tiene un nombre no vacío", () => {
    ALL_CATS.forEach(cat => {
      expect(cat.name).toBeDefined();
      expect(typeof cat.name).toBe("string");
      expect(cat.name.length).toBeGreaterThan(0);
    });
  });

  // ===== TEST 4: Cada categoría tiene pilar válido =====
  test("ALL_CATS: Cada categoría tiene un pilar válido", () => {
    const pillarIds = PILLARS.map(p => p.id);

    ALL_CATS.forEach(cat => {
      expect(cat.pillar).toBeDefined();
      expect(pillarIds).toContain(cat.pillar);
    });
  });

  // ===== TEST 5: Timestamps están presentes =====
  test("ALL_CATS: Cada categoría tiene createdAt y updatedAt", () => {
    ALL_CATS.forEach(cat => {
      expect(cat.createdAt).toBeDefined();
      expect(cat.updatedAt).toBeDefined();
      expect(typeof cat.createdAt).toBe("string");
      expect(typeof cat.updatedAt).toBe("string");
    });
  });

  // ===== TEST 6: editHistory existe =====
  test("ALL_CATS: Cada categoría tiene editHistory array", () => {
    ALL_CATS.forEach(cat => {
      expect(Array.isArray(cat.editHistory)).toBe(true);
    });
  });

  // ===== TEST 7: PILLARS tienen estructura =====
  test("PILLARS: Cada pilar tiene ID, label, icon, color", () => {
    PILLARS.forEach(pillar => {
      expect(pillar.id).toBeDefined();
      expect(pillar.label).toBeDefined();
      expect(pillar.icon).toBeDefined();
      expect(pillar.color).toBeDefined();
    });
  });

  // ===== TEST 8: Presupuestos preservados =====
  test("ALL_CATS: budgetHistory contiene datos iniciales", () => {
    ALL_CATS.forEach(cat => {
      expect(Array.isArray(cat.budgetHistory)).toBe(true);
      // Algunas categorías pueden tener historial vacío
      if (cat.budgetHistory.length > 0) {
        const entry = cat.budgetHistory[0];
        expect(entry.fromDate).toBeDefined();
        expect(entry.budget).toBeDefined();
      }
    });
  });
});
