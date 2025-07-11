import { rootReducer } from './store';
import { initialState as constructorInitialState } from './slices/constructorSlice';
import { initialState as ingredientsInitialState } from './slices/ingredientsSlice';
import { initialState as orderInitialState } from './slices/orderSlice';
import { initialState as userInitialState } from './slices/userSlice';
import { initialState as feedInitialState } from './slices/feedSlice';

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
    expect(initialState.burgerConstructor).toEqual(constructorInitialState);

    // Проверяем начальное состояние ингредиентов
    expect(initialState.ingredients).toEqual(ingredientsInitialState);

    // Проверяем начальное состояние заказа
    expect(initialState.order).toEqual(orderInitialState);

    // Проверяем начальное состояние пользователя
    expect(initialState.user).toEqual(userInitialState);

    // Проверяем начальное состояние ленты
    expect(initialState.feed).toEqual(feedInitialState);
  });
});
