
const fs = require("fs");
const {EOL} = require('os');

class Log {

    static instance = null;

    constructor() {
        const logFile = "solution.txt";
        this._writeStream = fs.createWriteStream(logFile, { flags: "a" });

        this._writeStream.on("error", (err) => {
            console.log(err);
            process.exit(1);
        });
    }

    static getInstance() {
      if(!Log.instance) {
        Log.instance = new Log();
      }

      return Log.instance;
    }

    write(message) {
        const data = `${message}${EOL}`;
        this._writeStream.write(data);
    }

    end() {
      this._writeStream.end();
    }

}

module.exports = Log;