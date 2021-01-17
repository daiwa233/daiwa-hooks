export const isString = (arg: unknown): arg is string => typeof arg === 'string';

export const isNumber = (arg: unknown): arg is number => typeof arg === 'number';

export const isFun = (arg: unknown): arg is CallableFunction => typeof arg === 'function';

export const isObject = (arg: unknown): arg is Record<string, any> => typeof arg === 'object' && arg !== null;
