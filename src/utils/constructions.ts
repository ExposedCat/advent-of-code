export const range = (length: number, callback: (value: number) => void) => {
  for (let i = 0; i < length; ++i) {
    callback(i);
  }
};
