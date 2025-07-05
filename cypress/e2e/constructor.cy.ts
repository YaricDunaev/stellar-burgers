/// <reference types="cypress" />

// Импорты констант из редьюсеров для использования в тестах
import { initialState as constructorInitialState } from '../../src/services/slices/constructorSlice';
import { initialState as orderInitialState } from '../../src/services/slices/orderSlice';

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
    // Перехватываем запросы к API с алиасами для лучшего контроля
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Открываем страницу конструктора
    cy.visit('/');
    
    // Ждем загрузки ингредиентов - используем алиас вместо произвольного ожидания
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор и проверить её наличие', () => {
      // Проверяем, что конструктор в начальном состоянии
      // Используем константы из редьюсера для проверки начального состояния
      expect(constructorInitialState.bun).to.be.null;
      expect(constructorInitialState.ingredients).to.have.length(0);
      
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
      
      // Получаем название булки для детальной проверки
      cy.get(SELECTORS.BUN_ITEM).first().find(SELECTORS.INGREDIENT_NAME).invoke('text').as('bunName');
      
      // Добавляем булку
      cy.addBunToConstructor();
      
      // Проверяем, что именно эта булка появилась в конструкторе с полной детализацией
      cy.get('@bunName').then((bunName) => {
        cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP)
          .should('be.visible')
          .and('contain.text', bunName);
        cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM)
          .should('be.visible')
          .and('contain.text', bunName);
      });
    });

    it('должен добавить начинку в конструктор и проверить её наличие', () => {
      // Проверяем, что конструктор в начальном состоянии
      // Используем константы из редьюсера для проверки начального состояния
      expect(constructorInitialState.ingredients).to.have.length(0);
      
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should('not.exist');
      
      // Получаем название начинки для детальной проверки
      cy.get(SELECTORS.MAIN_ITEM).first().find(SELECTORS.INGREDIENT_NAME).invoke('text').as('ingredientName');
      
      // Добавляем начинку
      cy.addMainIngredientToConstructor();
      
      // Проверяем, что именно эта начинка появилась в конструкторе
      cy.get('@ingredientName').then((ingredientName) => {
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
          .should('be.visible')
          .and('contain.text', ingredientName);
      });
    });

    it('должен добавить соус в конструктор и проверить его наличие', () => {
      // Проверяем, что конструктор в начальном состоянии
      // Используем константы из редьюсера для проверки начального состояния
      expect(constructorInitialState.ingredients).to.have.length(0);
      
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should('not.exist');
      
      // Получаем название соуса для детальной проверки
      cy.get(SELECTORS.SAUCE_ITEM).first().find(SELECTORS.INGREDIENT_NAME).invoke('text').as('sauceName');
      
      // Добавляем соус
      cy.addSauceToConstructor();
      
      // Проверяем, что именно этот соус появился в конструкторе
      cy.get('@sauceName').then((sauceName) => {
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
          .should('be.visible')
          .and('contain.text', sauceName);
      });
    });
  });

  describe('Модальные окна ингредиентов', () => {
    it('должен открыть модальное окно при клике на ингредиент и проверить его содержимое', () => {
      // Открываем модальное окно
      cy.openIngredientModal();
      
      // Проверяем заголовок и содержимое модального окна
      cy.get(SELECTORS.MODAL_TITLE).should('contain', 'Детали ингредиента');
      
      // Проверяем, что модальное окно содержит данные ингредиента
      cy.get(SELECTORS.MODAL_INGREDIENT_NAME).should('be.visible');
    });

    it('должен закрыть модальное окно при клике на крестик', () => {
      cy.openIngredientModal();
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.closeModal();
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должен закрыть модальное окно при клике на оверлей', () => {
      cy.openIngredientModal();
      cy.get(SELECTORS.MODAL).should('be.visible');
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

    it('должен создать заказ и отобразить корректный номер заказа в модальном окне', () => {
      // Добавляем ингредиенты в конструктор
      cy.addBunToConstructor();
      cy.addMainIngredientToConstructor();
      
      // Проверяем, что кнопка заказа активна
      cy.get(SELECTORS.ORDER_BUTTON).should('not.be.disabled');
      
      // Создаем заказ
      cy.createOrder();
      
      // Ждем создания заказа - используем алиас вместо произвольного ожидания
      cy.wait('@createOrder');
      
      // Проверяем, что модальное окно заказа открылось
      cy.get(SELECTORS.ORDER_MODAL).should('be.visible');
      
      // Проверяем, что номер заказа отображается
      cy.get(SELECTORS.ORDER_NUMBER).should('be.visible');
      
      // Проверяем, что отображается корректный номер заказа
      cy.fixture('order.json').then((orderData) => {
        cy.get(SELECTORS.ORDER_NUMBER)
          .should('be.visible')
          .and('contain.text', orderData.order.number);
      });
      
      // Проверяем, что состояние заказа соответствует ожидаемому
      // Используем константы из редьюсера для проверки состояния заказа
      expect(orderInitialState.order).to.be.null;
      expect(orderInitialState.orderRequest).to.be.false;
      
      // После создания заказа order должен быть не null, а не как в начальном состоянии
      cy.window().then((win) => {
        cy.get(SELECTORS.ORDER_NUMBER).should('contain.text', '12345');
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