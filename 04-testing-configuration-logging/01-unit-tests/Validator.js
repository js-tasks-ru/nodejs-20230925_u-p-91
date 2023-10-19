class Validator {
  static keysRule = [{"type": ["string", "number"]}, {"min": "number"}, {"max": "number"}];

  _check(rules) {
    for(let prop in rules) {
      const arrKeysRule = Object.keys(rules[prop]);
    
      if(arrKeysRule.length !== Validator.keysRule.length) {
       return new Error("Invalid count property")
      }
      
      for(const objKey of Validator.keysRule) {        
        const index = arrKeysRule.indexOf(Object.keys(objKey)[0]);
       
        if(index === -1) {
          return new Error(`Invalid property of the passed rule '${prop}'`);
        }
        
        const typeRule = rules[prop][arrKeysRule[index]];
        if(!(typeof typeRule === objKey[arrKeysRule[index]] || (Array.isArray(objKey[arrKeysRule[index]]) && objKey[arrKeysRule[index]].includes(typeRule)))) {
          return new Error(`Invalid data type specified for properties '${prop}'`)
        }
      }
    }
  }

  constructor(rules) {
    const resCheck = this._check(rules);
    if(resCheck instanceof Error) {
      throw new Error(resCheck.message)
    }
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      errors.push({error: `argument is not an object`});
      return errors;
    }

    const objKeys = Object.keys(obj);
    const arrKeysRule = Object.keys(this.rules);

    for(let i = 0; i < objKeys.length; i++) {
      const fiildObj = objKeys[i];
      if(!arrKeysRule.includes(fiildObj)) {
        errors.push({field: fiildObj, error: `invalid property ${fiildObj}`});
        objKeys.splice(i, 1);
        i--;
      }
    }
      for (let i = 0; i < arrKeysRule.length; i++) {
        const field = arrKeysRule[i];
        
        if(!objKeys.includes(field)) {
          errors.push({field: field, error: `no ${field} property on object`});
          arrKeysRule.splice(i, 1);
          i--;
          continue;
        }

        const rules = this.rules[field];

        const value = obj[field];
        const type = typeof value;

        if (type !== rules.type) {
          errors.push({field, error: `expect ${rules.type}, got ${type}`});
          continue;
        }

        switch (type) {
          case 'string':
            if (value.length < rules.min) {
              errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
            }
            if (value.length > rules.max) {
              errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
            }
            break;
          case 'number':
            if (value < rules.min) {
              errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
            }
            if (value > rules.max) {
              errors.push({field, error: `too big, expect ${rules.min}, got ${value}`});
            }
            break;
        }
        arrKeysRule.splice(i, 1);
        i--;
      }
    
    return errors;
  }
};
module.exports = Validator;
