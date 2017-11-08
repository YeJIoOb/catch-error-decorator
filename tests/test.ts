import { expect } from 'chai';
import { catchError, CatchCallback } from './../lib/main';
import { suite, test } from "mocha-typescript";


const tryCatchCallback: CatchCallback = (errMessage: string, errStack: string, funcName: string, className: string, context: any, args: any[]) => {
    // UNCOMMENT NEXT LINE IF U WANT SEE CALLBACK IN ACTION
    // console.log(errMessage, errStack, funcName, className, args);
    // console.log(context, funcName, className, args);
}

function throwAlarm() {
    throw new Error('alarm');
}

class TestCatchErrorDecoratorClass {

    @catchError(tryCatchCallback, false, 123)
    simpleCatch(...args: any[]) {
        throw new Error('alarm');
    }

    @catchError(tryCatchCallback)
    throwCatch(...args: any[]) {
        throw new Error('alarm');
    }

    @catchError({ catchFunction: tryCatchCallback, throwErr: false })
    withoutDefaultValueCatch(...args: any[]) {
        throw new Error('alarm');
    }

    @catchError({ catchFunction: tryCatchCallback, throwErr: false, defaultValueOnError: 123 })
    get simpleCatchGetter() {
        throw new Error('alarm');
    }

    @catchError({ catchFunction: tryCatchCallback, throwErr: true, defaultValueOnError: 123 })
    get throwCatchGetter() {
        throw new Error('alarm');
    }

    @catchError({ catchFunction: tryCatchCallback, throwErr: false })
    get withoutDefaultValueCatchGetter() {
        throw new Error('alarm');
    }

    @catchError({ catchFunction: tryCatchCallback, throwErr: false })
    static staticWithDefaultValueCatch() {
        throw new Error('alarm');
    }

    @catchError(tryCatchCallback, false, 123)
    static get throwCatchStaticGetter() {
        throw new Error('alarm');
    }
}


@suite("catchError decorator function unit test cases.")
class TestCatchErrorDecoratorUnit {
    testclass: TestCatchErrorDecoratorClass;
    before() {
        this.testclass = new TestCatchErrorDecoratorClass();
    }

    @test('catchError Class method call without throw and with default value, should return 123')
    tryCatch_class_callWithoutThrowAndWithDefaultValue() {
        const result = this.testclass.simpleCatch(345);
        expect(result).to.equal(123);
    }

    @test('catchError Class method call with throw, should throw error with "alarm" message')
    tryCatch_class_callWithThrow() {
        try {
            const result = this.testclass.throwCatch(234, 567);
        } catch (err) {
            expect(err.message).to.equal('alarm');
        }
    }

    @test('catchError Class method call without throw and withoud default value, should return undefined')
    tryCatch_class_callWithoutThrowAndWithoutDefaultValue() {
        const result = this.testclass.withoutDefaultValueCatch(1, 2, 3);
        expect(result).to.equal(undefined);
    }

    @test('catchError func call without throw and with default value, should return 123')
    tryCatch_func_callWithoutThrowAndWithDefaultValue() {
        const result = catchError({ catchFunction: tryCatchCallback, throwErr: false, defaultValueOnError: 123 })(throwAlarm)();
        expect(result).to.equal(123);
    }

    @test('catchError func call with throw, should throw error with "alarm" message')
    tryCatch_func_callWithThrow() {
        try {
            const result = catchError({ catchFunction: tryCatchCallback, throwErr: true })(throwAlarm)('000', '123');
        } catch (err) {
            expect(err.message).to.equal('alarm');
        }
    }

    @test('catchError func call without throw and withoud default value, should return undefined')
    tryCatch_func_callWithoutThrowAndWithoutDefaultValue() {
        const result = catchError({ catchFunction: tryCatchCallback, throwErr: false, bindContext: this })(throwAlarm)(2, 4, 8, 15, 16, 23, 42);
        expect(result).to.equal(undefined);
    }


    @test('catchError Class getter call without throw and with default value, should return 123')
    tryCatch_class_getter_callWithoutThrowAndWithDefaultValue() {
        const result = this.testclass.simpleCatchGetter;
        expect(result).to.equal(123);
    }

    @test('catchError Class getter call with throw, should throw error with "alarm" message')
    tryCatch_class_getter_callWithThrow() {
        try {
            const result = this.testclass.throwCatchGetter;
        } catch (err) {
            expect(err.message).to.equal('alarm');
        }
    }

    @test('catchError Class getter call without throw and without default value, should return undefined')
    tryCatch_class_getter_callWithoutThrowAndWithoutDefaultValue() {
        const result = this.testclass.withoutDefaultValueCatchGetter;
        expect(result).to.equal(undefined);
    }

    @test('catchError Class static method call without throw and without default value, should return undefined')
    tryCatch_class_static_method_callWithoutThrowAndWithoutDefaultValue() {
        const result = TestCatchErrorDecoratorClass.staticWithDefaultValueCatch();
        expect(result).to.equal(undefined);
    }

    @test('catchError Class static getter call with throw, should throw error with "alarm" message')
    tryCatch_class_static_getter_callWithoutThrowAndWithoutDefaultValue() {
        const result = TestCatchErrorDecoratorClass.throwCatchStaticGetter;
        expect(result).to.equal(123);
    }
}
