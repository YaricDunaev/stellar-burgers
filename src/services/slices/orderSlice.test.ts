import orderReducer, { createOrder, clearOrder } from './orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '123',
  ingredients: ['1', '2', '3'],
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345
};

describe('orderSlice', () => {
  const initialState = {
    order: null,
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  describe('createOrder.pending', () => {
    it('должен установить orderRequest в true при начале запроса', () => {
      const action = { type: createOrder.pending.type };
      const newState = orderReducer(initialState, action);

      expect(newState.orderRequest).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.order).toBeNull();
    });
  });

  describe('createOrder.fulfilled', () => {
    it('должен установить заказ и сбросить флаги при успешном создании', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const newState = orderReducer(initialState, action);

      expect(newState.order).toEqual(mockOrder);
      expect(newState.orderModalData).toEqual(mockOrder);
      expect(newState.orderRequest).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('должен обновить существующий заказ', () => {
      const stateWithOrder = {
        ...initialState,
        order: { ...mockOrder, _id: 'old-id' }
      };

      const newOrder = { ...mockOrder, _id: 'new-id' };
      const action = {
        type: createOrder.fulfilled.type,
        payload: newOrder
      };
      const newState = orderReducer(stateWithOrder, action);

      expect(newState.order).toEqual(newOrder);
      expect(newState.orderModalData).toEqual(newOrder);
      expect(newState.orderRequest).toBe(false);
      expect(newState.error).toBeNull();
    });
  });

  describe('createOrder.rejected', () => {
    it('должен установить ошибку и сбросить orderRequest при ошибке', () => {
      const action = {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка создания заказа' }
      };
      const newState = orderReducer(initialState, action);

      expect(newState.error).toBe('Ошибка создания заказа');
      expect(newState.orderRequest).toBe(false);
      expect(newState.order).toBeNull();
    });

    it('должен сохранить ошибку при отсутствии сообщения', () => {
      const action = {
        type: createOrder.rejected.type,
        error: {}
      };
      const newState = orderReducer(initialState, action);

      expect(newState.error).toBe('Ошибка создания заказа');
      expect(newState.orderRequest).toBe(false);
    });
  });

  describe('clearOrder', () => {
    it('должен очистить заказ и сбросить флаги', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderModalData: mockOrder,
        orderRequest: true,
        error: 'Some error'
      };

      const action = clearOrder();
      const newState = orderReducer(stateWithOrder, action);

      expect(newState.order).toBeNull();
      expect(newState.orderModalData).toBeNull();
      expect(newState.error).toBeNull();
    });

    it('должен работать корректно при отсутствии заказа', () => {
      const action = clearOrder();
      const newState = orderReducer(initialState, action);

      expect(newState.order).toBeNull();
      expect(newState.orderModalData).toBeNull();
      expect(newState.error).toBeNull();
    });
  });

  describe('последовательность экшенов', () => {
    it('должен правильно обрабатывать полный цикл создания заказа', () => {
      // Начало запроса
      let state = orderReducer(initialState, {
        type: createOrder.pending.type
      });
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();

      // Успешное завершение
      state = orderReducer(state, {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      });
      expect(state.order).toEqual(mockOrder);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBeNull();
    });

    it('должен правильно обрабатывать ошибку создания заказа', () => {
      // Начало запроса
      let state = orderReducer(initialState, {
        type: createOrder.pending.type
      });
      expect(state.orderRequest).toBe(true);

      // Ошибка
      state = orderReducer(state, {
        type: createOrder.rejected.type,
        error: { message: 'Network error' }
      });
      expect(state.error).toBe('Network error');
      expect(state.orderRequest).toBe(false);
      expect(state.order).toBeNull();
    });

    it('должен правильно очищать заказ после создания', () => {
      // Создаем заказ
      let state = orderReducer(initialState, {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      });
      expect(state.order).toEqual(mockOrder);

      // Очищаем заказ
      state = orderReducer(state, clearOrder());
      expect(state.order).toBeNull();
      expect(state.orderModalData).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('неизвестный экшен', () => {
    it('должен вернуть исходное состояние при неизвестном экшене', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const newState = orderReducer(initialState, unknownAction);

      expect(newState).toEqual(initialState);
    });
  });

  describe('состояние с данными', () => {
    it('должен сохранить существующий заказ при новом запросе', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder
      };

      const action = { type: createOrder.pending.type };
      const newState = orderReducer(stateWithOrder, action);

      expect(newState.orderRequest).toBe(true);
      expect(newState.order).toEqual(mockOrder); // Заказ сохраняется
    });
  });
});
