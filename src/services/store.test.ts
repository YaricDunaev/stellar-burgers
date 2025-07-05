import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен вернуть корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const initialState = rootReducer(undefined, unknownAction);

    // Проверяем, что возвращается объект с ожидаемой структурой
    expect(initialState).toBeDefined();
    expect(typeof initialState).toBe('object');

    // Проверяем наличие всех основных слайсов
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('feed');

    // Проверяем начальное состояние конструктора
    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    // Проверяем начальное состояние ингредиентов
    expect(initialState.ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });

    // Проверяем начальное состояние заказа
    expect(initialState.order).toEqual({
      order: null,
      orderRequest: false,
      orderModalData: null,
      error: null
    });

    // Проверяем начальное состояние пользователя
    expect(initialState.user).toEqual({
      user: null,
      isAuthenticated: false,
      isAuthChecked: false,
      loginUserRequest: false,
      loginUserError: null,
      registerUserRequest: false,
      registerUserError: null
    });

    // Проверяем начальное состояние ленты
    expect(initialState.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    });
  });
});
