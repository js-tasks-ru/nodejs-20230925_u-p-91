const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._encoding = options.encoding;
    this.line = "";
  }

  async _transform(chunk, encoding, callback) {
    
    const data = chunk.toString(this._encoding);

    if(data.includes(os.EOL)) {
      let arr = data.split(os.EOL);

      for(let i = 0; i < arr.length - 1; i++) {
        this.line = this.line + arr[i];
        this.push(this.line);
        this.line = "";
      }

      this.line += arr[arr.length - 1];

    } else {
      this.line += data;
    }


    callback()
  }

  _flush(callback) {
    callback(null, this.line);
  }
}

module.exports = LineSplitStream;
