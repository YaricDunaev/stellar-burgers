// Константы для тестов
const INGREDIENT_IDS = {
  BUN: '643d69a5c3f7b9001cfa093c',
  MAIN: '643d69a5c3f7b9001cfa093e',
  SAUCE: '643d69a5c3f7b9001cfa0942'
} as const;

const SELECTORS = {
  INGREDIENT_ITEM: '[data-testid="ingredient-item"]',
  BUN_ITEM: '[data-testid="ingredient-item"][data-ingredient-type="bun"]',
  MAIN_ITEM: '[data-testid="ingredient-item"][data-ingredient-type="main"]',
  SAUCE_ITEM: '[data-testid="ingredient-item"][data-ingredient-type="sauce"]',
  CONSTRUCTOR_DROP_ZONE: '[data-testid="constructor-drop-zone"]',
  CONSTRUCTOR_BUN_TOP: '[data-testid="constructor-bun-top"]',
  CONSTRUCTOR_BUN_BOTTOM: '[data-testid="constructor-bun-bottom"]',
  CONSTRUCTOR_INGREDIENT: '[data-testid="constructor-ingredient"]',
  ORDER_BUTTON: '[data-testid="order-button"]',
  ORDER_MODAL: '[data-testid="order-modal"]',
  ORDER_NUMBER: '[data-testid="order-number"]',
  MODAL: '[data-testid="modal"]',
  MODAL_CLOSE: '[data-testid="modal-close"]',
  MODAL_OVERLAY: '[data-testid="modal-overlay"]',
  MODAL_TITLE: '[data-testid="modal-title"]',
  MODAL_INGREDIENT_NAME: '[data-testid="modal-ingredient-name"]',
  INGREDIENT_NAME: '[data-testid="ingredient-name"]'
} as const;

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запросы к API
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Открываем страницу конструктора
    cy.visit('/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      // Проверяем, что булки нет в конструкторе до добавления
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
      
      // Получаем название булки для проверки
      cy.get(SELECTORS.BUN_ITEM).first().find(SELECTORS.INGREDIENT_NAME).invoke('text').then((bunName) => {
        // Добавляем булку
        cy.addBunToConstructor();
        
        // Проверяем, что именно эта булка появилась в конструкторе
        cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('be.visible').and('contain.text', bunName);
        cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('be.visible').and('contain.text', bunName);
      });
    });

    it('должен добавить начинку в конструктор', () => {
      // Проверяем, что начинки нет в конструкторе до добавления
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should('not.exist');
      
      // Получаем название начинки для проверки
      cy.get(SELECTORS.MAIN_ITEM).first().find(SELECTORS.INGREDIENT_NAME).invoke('text').then((ingredientName) => {
        // Добавляем начинку
        cy.addMainIngredientToConstructor();
        
        // Проверяем, что именно эта начинка появилась в конструкторе
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should('be.visible').and('contain.text', ingredientName);
      });
    });

    it('должен добавить соус в конструктор', () => {
      // Проверяем, что соуса нет в конструкторе до добавления
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should('not.exist');
      
      // Получаем название соуса для проверки
      cy.get(SELECTORS.SAUCE_ITEM).first().find(SELECTORS.INGREDIENT_NAME).invoke('text').then((sauceName) => {
        // Добавляем соус
        cy.addSauceToConstructor();
        
        // Проверяем, что именно этот соус появился в конструкторе
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should('be.visible').and('contain.text', sauceName);
      });
    });
  });

  describe('Модальные окна ингредиентов', () => {
    it('должен открыть модальное окно при клике на ингредиент', () => {
      cy.openIngredientModal();
      cy.get(SELECTORS.MODAL_TITLE).should('contain', 'Детали ингредиента');
    });

    it('должен закрыть модальное окно при клике на крестик', () => {
      cy.openIngredientModal();
      cy.closeModal();
    });

    it('должен закрыть модальное окно при клике на оверлей', () => {
      cy.openIngredientModal();
      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должен отображать данные правильного ингредиента в модальном окне', () => {
      // Получаем название первого ингредиента
      cy.get(SELECTORS.INGREDIENT_ITEM).first().find(SELECTORS.INGREDIENT_NAME).invoke('text').then((ingredientName) => {
        // Кликаем на ингредиент
        cy.get(SELECTORS.INGREDIENT_ITEM).first().click();
        
        // Проверяем, что в модальном окне отображается правильное название
        cy.get(SELECTORS.MODAL_INGREDIENT_NAME).should('contain', ingredientName);
      });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Подставляем фейковые токены авторизации
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
        win.document.cookie = 'accessToken=fake-access-token';
      });
    });

    afterEach(() => {
      // Используем встроенные методы Cypress для очистки
      cy.clearLocalStorage();
      cy.clearCookies();
    });

    it('должен создать заказ и отобразить модальное окно с номером заказа', () => {
      // Добавляем ингредиенты в конструктор
      cy.addBunToConstructor();
      cy.addMainIngredientToConstructor();
      
      // Создаем заказ
      cy.createOrder();
      
      // Проверяем, что номер заказа отображается
      cy.get(SELECTORS.ORDER_NUMBER).should('be.visible');
    });

    it('должен отобразить корректный номер заказа в модальном окне', () => {
      // Добавляем ингредиенты в конструктор
      cy.addBunToConstructor();
      cy.addMainIngredientToConstructor();
      
      // Создаем заказ
      cy.createOrder();
      
      // Ждем создания заказа
      cy.wait('@createOrder');
      
      // Проверяем, что отображается корректный номер заказа
      cy.fixture('order.json').then((orderData) => {
        cy.get(SELECTORS.ORDER_NUMBER).should('contain.text', orderData.order.number);
      });
    });

    it('должен закрыть модальное окно заказа и очистить конструктор', () => {
      // Добавляем ингредиенты в конструктор
      cy.addBunToConstructor();
      cy.addMainIngredientToConstructor();
      
      // Создаем заказ
      cy.createOrder();
      
      // Ждем создания заказа
      cy.wait('@createOrder');
      
      // Закрываем модальное окно заказа
      cy.get(SELECTORS.MODAL_CLOSE).click();
      
      // Проверяем, что модальное окно заказа закрылось
      cy.get(SELECTORS.ORDER_MODAL).should('not.exist');
      
      // Проверяем, что конструктор очистился
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should('not.exist');
    });
  });
}); 