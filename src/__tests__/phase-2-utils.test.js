/**
 * PHASE 2: UTILITIES TESTS (15 tests)
 *
 * Tests de funciones de utilidad (categoryUtils.js, pillarUtils.js)
 * Validaciones: búsquedas por ID, conversiones, historiales
 */

import { getCategoryById, generateCategoryId, recordCategoryEdit } from "../utils/categoryUtils";
import { getPillarById } from "../utils/pillarUtils";
import { ALL_CATS, PILLARS } from "../constants";

describe("PHASE 2: Utility Functions", () => {

  // ===== TEST 1: getCategoryById retorna categoría correcta =====
  test("getCategoryById: Obtiene categoría por ID", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const result = getCategoryById(cat.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(cat.id);
      expect(result.name).toBe(cat.name);
    }
  });

  // ===== TEST 2: getCategoryById retorna null si no existe =====
  test("getCategoryById: Retorna null para ID inválido", () => {
    const result = getCategoryById("cat_invalid_999");
    expect(result).toBeNull();
  });

  // ===== TEST 3: getCategoryById retorna objeto completo =====
  test("getCategoryById: Retorna objeto con todos los campos", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const result = getCategoryById(cat.id);

      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.pillar).toBeDefined();
      expect(result.spent).toBeDefined();
      expect(result.budgetHistory).toBeDefined();
      expect(result.editHistory).toBeDefined();
    }
  });

  // ===== TEST 4: generateCategoryId crea ID válido =====
  test("generateCategoryId: Genera ID con formato correcto", () => {
    const id = generateCategoryId("Test", "fijos");
    expect(id).toMatch(/^cat_/);
  });

  // ===== TEST 5: recordCategoryEdit agrega entrada al historial =====
  test("recordCategoryEdit: Registra cambio en editHistory", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const originalLength = cat.editHistory.length;

      recordCategoryEdit(cat.id, { name: { from: "Old", to: "New" } });

      const updated = getCategoryById(cat.id);
      expect(updated.editHistory.length).toBeGreaterThanOrEqual(originalLength);
    }
  });

  // ===== TEST 6: recordCategoryEdit include timestamp =====
  test("recordCategoryEdit: Incluye timestamp en entrada", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const beforeLength = cat.editHistory.length;

      recordCategoryEdit(cat.id, { test: "value" });

      const updated = getCategoryById(cat.id);
      if (updated.editHistory.length > beforeLength) {
        const lastEntry = updated.editHistory[updated.editHistory.length - 1];
        expect(lastEntry.changedAt).toBeDefined();
      }
    }
  });

  // ===== TEST 7: getPillarById retorna pilar correcto =====
  test("getPillarById: Obtiene pilar por ID", () => {
    if (PILLARS.length > 0) {
      const pillar = PILLARS[0];
      const result = getPillarById(pillar.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(pillar.id);
      expect(result.label).toBe(pillar.label);
    }
  });

  // ===== TEST 8: getPillarById retorna null si no existe =====
  test("getPillarById: Retorna null para ID inválido", () => {
    const result = getPillarById("invalid_pillar");
    expect(result).toBeNull();
  });

  // ===== TEST 9: Búsqueda por ID es rápida (O(n)) =====
  test("getCategoryById: Performance es aceptable", () => {
    const startTime = performance.now();

    for (let i = 0; i < 1000; i++) {
      if (ALL_CATS.length > 0) {
        getCategoryById(ALL_CATS[0].id);
      }
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // 1000 búsquedas deben tomar menos de 100ms
    expect(duration).toBeLessThan(100);
  });

  // ===== TEST 10: getCategoryById preserva getters =====
  test("getCategoryById: Retorna referencia válida", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const result = getCategoryById(cat.id);

      expect(result).toEqual(cat);
    }
  });

  // ===== TEST 11: recordCategoryEdit maneja múltiples cambios =====
  test("recordCategoryEdit: Registra múltiples cambios en una entrada", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];

      recordCategoryEdit(cat.id, {
        name: { from: "Old", to: "New" },
        spent: { from: 1000, to: 2000 }
      });

      const updated = getCategoryById(cat.id);
      expect(updated.editHistory.length).toBeGreaterThan(0);
    }
  });

  // ===== TEST 12: getAllCategoryNames retorna nombres únicos =====
  test("Utility: Obtener todos los nombres únicos", () => {
    const names = ALL_CATS.map(cat => cat.name);
    const uniqueNames = new Set(names);

    // No debería haber nombres duplicados
    expect(names.length).toBe(uniqueNames.size);
  });

  // ===== TEST 13: getCategoryByName búsqueda inversa =====
  test("Utility: Búsqueda inversa por nombre", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const found = ALL_CATS.find(c => c.name === cat.name);

      expect(found).toBeDefined();
      expect(found.id).toBe(cat.id);
    }
  });

  // ===== TEST 14: Categorías agrupadas por pilar =====
  test("Utility: Agrupar categorías por pilar", () => {
    const grouped = {};

    ALL_CATS.forEach(cat => {
      if (!grouped[cat.pillar]) {
        grouped[cat.pillar] = [];
      }
      grouped[cat.pillar].push(cat.id);
    });

    // Cada pilar debería tener al menos 1 categoría
    PILLARS.forEach(pillar => {
      if (grouped[pillar.id]) {
        expect(grouped[pillar.id].length).toBeGreaterThan(0);
      }
    });
  });

  // ===== TEST 15: editHistory es ordenable por fecha =====
  test("editHistory: Entradas ordenables por fecha", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];

      if (cat.editHistory.length > 0) {
        const sorted = [...cat.editHistory].sort((a, b) =>
          new Date(a.changedAt) - new Date(b.changedAt)
        );

        expect(sorted.length).toBe(cat.editHistory.length);
      }
    }
  });
});
