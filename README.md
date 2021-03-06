[![Build Status](https://travis-ci.org/YeJIoOb/catch-error-decorator.svg)](https://travis-ci.org/YeJIoOb/catch-error-decorator)
[![npm version](https://badge.fury.io/js/catch-error-decorator.svg)](https://badge.fury.io/js/catch-error-decorator)

# Catch error decorator

A decorator which can prevent throw error from your function and you shall been handle it in catchHandle.
It has 2 styles, es-next spec and old-functional-style.

## Install

```sh
npm install catch-error-decorator --save

# or

yarn add catch-error-decorator
```

## Definitions

```ts
export function catchError<T>(catchFunction: CatchCallback, throwErr: boolean = true, defaultValueOnError?: any, bindContext?: any): any;
export function catchError<T>(options: CatchErrorOptions): any;
```

```ts
export interface CatchErrorOptions {
    catchFunction: CatchCallback;
    throwErr?: boolean; //default true
    defaultValueOnError?: any;
    bindContext?: any;
}

export type CatchCallback = (errMessage: string, errStack: string, funcName: string, className: string, context: any, args: any[]) => void;
```

## Usage

```ts
import { catchError, CatchCallback } from 'catch-error-decorator';

const logFunction: CatchCallback = (errMessage: string, errStack: string, funcName: string, className: string, context: any, args: any[]) => {
  logger.log({level: 'error', message: JSON.stringify({errMessage, funcName, className, context})});
}

// Method decoration

class Foo {

  @catchError(logFunction, false, 'defaultValue')
  method1(): string { // return 'defaultValue' and log a error;
    throw new Error('bar');
  }

  @catchError(logFunction, false, 'defaultValue')
  method2(): Promise<string> { // return Promise<'defaultValue'> and log a error;
    return Promise.reject(new Error('bar'));
  }

  @catchError({ catchFunction: logFunction, throwErr: true })
  async method(): Promise<any> { // reject Error('baz') and log function call
    const value = await (async function() { throw new Error('baz'); })();
    return value;
  }

  @catchError(logFunction)
  get property() { // throw Error('deprecated method') and log call function
    throw new Error('deprecated method');
  }

  @catchError(logFunction, false)
  static Method() { // return undefined and log static function call. Cause you haven't define defaultValueOnError.
    return Promise.reject(new Error('baz'));
  }

  @catchError(logFunction)
  static get Property() { // just return 123;
    return 123;
  }
}


// Function decoration

function throwAlarm(arg1, arg2) {
  const value = this.Property;
  console.log(value); // 123
  throw new Error('alarm');
}

const catchErrorOptions = {
  catchFunction: logFunction, 
  throwErr: false, 
  defaultValueOnError: 'baz', 
  bindContext: Foo
};

const result = catchError(catchErrorOptions)(throwAlarm)('000', '123'); // result === 'baz', logger.log message === '{"errMessage":"alarm","funcName":"throwAlarm","className":"Function","args":["000","123"]}'

```

## License

MIT License.