

function isAsync(fn) {
    return fn.constructor.name === 'AsyncFunction';
}

export interface CatchErrorOptions {
    catchFunction: CatchCallback;
    throwErr?: boolean; //default true
    defaultValueOnError?: any;
    bindContext?: any;
}

export type CatchCallback = (errMessage?: string, errStack?: string, funcName?: string, className?: string, context?: any, args?: any[]) => void;

function createTempFunction(originalFn: Function, options: CatchOptions) {
    const { catchFunction, throwErr, defaultValueOnError, className, funcName, bindContext } = options;
    function handleError(err: Error, funcName: string, className: string, context: any, args: any[]) {
        catchFunction(err.message, err.stack, funcName, className, context, args);
        if (throwErr) throw err;
        return defaultValueOnError;
    }
    const method = originalFn;
    const isAsyncFunc = isAsync(method);
    if (isAsyncFunc) {
        return async function (...args) {
            const context = bindContext || this;
            try {
                const result = await method.apply(context, args);
                return result;
            } catch (err) {
                return handleError(err, funcName, className, context, args);
            }
        }
    } else {
        return function (...args) {
            const context = bindContext || this;
            try {
                const result = method.apply(context, args);
                if (result instanceof Promise) return result.catch((err) => handleError(err, funcName, className, context, args));
                else return result;
            } catch (err) {
                return handleError(err, funcName, className, context, args);
            }
        }
    }
}

type CatchOptions = {
    catchFunction: CatchCallback;
    throwErr: boolean;
    defaultValueOnError?: any;
    bindContext?: any;
    funcName: string;
    className: string;
}

export type FunctionDecorator<T> = (fn: T) => T;

export function catchError<T>(catchFunction: CatchCallback, throwErr?: boolean, defaultValueOnError?: any, bindContext?: any): any;
export function catchError<T>(options: CatchErrorOptions): any;
export function catchError<T>(options: CatchErrorOptions | CatchCallback, throwErr?: boolean, defaultValueOnError?: any, bindContext?: any): any {
    return function (decoratorTargetOrFunction: Object | Function, propertyName?: string, descriptor?: TypedPropertyDescriptor<T>) {
        let decoratorOptions;
        if (typeof options !== 'function') {
            decoratorOptions = { throwErr: true, funcName: propertyName, className: decoratorTargetOrFunction.constructor.name, ...options };
        } else {
            decoratorOptions = { catchFunction: options, funcName: propertyName, throwErr: typeof throwErr === 'undefined' ? true : throwErr, defaultValueOnError: defaultValueOnError, bindContext: bindContext };
        }

        // function decorator, old-style
        if (typeof decoratorTargetOrFunction === 'function' && typeof descriptor === 'undefined') {
            return createTempFunction(decoratorTargetOrFunction, { ...decoratorOptions, funcName: decoratorTargetOrFunction.name });
        }

        let func: Function;
        let descriptorItemName: string;
        let getter = descriptor.get;
        let value = descriptor.value;

        if (getter) {
            func = getter;
            descriptorItemName = 'get';
        } else if (typeof value === 'function') {
            func = value;
            descriptorItemName = 'value';
        } else {
            throw new TypeError('Invalid decoration');
        }

        // static getter or static method decorator, es-next
        if (typeof decoratorTargetOrFunction === 'function' && typeof descriptor !== 'undefined') {
            decoratorOptions.className = `static ${descriptorItemName === 'get' ? 'getter' : 'method'}`;
            decoratorOptions.funcName = func.name;
        }

        return {
            ...descriptor,
            [descriptorItemName]: createTempFunction(func, decoratorOptions)
        };
    }
}

export default catchError;
