declare namespace Cypress {
  interface Chainable {
    dragIngredientToConstructor(ingredientSelector: string, ingredientId: string): Chainable<void>;
    login(email: string, password: string): Chainable<void>;
    clearConstructor(): Chainable<void>;
    addBunToConstructor(): Chainable<void>;
    addMainIngredientToConstructor(): Chainable<void>;
    addSauceToConstructor(): Chainable<void>;
    createOrder(): Chainable<void>;
    closeModal(): Chainable<void>;
    openIngredientModal(): Chainable<void>;
    checkIngredientAdded(): Chainable<void>;
    checkBunAdded(): Chainable<void>;
  }
} 