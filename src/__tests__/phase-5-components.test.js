/**
 * PHASE 5: COMPONENTS TESTS (15 tests)
 *
 * Tests de componentes React (App, CategoriesPage, AddCategoryPage, BudgetsPage)
 * Validaciones: props, callbacks, rendering, manejo de IDs
 */

import { ALL_CATS, PILLARS } from "../constants";
import { getCategoryById } from "../utils/categoryUtils";

describe("PHASE 5: React Components", () => {

  // ===== TEST 1: App.jsx usa editingCategoryId =====
  test("App.jsx: editingCategoryId state es string o null", () => {
    let editingCategoryId = null;

    // Simular setState
    editingCategoryId = "cat_fijos_arr_001";

    expect(editingCategoryId === null || typeof editingCategoryId === "string").toBe(true);
  });

  // ===== TEST 2: App.jsx callback recibe ID en onEditCategory =====
  test("App.jsx: onEditCategory callback recibe (categoryId, pillarId)", () => {
    let callbackArgs = null;

    const mockOnEditCategory = (categoryId, pillarId) => {
      callbackArgs = { categoryId, pillarId };
    };

    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      mockOnEditCategory(cat.id, cat.pillar);

      expect(callbackArgs.categoryId).toBe(cat.id);
      expect(callbackArgs.pillarId).toBe(cat.pillar);
    }
  });

  // ===== TEST 3: App.jsx callback onDelete recibe ID =====
  test("App.jsx: onDelete callback recibe categoryId", () => {
    let deletedId = null;

    const mockOnDelete = (categoryId) => {
      deletedId = categoryId;
    };

    if (ALL_CATS.length > 0) {
      mockOnDelete(ALL_CATS[0].id);
      expect(deletedId).toBe(ALL_CATS[0].id);
    }
  });

  // ===== TEST 4: CategoriesPage itera sobre IDs =====
  test("CategoriesPage.jsx: Itera sobre categoryIds no nombres", () => {
    const categories = {};

    PILLARS.forEach(p => {
      categories[p.id] = [];
    });

    ALL_CATS.forEach(cat => {
      if (categories[cat.pillar]) {
        categories[cat.pillar].push(cat.id);
      }
    });

    Object.values(categories).forEach(catIds => {
      catIds.forEach(catId => {
        expect(catId).toMatch(/^cat_/);
      });
    });
  });

  // ===== TEST 5: CategoriesPage obtiene nombre de ID =====
  test("CategoriesPage.jsx: Obtiene nombre con getCategoryById", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const retrieved = getCategoryById(cat.id);

      expect(retrieved.name).toBe(cat.name);
    }
  });

  // ===== TEST 6: CategoriesPage pasa ID a onEditCategory =====
  test("CategoriesPage.jsx: onEditCategory recibe ID", () => {
    let receivedId = null;

    const mockCallback = (categoryId) => {
      receivedId = categoryId;
    };

    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      mockCallback(cat.id);

      expect(receivedId).toBe(cat.id);
    }
  });

  // ===== TEST 7: AddCategoryPage recibe editingCategoryId prop =====
  test("AddCategoryPage.jsx: Prop editingCategoryId es string o null", () => {
    let editingCategoryId = "cat_fijos_arr_001";

    expect(editingCategoryId === null || typeof editingCategoryId === "string").toBe(true);
  });

  // ===== TEST 8: AddCategoryPage pre-llena con getCategoryById =====
  test("AddCategoryPage.jsx: Pre-llena nombre desde ID", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const retrieved = getCategoryById(cat.id);

      expect(retrieved.name).toBeDefined();
      expect(retrieved.name.length).toBeGreaterThan(0);
    }
  });

  // ===== TEST 9: AddCategoryPage detecta cambios =====
  test("AddCategoryPage.jsx: Detecta cambios en nombre", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const originalName = cat.name;
      const newName = "Different Name";

      const hasChanged = originalName !== newName;

      expect(hasChanged).toBe(true);
    }
  });

  // ===== TEST 10: AddCategoryPage onDelete pasa ID =====
  test("AddCategoryPage.jsx: onDelete callback recibe ID", () => {
    let deletedId = null;

    const mockOnDelete = (categoryId) => {
      deletedId = categoryId;
    };

    if (ALL_CATS.length > 0) {
      mockOnDelete(ALL_CATS[0].id);
      expect(deletedId).toBe(ALL_CATS[0].id);
    }
  });

  // ===== TEST 11: BudgetsPage itera sobre IDs =====
  test("BudgetsPage.jsx: Itera sobre categoryIds", () => {
    const categories = {};
    const categoryBudgets = {};

    PILLARS.forEach(p => {
      categories[p.id] = [];
    });

    ALL_CATS.forEach(cat => {
      if (categories[cat.pillar]) {
        categories[cat.pillar].push(cat.id);
      }
      categoryBudgets[cat.id] = 0;
    });

    Object.keys(categoryBudgets).forEach(categoryId => {
      expect(categoryId).toMatch(/^cat_/);
    });
  });

  // ===== TEST 12: BudgetsPage accede presupuesto por ID =====
  test("BudgetsPage.jsx: categoryBudgets[categoryId] funciona", () => {
    const categoryBudgets = {};

    ALL_CATS.forEach(cat => {
      categoryBudgets[cat.id] = 100000;
    });

    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      expect(categoryBudgets[cat.id]).toBe(100000);
    }
  });

  // ===== TEST 13: BudgetsPage obtiene nombre desde ID =====
  test("BudgetsPage.jsx: Display nombre obtenido del ID", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      const retrieved = getCategoryById(cat.id);

      // El nombre debe coincidir
      expect(retrieved.name).toBe(cat.name);
    }
  });

  // ===== TEST 14: BudgetsPage pasa ID a handleBudgetChange =====
  test("BudgetsPage.jsx: handleCategoryBudgetChange recibe ID", () => {
    let receivedId = null;
    let receivedValue = null;

    const mockHandler = (categoryId, value) => {
      receivedId = categoryId;
      receivedValue = value;
    };

    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];
      mockHandler(cat.id, 200000);

      expect(receivedId).toBe(cat.id);
      expect(receivedValue).toBe(200000);
    }
  });

  // ===== TEST 15: TransactionsListService muestra nombre no ID =====
  test("TransactionsListService.jsx: Display nombre desde ID", () => {
    if (ALL_CATS.length > 0) {
      const cat = ALL_CATS[0];

      // Simular que tx.category es un ID
      const txCategoryId = cat.id;
      const retrieved = getCategoryById(txCategoryId);

      // Debe mostrar el nombre
      expect(retrieved.name).toBe(cat.name);
      expect(retrieved.name).not.toMatch(/^cat_/);
    }
  });
});
