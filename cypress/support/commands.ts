/// <reference types="cypress" />

// Константы для ID ингредиентов
const INGREDIENT_IDS = {
  BUN: '643d69a5c3f7b9001cfa093c',
  MAIN: '643d69a5c3f7b9001cfa093e',
  SAUCE: '643d69a5c3f7b9001cfa0942'
} as const;

// Drag and drop ингредиента по селектору и id
Cypress.Commands.add('dragIngredientToConstructor', (ingredientSelector: string, ingredientId: string) => {
    cy.get(ingredientSelector).first().trigger('dragstart', {
      dataTransfer: {
        setData: () => {},
        getData: () => ingredientId
      }
    });
    cy.get('[data-testid="constructor-drop-zone"]').trigger('drop', {
      dataTransfer: {
        getData: () => ingredientId
      }
    });
  });
  
  // Логин через форму
  Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  });
  
  // Очистка конструктора (удаляет все ингредиенты)
  Cypress.Commands.add('clearConstructor', () => {
    cy.get('[data-testid="constructor-ingredient"]').each(($el) => {
      cy.wrap($el).find('[data-testid="remove-ingredient"]').click({ force: true });
    });
    // Удаляем булку, если есть кнопка удаления
    cy.get('[data-testid="constructor-bun-top"]').then(($bun) => {
      if ($bun.find('[data-testid="remove-ingredient"]').length) {
        cy.wrap($bun).find('[data-testid="remove-ingredient"]').click({ force: true });
      }
    });
  });

  // Добавление булки в конструктор
  Cypress.Commands.add('addBunToConstructor', () => {
    cy.dragIngredientToConstructor('[data-testid="ingredient-item"][data-ingredient-type="bun"]', INGREDIENT_IDS.BUN);
  });

  // Добавление начинки в конструктор
  Cypress.Commands.add('addMainIngredientToConstructor', () => {
    cy.dragIngredientToConstructor('[data-testid="ingredient-item"][data-ingredient-type="main"]', INGREDIENT_IDS.MAIN);
  });

  // Добавление соуса в конструктор
  Cypress.Commands.add('addSauceToConstructor', () => {
    cy.dragIngredientToConstructor('[data-testid="ingredient-item"][data-ingredient-type="sauce"]', INGREDIENT_IDS.SAUCE);
  });

  // Создание заказа
  Cypress.Commands.add('createOrder', () => {
    cy.get('[data-testid="order-button"]').should('not.be.disabled');
    cy.get('[data-testid="order-button"]').click();
    cy.get('[data-testid="order-modal"]').should('be.visible');
  });

  // Закрытие модального окна
  Cypress.Commands.add('closeModal', () => {
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  // Открытие модального окна ингредиента
  Cypress.Commands.add('openIngredientModal', () => {
    cy.get('[data-testid="ingredient-item"]').first().click();
    cy.get('[data-testid="modal"]').should('be.visible');
  });

  // Проверка, что ингредиент добавлен в конструктор
  Cypress.Commands.add('checkIngredientAdded', () => {
    cy.get('[data-testid="constructor-ingredient"]').should('be.visible');
  });

  // Проверка, что булка добавлена в конструктор
  Cypress.Commands.add('checkBunAdded', () => {
    cy.get('[data-testid="constructor-bun-top"]').should('be.visible');
    cy.get('[data-testid="constructor-bun-bottom"]').should('be.visible');
  }); 