"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const main_1 = require("./../lib/main");
const mocha_typescript_1 = require("mocha-typescript");
const tryCatchCallback = (errMessage, errStack, funcName, className, context, args) => {
    // UNCOMMENT NEXT LINE IF U WANT SEE CALLBACK IN ACTION
    // console.log(errMessage, errStack, funcName, className, args);
    // console.log(funcName, className, args);
};
function throwAlarm() {
    throw new Error('alarm');
}
class TestCatchErrorDecoratorClass {
    simpleCatch(...args) {
        throw new Error('alarm');
    }
    throwCatch(...args) {
        throw new Error('alarm');
    }
    withoutDefaultValueCatch(...args) {
        throw new Error('alarm');
    }
    get simpleCatchGetter() {
        throw new Error('alarm');
    }
    get throwCatchGetter() {
        throw new Error('alarm');
    }
    get withoutDefaultValueCatchGetter() {
        throw new Error('alarm');
    }
    static staticWithDefaultValueCatch() {
        throw new Error('alarm');
    }
    static get throwCatchStaticGetter() {
        throw new Error('alarm');
    }
}
__decorate([
    main_1.catchError(tryCatchCallback, false, 123),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorClass.prototype, "simpleCatch", null);
__decorate([
    main_1.catchError(tryCatchCallback),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorClass.prototype, "throwCatch", null);
__decorate([
    main_1.catchError({ catchFunction: tryCatchCallback, throwErr: false }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorClass.prototype, "withoutDefaultValueCatch", null);
__decorate([
    main_1.catchError({ catchFunction: tryCatchCallback, throwErr: false, defaultValueOnError: 123 }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], TestCatchErrorDecoratorClass.prototype, "simpleCatchGetter", null);
__decorate([
    main_1.catchError({ catchFunction: tryCatchCallback, throwErr: true, defaultValueOnError: 123 }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], TestCatchErrorDecoratorClass.prototype, "throwCatchGetter", null);
__decorate([
    main_1.catchError({ catchFunction: tryCatchCallback, throwErr: false }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], TestCatchErrorDecoratorClass.prototype, "withoutDefaultValueCatchGetter", null);
__decorate([
    main_1.catchError({ catchFunction: tryCatchCallback, throwErr: false }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorClass, "staticWithDefaultValueCatch", null);
__decorate([
    main_1.catchError(tryCatchCallback, false, 123),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], TestCatchErrorDecoratorClass, "throwCatchStaticGetter", null);
let TestCatchErrorDecoratorUnit = class TestCatchErrorDecoratorUnit {
    before() {
        this.testclass = new TestCatchErrorDecoratorClass();
    }
    tryCatch_class_callWithoutThrowAndWithDefaultValue() {
        const result = this.testclass.simpleCatch(345);
        chai_1.expect(result).to.equal(123);
    }
    tryCatch_class_callWithThrow() {
        try {
            const result = this.testclass.throwCatch(234, 567);
        }
        catch (err) {
            chai_1.expect(err.message).to.equal('alarm');
        }
    }
    tryCatch_class_callWithoutThrowAndWithoutDefaultValue() {
        const result = this.testclass.withoutDefaultValueCatch(1, 2, 3);
        chai_1.expect(result).to.equal(undefined);
    }
    tryCatch_func_callWithoutThrowAndWithDefaultValue() {
        const result = main_1.catchError({ catchFunction: tryCatchCallback, throwErr: false, defaultValueOnError: 123 })(throwAlarm)();
        chai_1.expect(result).to.equal(123);
    }
    tryCatch_func_callWithThrow() {
        try {
            const result = main_1.catchError({ catchFunction: tryCatchCallback, throwErr: true })(throwAlarm)('000', '123');
        }
        catch (err) {
            chai_1.expect(err.message).to.equal('alarm');
        }
    }
    tryCatch_func_callWithoutThrowAndWithoutDefaultValue() {
        const result = main_1.catchError({ catchFunction: tryCatchCallback, throwErr: false, bindContext: this })(throwAlarm)(2, 4, 8, 15, 16, 23, 42);
        chai_1.expect(result).to.equal(undefined);
    }
    tryCatch_class_getter_callWithoutThrowAndWithDefaultValue() {
        const result = this.testclass.simpleCatchGetter;
        chai_1.expect(result).to.equal(123);
    }
    tryCatch_class_getter_callWithThrow() {
        try {
            const result = this.testclass.throwCatchGetter;
        }
        catch (err) {
            chai_1.expect(err.message).to.equal('alarm');
        }
    }
    tryCatch_class_getter_callWithoutThrowAndWithoutDefaultValue() {
        const result = this.testclass.withoutDefaultValueCatchGetter;
        chai_1.expect(result).to.equal(undefined);
    }
    tryCatch_class_static_method_callWithoutThrowAndWithoutDefaultValue() {
        const result = TestCatchErrorDecoratorClass.staticWithDefaultValueCatch();
        chai_1.expect(result).to.equal(undefined);
    }
    tryCatch_class_static_getter_callWithoutThrowAndWithoutDefaultValue() {
        const result = TestCatchErrorDecoratorClass.throwCatchStaticGetter;
        chai_1.expect(result).to.equal(123);
    }
};
__decorate([
    mocha_typescript_1.test('catchError Class method call without throw and with default value, should return 123'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_class_callWithoutThrowAndWithDefaultValue", null);
__decorate([
    mocha_typescript_1.test('catchError Class method call with throw, should throw error with "alarm" message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_class_callWithThrow", null);
__decorate([
    mocha_typescript_1.test('catchError Class method call without throw and withoud default value, should return undefined'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_class_callWithoutThrowAndWithoutDefaultValue", null);
__decorate([
    mocha_typescript_1.test('catchError func call without throw and with default value, should return 123'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_func_callWithoutThrowAndWithDefaultValue", null);
__decorate([
    mocha_typescript_1.test('catchError func call with throw, should throw error with "alarm" message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_func_callWithThrow", null);
__decorate([
    mocha_typescript_1.test('catchError func call without throw and withoud default value, should return undefined'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_func_callWithoutThrowAndWithoutDefaultValue", null);
__decorate([
    mocha_typescript_1.test('catchError Class getter call without throw and with default value, should return 123'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_class_getter_callWithoutThrowAndWithDefaultValue", null);
__decorate([
    mocha_typescript_1.test('catchError Class getter call with throw, should throw error with "alarm" message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_class_getter_callWithThrow", null);
__decorate([
    mocha_typescript_1.test('catchError Class getter call without throw and without default value, should return undefined'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_class_getter_callWithoutThrowAndWithoutDefaultValue", null);
__decorate([
    mocha_typescript_1.test('catchError Class static method call without throw and without default value, should return undefined'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_class_static_method_callWithoutThrowAndWithoutDefaultValue", null);
__decorate([
    mocha_typescript_1.test('catchError Class static getter call with throw, should throw error with "alarm" message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestCatchErrorDecoratorUnit.prototype, "tryCatch_class_static_getter_callWithoutThrowAndWithoutDefaultValue", null);
TestCatchErrorDecoratorUnit = __decorate([
    mocha_typescript_1.suite("catchError decorator function unit test cases.")
], TestCatchErrorDecoratorUnit);
