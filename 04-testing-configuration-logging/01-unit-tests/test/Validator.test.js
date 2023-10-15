const { assert } = require('chai');
const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Создание объекта "validator" ', () => {
    it('Переданное кол-во свойств правила не совпадает с ожидаемым', () => {
      expect(()=> {new Validator({name: {type: 'string', min: 0, max: 5, other: "something" }})}).to.throw("Invalid count property")
    });

    it('Переданное свойство правила не действительно', () => {
      expect(()=> {new Validator({name: {type: 'string', min: 0, other: "something" }})}).to.throw("Invalid property of the passed rule")      
    });

    it('Неверный тип данных значения для свойста правила', () => {
      expect(()=> {new Validator({name: {type: 'boolean', min: 0, max: 5}})}).to.throw("Invalid data type specified for properties")      
    });
    
    it('Успешное создание объекта валидации', () => {
      expect(new Validator({name: {type: 'string', min: 0, max: 5 }})).to.be.an('object')      
    });
  });
  

  describe('Валидация объекта', () => {
    it('проверка на меньшее кол-во символов в строковом свойстве объекта', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('проверка на большее кол-во символов в строковом свойстве объекта', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 2
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 2, got 6');
    });

    it('проверка на меньшее значение в числовом свойстве объекта', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20
        },
      });

      const errors = validator.validate({ age: 1 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 1');
    });

    it('проверка на большее значение в числовом свойстве объекта', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 1,
          max: 2
        },
      });

      const errors = validator.validate({ age: 50 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 1, got 50');
    });

    it('проверка на не существующее свойство объекта', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 20
        },
      });

      const errors = validator.validate({ name: 'Lalala', age: 5 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('invalid property age');
    });

    it('проверка на не соответствующий тип свойства объекта', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 20
        },
        age: {
          type: 'number',
          min: 1,
          max: 5
        }
      });

      const expectedErrors = [
        { field: 'name', error: 'expect string, got boolean' }, 
        { field: 'age', error: 'expect number, got string' }
      ];

      const errors = validator.validate({ name: true, age: "age" });
    
      expect(errors).to.have.length(2);
      for(let i = 0; i < expectedErrors.length; i++) {
        expect(errors[i]).to.have.property('field').and.to.be.equal(expectedErrors[i].field);
        expect(errors[i]).to.have.property('error').and.to.be.equal(expectedErrors[i].error);
      }
    });

    it('проверка на отсутствующее свойство объекта', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 20
        },
        age: {
          type: 'number', 
          min: 0,
          max: 18
        }
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('no age property on object');
    });

    it('проверка на успешную проверку объекта', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 20
        },
        age: {
          type: 'number',
          min: 0,
          max: 80
        }
      });

      const errors = validator.validate({ name: 'Lalala', age: 5 });
      
      expect(errors).to.have.length(0);
    });
  });
});