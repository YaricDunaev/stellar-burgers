import feedReducer, { fetchFeeds, fetchUserOrders } from './feedSlice';
import { TOrder } from '@utils-types';

describe('feedSlice', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      ingredients: ['1', '2'],
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 1
    },
    {
      _id: '2',
      ingredients: ['3', '4'],
      status: 'pending',
      name: 'Второй заказ',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      number: 2
    }
  ];

  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  describe('fetchFeeds.pending', () => {
    it('должен установить loading в true и сбросить ошибку', () => {
      const action = { type: fetchFeeds.pending.type };
      const newState = feedReducer(initialState, action);
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });
  });

  describe('fetchFeeds.fulfilled', () => {
    it('должен установить данные ленты при успешной загрузке', () => {
      const payload = {
        orders: mockOrders,
        total: 100,
        totalToday: 10
      };
      const action = { type: fetchFeeds.fulfilled.type, payload };
      const newState = feedReducer(initialState, action);
      expect(newState.loading).toBe(false);
      expect(newState.orders).toEqual(mockOrders);
      expect(newState.total).toBe(100);
      expect(newState.totalToday).toBe(10);
    });
  });

  describe('fetchFeeds.rejected', () => {
    it('должен установить ошибку при неудачной загрузке', () => {
      const action = { type: fetchFeeds.rejected.type, error: { message: 'Ошибка' } };
      const newState = feedReducer(initialState, action);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Ошибка');
    });

    it('должен установить ошибку по умолчанию, если сообщение не передано', () => {
      const action = { type: fetchFeeds.rejected.type, error: {} };
      const newState = feedReducer(initialState, action);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Ошибка загрузки ленты');
    });
  });

  describe('fetchUserOrders.fulfilled', () => {
    it('должен обновить список заказов пользователя', () => {
      const action = { type: fetchUserOrders.fulfilled.type, payload: mockOrders };
      const newState = feedReducer(initialState, action);
      expect(newState.orders).toEqual(mockOrders);
    });
  });

  describe('неизвестный экшен', () => {
    it('должен вернуть исходное состояние при неизвестном экшене', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const newState = feedReducer(initialState, unknownAction);
      expect(newState).toEqual(initialState);
    });
  });
}); 