import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булочка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 150,
    price: 100,
    image: 'bun.jpg',
    image_mobile: 'bun-mobile.jpg',
    image_large: 'bun-large.jpg'
  },
  {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 5,
    calories: 250,
    price: 200,
    image: 'patty.jpg',
    image_mobile: 'patty-mobile.jpg',
    image_large: 'patty-large.jpg'
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  describe('fetchIngredients.pending', () => {
    it('должен установить loading в true при начале запроса', () => {
      const action = { type: fetchIngredients.pending.type };
      const newState = ingredientsReducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.ingredients).toEqual([]);
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен установить loading в false и сохранить ингредиенты при успешном запросе', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const newState = ingredientsReducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.ingredients).toEqual(mockIngredients);
    });

    it('должен обновить состояние при получении новых ингредиентов', () => {
      const stateWithIngredients = {
        ingredients: mockIngredients,
        loading: true,
        error: 'Previous error'
      };

      const newIngredients = [
        { ...mockIngredients[0], name: 'Новая булка' },
        { ...mockIngredients[1], name: 'Новая котлета' }
      ];

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: newIngredients
      };
      const newState = ingredientsReducer(stateWithIngredients, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Previous error');
      expect(newState.ingredients).toEqual(newIngredients);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен установить loading в false и сохранить ошибку при неудачном запросе', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const newState = ingredientsReducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.ingredients).toEqual([]);
    });

    it('должен сохранить ошибку при отсутствии сообщения об ошибке', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const newState = ingredientsReducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Ошибка загрузки ингредиентов');
      expect(newState.ingredients).toEqual([]);
    });
  });

  describe('последовательность экшенов', () => {
    it('должен правильно обрабатывать полный цикл загрузки ингредиентов', () => {
      // Начало запроса
      let state = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      // Успешное завершение
      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('должен правильно обрабатывать ошибку после начала запроса', () => {
      // Начало запроса
      let state = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);

      // Ошибка
      state = ingredientsReducer(state, {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.ingredients).toEqual([]);
    });
  });

  describe('неизвестный экшен', () => {
    it('должен вернуть исходное состояние при неизвестном экшене', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const newState = ingredientsReducer(initialState, unknownAction);

      expect(newState).toEqual(initialState);
    });
  });

  describe('состояние с данными', () => {
    it('должен сохранить существующие данные при новом запросе', () => {
      const stateWithData = {
        ...initialState,
        ingredients: mockIngredients
      };

      const action = { type: fetchIngredients.pending.type };
      const newState = ingredientsReducer(stateWithData, action);

      expect(newState.loading).toBe(true);
      expect(newState.ingredients).toEqual(mockIngredients); // Данные сохраняются
    });
  });
});
