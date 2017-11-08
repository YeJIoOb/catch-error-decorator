"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function isAsync(fn) {
    return fn.constructor.name === 'AsyncFunction';
}
function createTempFunction(originalFn, options) {
    const { catchFunction, throwErr, defaultValueOnError, className, funcName, bindContext } = options;
    function handleError(err, funcName, className, context, args) {
        catchFunction(err.message, err.stack, funcName, className, context, args);
        if (throwErr)
            throw err;
        return defaultValueOnError;
    }
    const method = originalFn;
    const isAsyncFunc = isAsync(method);
    if (isAsyncFunc) {
        return function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const context = bindContext || this;
                try {
                    const result = yield method.apply(context, args);
                    return result;
                }
                catch (err) {
                    return handleError(err, funcName, className, context, args);
                }
            });
        };
    }
    else {
        return function (...args) {
            const context = bindContext || this;
            try {
                const result = method.apply(context, args);
                if (result instanceof Promise)
                    return result.catch((err) => handleError(err, funcName, className, context, args));
                else
                    return result;
            }
            catch (err) {
                return handleError(err, funcName, className, context, args);
            }
        };
    }
}
function catchError(options, throwErr, defaultValueOnError, bindContext) {
    return function (decoratorTargetOrFunction, propertyName, descriptor) {
        let decoratorOptions;
        if (typeof options !== 'function') {
            decoratorOptions = Object.assign({ throwErr: true, funcName: propertyName, className: decoratorTargetOrFunction.constructor.name }, options);
        }
        else {
            decoratorOptions = { catchFunction: options, throwErr: typeof throwErr === 'undefined' ? true : throwErr, defaultValueOnError: defaultValueOnError, bindContext: bindContext };
        }
        // function decorator, old-style
        if (typeof decoratorTargetOrFunction === 'function' && typeof descriptor === 'undefined') {
            return createTempFunction(decoratorTargetOrFunction, Object.assign({}, decoratorOptions, { funcName: decoratorTargetOrFunction.name }));
        }
        let func;
        let descriptorItemName;
        let getter = descriptor.get;
        let value = descriptor.value;
        if (getter) {
            func = getter;
            descriptorItemName = 'get';
        }
        else if (typeof value === 'function') {
            func = value;
            descriptorItemName = 'value';
        }
        else {
            throw new TypeError('Invalid decoration');
        }
        // static getter or static method decorator, es-next
        if (typeof decoratorTargetOrFunction === 'function' && typeof descriptor !== 'undefined') {
            decoratorOptions.className = `static ${descriptorItemName === 'get' ? 'getter' : 'method'}`;
            decoratorOptions.funcName = func.name;
        }
        return Object.assign({}, descriptor, { [descriptorItemName]: createTempFunction(func, decoratorOptions) });
    };
}
exports.catchError = catchError;
exports.default = catchError;
