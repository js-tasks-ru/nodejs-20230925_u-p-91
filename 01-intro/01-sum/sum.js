function sum(a, b) {
  /* ваш код */
  function checkIsNumber(n) {
    if(Number.isInteger(n) && n % 1 === 0) {
      return true;
    }
    
    throw new TypeError("")
  }

  if(checkIsNumber(a) && checkIsNumber(b)) {
    return a + b;
  } 

}

module.exports = sum;
