import '@testing-library/jest-dom';

// Полифилл для crypto.randomUUID
if (!global.crypto) {
  global.crypto = {
    randomUUID: () =>
      Math.random().toString(36).substring(2) + Date.now().toString(36)
  } as any;
} else if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () =>
    (Math.random().toString(36).substring(2) + Date.now().toString(36)) as any;
}
