import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 12,
  fat: 33,
  carbohydrates: 22,
  calories: 33,
  price: 123,
  image: 'test-image.jpg',
  image_large: 'test-image-large.jpg',
  image_mobile: 'test-image-mobile.jpg'
};

const mockMainIngredient: TIngredient = {
  _id: '2',
  name: 'Котлета',
  type: 'main',
  proteins: 20,
  fat: 15,
  carbohydrates: 5,
  calories: 250,
  price: 200,
  image: 'test-image-2.jpg',
  image_large: 'test-image-2-large.jpg',
  image_mobile: 'test-image-2-mobile.jpg'
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const action = addIngredient(mockIngredient);
      const newState = constructorReducer(initialState, action);

      expect(newState.bun).toEqual({
        ...mockIngredient,
        id: expect.any(String)
      });
      expect(newState.ingredients).toEqual([]);
    });

    it('должен заменить булку при добавлении новой булки', () => {
      const stateWithBun = {
        bun: { ...mockIngredient, id: 'old-bun-id' },
        ingredients: []
      };

      const newBun = {
        ...mockIngredient,
        _id: 'new-bun-id',
        name: 'Новая булка'
      };
      const action = addIngredient(newBun);
      const newState = constructorReducer(stateWithBun, action);

      expect(newState.bun).toEqual({
        ...newBun,
        id: expect.any(String)
      });
      expect(newState.bun?.id).not.toBe('old-bun-id');
    });

    it('должен добавить начинку в список ингредиентов', () => {
      const action = addIngredient(mockMainIngredient);
      const newState = constructorReducer(initialState, action);

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual({
        ...mockMainIngredient,
        id: expect.any(String)
      });
    });

    it('должен добавить несколько начинок в список', () => {
      const action1 = addIngredient(mockMainIngredient);
      const state1 = constructorReducer(initialState, action1);

      const action2 = addIngredient(mockMainIngredient);
      const state2 = constructorReducer(state1, action2);

      expect(state2.ingredients).toHaveLength(2);
      expect(state2.ingredients[0].id).not.toBe(state2.ingredients[1].id);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент по id', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockMainIngredient, id: 'ingredient-1' },
          { ...mockMainIngredient, id: 'ingredient-2' }
        ]
      };

      const action = removeIngredient('ingredient-1');
      const newState = constructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0].id).toBe('ingredient-2');
    });

    it('не должен удалить ингредиент с неправильным id', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [{ ...mockMainIngredient, id: 'ingredient-1' }]
      };

      const action = removeIngredient('wrong-id');
      const newState = constructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0].id).toBe('ingredient-1');
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент с позиции 0 на позицию 1', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockMainIngredient, id: 'ingredient-1', name: 'Первый' },
          { ...mockMainIngredient, id: 'ingredient-2', name: 'Второй' },
          { ...mockMainIngredient, id: 'ingredient-3', name: 'Третий' }
        ]
      };

      const action = moveIngredient({ from: 0, to: 1 });
      const newState = constructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0].name).toBe('Второй');
      expect(newState.ingredients[1].name).toBe('Первый');
      expect(newState.ingredients[2].name).toBe('Третий');
    });

    it('должен переместить ингредиент с позиции 2 на позицию 0', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockMainIngredient, id: 'ingredient-1', name: 'Первый' },
          { ...mockMainIngredient, id: 'ingredient-2', name: 'Второй' },
          { ...mockMainIngredient, id: 'ingredient-3', name: 'Третий' }
        ]
      };

      const action = moveIngredient({ from: 2, to: 0 });
      const newState = constructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0].name).toBe('Третий');
      expect(newState.ingredients[1].name).toBe('Первый');
      expect(newState.ingredients[2].name).toBe('Второй');
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор полностью', () => {
      const stateWithIngredients = {
        bun: { ...mockIngredient, id: 'bun-id' },
        ingredients: [
          { ...mockMainIngredient, id: 'ingredient-1' },
          { ...mockMainIngredient, id: 'ingredient-2' }
        ]
      };

      const action = clearConstructor();
      const newState = constructorReducer(stateWithIngredients, action);

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toEqual([]);
    });
  });

  describe('неизвестный экшен', () => {
    it('должен вернуть исходное состояние при неизвестном экшене', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const newState = constructorReducer(initialState, unknownAction);

      expect(newState).toEqual(initialState);
    });
  });
});
