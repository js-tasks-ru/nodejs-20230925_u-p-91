const Log = require("./writeLog.js");

const intervalId = setInterval(() => {
  console.log('James');
  Log.getInstance().write('James');
}, 10);

setTimeout(() => {
  const promise = new Promise((resolve) => {
    console.log('Richard');
    Log.getInstance().write('Richard');
    resolve('Robert');
  });

  promise
      .then((value) => {
        console.log(value);
        Log.getInstance().write(value);

        setTimeout(() => {
          console.log('Michael');
          Log.getInstance().write('Michael');
          Log.getInstance().end();

          clearInterval(intervalId);
        }, 10);
      });

  console.log('John');
  Log.getInstance().write('John');
}, 10);
