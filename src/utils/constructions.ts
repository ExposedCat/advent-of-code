export const range = <T>(length: number, callback: (value: number) => T) => Array.from({ length }, (_, i) => callback(i));
