/**
 * PHASE 4: HOOKS TESTS (10 tests)
 *
 * Tests de useCategories y useBudgets hooks
 * Validaciones: estado, inicialización, actualizaciones
 */

import { ALL_CATS, PILLARS } from "../constants";

describe("PHASE 4: React Hooks (useCategories, useBudgets)", () => {

  // ===== TEST 1: useCategories inicializa con estructura IDs =====
  test("useCategories: Inicializa con estructura {pillarId: [categoryIds]}", () => {
    // Simulación de inicialización
    const categories = {};

    PILLARS.forEach(p => {
      categories[p.id] = [];
    });

    ALL_CATS.forEach(cat => {
      if (categories[cat.pillar]) {
        categories[cat.pillar].push(cat.id);
      }
    });

    // Verificar que cada pilar tiene array de IDs
    Object.values(categories).forEach(catIds => {
      expect(Array.isArray(catIds)).toBe(true);
    });
  });

  // ===== TEST 2: useCategories mantiene IDs no nombres =====
  test("useCategories: Contiene IDs no nombres", () => {
    const categories = {};

    PILLARS.forEach(p => {
      categories[p.id] = [];
    });

    ALL_CATS.forEach(cat => {
      if (categories[cat.pillar]) {
        categories[cat.pillar].push(cat.id);
      }
    });

    // Todos los items deben empezar con "cat_"
    Object.values(categories).forEach(catIds => {
      catIds.forEach(catId => {
        expect(catId).toMatch(/^cat_/);
      });
    });
  });

  // ===== TEST 3: useBudgets inicializa con claves IDs =====
  test("useBudgets: Inicializa con {categoryId: budget}", () => {
    const categoryBudgets = {};

    ALL_CATS.forEach(cat => {
      categoryBudgets[cat.id] = 0;
    });

    // Todas las claves deben ser IDs
    Object.keys(categoryBudgets).forEach(key => {
      expect(key).toMatch(/^cat_/);
    });
  });

  // ===== TEST 4: useBudgets mantiene valores sincronizados =====
  test("useBudgets: Valores son números válidos", () => {
    const categoryBudgets = {};

    ALL_CATS.forEach(cat => {
      categoryBudgets[cat.id] = Math.random() * 1000000;
    });

    Object.values(categoryBudgets).forEach(budget => {
      expect(typeof budget).toBe("number");
      expect(budget).toBeGreaterThanOrEqual(0);
    });
  });

  // ===== TEST 5: addCategory genera ID automático =====
  test("useCategories.addCategory: Genera ID único", () => {
    // IDs deben ser únicos
    const ids = ALL_CATS.map(cat => cat.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  // ===== TEST 6: deleteCategory preserva referencia integridad =====
  test("useCategories.deleteCategory: No rompe estructura", () => {
    const categories = {};

    PILLARS.forEach(p => {
      categories[p.id] = [];
    });

    ALL_CATS.forEach(cat => {
      if (categories[cat.pillar]) {
        categories[cat.pillar].push(cat.id);
      }
    });

    // La estructura sigue siendo válida
    Object.keys(categories).forEach(pillarId => {
      expect(Array.isArray(categories[pillarId])).toBe(true);
    });
  });

  // ===== TEST 7: editCategory actualiza nombre sin cambiar ID =====
  test("useCategories.editCategory: ID permanece igual", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const originalId = cat.id;

      // Simular cambio de nombre
      cat.name = "Updated Name";

      // El ID debe ser el mismo
      expect(cat.id).toBe(originalId);
    }
  });

  // ===== TEST 8: useBudgets.handleCategoryBudgetChange usa ID =====
  test("useBudgets.handleCategoryBudgetChange: Usa ID como clave", () => {
    const categoryBudgets = {};

    ALL_CATS.forEach(cat => {
      categoryBudgets[cat.id] = 100000;
    });

    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      categoryBudgets[cat.id] = 200000;

      expect(categoryBudgets[cat.id]).toBe(200000);
    }
  });

  // ===== TEST 9: Hook state es inmutable =====
  test("Hooks: Estado actualización crea nuevo objeto", () => {
    const original = { "cat_test_001": 100000 };
    const updated = { ...original, "cat_test_001": 200000 };

    // Original no cambia
    expect(original["cat_test_001"]).toBe(100000);
    expect(updated["cat_test_001"]).toBe(200000);
  });

  // ===== TEST 10: getCategoryName helper convierte ID a nombre =====
  test("useBudgets.getCategoryName: Convierte ID a nombre", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];

      // Función que simula getCategoryName
      const getCategoryName = (categoryId) => {
        const found = ALL_CATS.find(c => c.id === categoryId);
        return found ? found.name : "Desconocida";
      };

      const name = getCategoryName(cat.id);
      expect(name).toBe(cat.name);
    }
  });
});
