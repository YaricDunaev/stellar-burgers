import userReducer, {
  getUser,
  setAuthChecked,
  clearUserErrors,
  setUser,
  setAuthenticated
} from './userSlice';

const mockUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('userSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isAuthChecked: false,
    loginUserRequest: false,
    loginUserError: null,
    registerUserRequest: false,
    registerUserError: null
  };

  describe('getUser.fulfilled', () => {
    it('должен установить пользователя и аутентификацию при успешном запросе', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userReducer(initialState, action);

      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.isAuthChecked).toBe(true);
    });
  });

  describe('getUser.rejected', () => {
    it('должен установить isAuthChecked в true при неудачном запросе', () => {
      const action = { type: getUser.rejected.type };
      const newState = userReducer(initialState, action);

      expect(newState.isAuthChecked).toBe(true);
      expect(newState.user).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
    });
  });

  describe('setAuthChecked', () => {
    it('должен установить isAuthChecked в true', () => {
      const action = setAuthChecked();
      const newState = userReducer(initialState, action);

      expect(newState.isAuthChecked).toBe(true);
    });
  });

  describe('clearUserErrors', () => {
    it('должен очистить ошибки пользователя', () => {
      const stateWithErrors = {
        ...initialState,
        loginUserError: 'Login error',
        registerUserError: 'Register error'
      };

      const action = clearUserErrors();
      const newState = userReducer(stateWithErrors, action);

      expect(newState.loginUserError).toBeNull();
      expect(newState.registerUserError).toBeNull();
    });
  });

  describe('setUser', () => {
    it('должен установить пользователя', () => {
      const action = setUser(mockUser);
      const newState = userReducer(initialState, action);

      expect(newState.user).toEqual(mockUser);
    });

    it('должен очистить пользователя при передаче null', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };

      const action = setUser(null);
      const newState = userReducer(stateWithUser, action);

      expect(newState.user).toBeNull();
    });
  });

  describe('setAuthenticated', () => {
    it('должен установить статус аутентификации', () => {
      const action = setAuthenticated(true);
      const newState = userReducer(initialState, action);

      expect(newState.isAuthenticated).toBe(true);
    });

    it('должен сбросить статус аутентификации', () => {
      const stateWithAuth = {
        ...initialState,
        isAuthenticated: true
      };

      const action = setAuthenticated(false);
      const newState = userReducer(stateWithAuth, action);

      expect(newState.isAuthenticated).toBe(false);
    });
  });

  describe('неизвестный экшен', () => {
    it('должен вернуть исходное состояние при неизвестном экшене', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const newState = userReducer(initialState, unknownAction);

      expect(newState).toEqual(initialState);
    });
  });

  describe('последовательность экшенов', () => {
    it('должен правильно обрабатывать получение пользователя', () => {
      // Получаем пользователя
      let state = userReducer(initialState, {
        type: getUser.fulfilled.type,
        payload: mockUser
      });

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);

      // Очищаем пользователя
      state = userReducer(state, setUser(null));
      expect(state.user).toBeNull();
    });

    it('должен правильно обрабатывать ошибку получения пользователя', () => {
      // Ошибка получения пользователя
      let state = userReducer(initialState, {
        type: getUser.rejected.type
      });

      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
