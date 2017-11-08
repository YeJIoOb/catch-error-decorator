export interface CatchErrorOptions {
    catchFunction: CatchCallback;
    throwErr?: boolean;
    defaultValueOnError?: any;
    bindContext?: any;
}
export declare type CatchCallback = (errMessage?: string, errStack?: string, funcName?: string, className?: string, context?: any, args?: any[]) => void;
export declare type FunctionDecorator<T> = (fn: T) => T;
export declare function catchError<T>(catchFunction: CatchCallback, throwErr?: boolean, defaultValueOnError?: any, bindContext?: any): any;
export declare function catchError<T>(options: CatchErrorOptions): any;
export default catchError;
