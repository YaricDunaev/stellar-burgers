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
      // Находим первую булку и перетаскиваем в конструктор
      cy.get('[data-testid="ingredient-item"][data-ingredient-type="bun"]').first().trigger('dragstart', {
        dataTransfer: {
          setData: () => {},
          getData: () => 'bun'
        }
      });
      cy.get('[data-testid="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: {
          getData: () => 'bun'
        }
      });
      
      // Проверяем, что булка появилась в конструкторе
      cy.get('[data-testid="constructor-bun-top"]').should('be.visible');
      cy.get('[data-testid="constructor-bun-bottom"]').should('be.visible');
    });

    it('должен добавить начинку в конструктор', () => {
      // Находим первую начинку и перетаскиваем в конструктор
      cy.get('[data-testid="ingredient-item"][data-ingredient-type="main"]').first().trigger('dragstart', {
        dataTransfer: {
          setData: () => {},
          getData: () => 'main'
        }
      });
      cy.get('[data-testid="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: {
          getData: () => 'main'
        }
      });
      
      // Проверяем, что начинка появилась в конструкторе
      cy.get('[data-testid="constructor-ingredient"]').should('be.visible');
    });

    it('должен добавить соус в конструктор', () => {
      // Находим первый соус и перетаскиваем в конструктор
      cy.get('[data-testid="ingredient-item"][data-ingredient-type="sauce"]').first().trigger('dragstart', {
        dataTransfer: {
          setData: () => {},
          getData: () => 'sauce'
        }
      });
      cy.get('[data-testid="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: {
          getData: () => 'sauce'
        }
      });
      
      // Проверяем, что соус появился в конструкторе
      cy.get('[data-testid="constructor-ingredient"]').should('be.visible');
    });
  });

  describe('Модальные окна ингредиентов', () => {
    it('должен открыть модальное окно при клике на ингредиент', () => {
      // Кликаем на первый ингредиент
      cy.get('[data-testid="ingredient-item"]').first().click();
      
      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal-title"]').should('contain', 'Детали ингредиента');
    });

    it('должен закрыть модальное окно при клике на крестик', () => {
      // Открываем модальное окно
      cy.get('[data-testid="ingredient-item"]').first().click();
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Кликаем на крестик
      cy.get('[data-testid="modal-close"]').click();
      
      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должен закрыть модальное окно при клике на оверлей', () => {
      // Открываем модальное окно
      cy.get('[data-testid="ingredient-item"]').first().click();
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Кликаем на оверлей
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      
      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должен отображать данные правильного ингредиента в модальном окне', () => {
      // Получаем название первого ингредиента
      cy.get('[data-testid="ingredient-item"]').first().find('[data-testid="ingredient-name"]').invoke('text').then((ingredientName) => {
        // Кликаем на ингредиент
        cy.get('[data-testid="ingredient-item"]').first().click();
        
        // Проверяем, что в модальном окне отображается правильное название
        cy.get('[data-testid="modal-ingredient-name"]').should('contain', ingredientName);
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
      // Очищаем токены после теста
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
        win.document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      });
    });

    it('должен создать заказ и отобразить модальное окно с номером заказа', () => {
      // Добавляем булку в конструктор
      cy.get('[data-testid="ingredient-item"][data-ingredient-type="bun"]').first().trigger('dragstart', {
        dataTransfer: {
          setData: () => {},
          getData: () => 'bun'
        }
      });
      cy.get('[data-testid="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: {
          getData: () => 'bun'
        }
      });
      
      // Добавляем начинку в конструктор
      cy.get('[data-testid="ingredient-item"][data-ingredient-type="main"]').first().trigger('dragstart', {
        dataTransfer: {
          setData: () => {},
          getData: () => 'main'
        }
      });
      cy.get('[data-testid="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: {
          getData: () => 'main'
        }
      });
      
      // Проверяем, что кнопка "Оформить заказ" активна
      cy.get('[data-testid="order-button"]').should('not.be.disabled');
      
      // Кликаем на кнопку "Оформить заказ"
      cy.get('[data-testid="order-button"]').click();
      
      // Проверяем, что модальное окно заказа открылось
      cy.get('[data-testid="order-modal"]').should('be.visible');
      
      // Проверяем, что номер заказа отображается
      cy.get('[data-testid="order-number"]').should('be.visible');
    });

    it('должен закрыть модальное окно заказа и очистить конструктор', () => {
      // Добавляем ингредиенты в конструктор
      cy.get('[data-testid="ingredient-item"][data-ingredient-type="bun"]').first().trigger('dragstart', {
        dataTransfer: {
          setData: () => {},
          getData: () => 'bun'
        }
      });
      cy.get('[data-testid="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: {
          getData: () => 'bun'
        }
      });
      cy.get('[data-testid="ingredient-item"][data-ingredient-type="main"]').first().trigger('dragstart', {
        dataTransfer: {
          setData: () => {},
          getData: () => 'main'
        }
      });
      cy.get('[data-testid="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: {
          getData: () => 'main'
        }
      });
      
      // Создаем заказ
      cy.get('[data-testid="order-button"]').click();
      
      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="order-modal"]').should('be.visible');
      
      // Закрываем модальное окно
      cy.get('[data-testid="modal-close"]').click();
      
      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
      
      // Проверяем, что конструктор очистился
      cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
      cy.get('[data-testid="constructor-bun-bottom"]').should('not.exist');
      cy.get('[data-testid="constructor-ingredient"]').should('not.exist');
    });
  });
}); 