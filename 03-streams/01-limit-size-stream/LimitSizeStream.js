const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    
    this._countByte = 0;
    this._limit = options.limit;
    this._encoding = options.encoding;
  }

  _transform(chunk, encoding, callback) {

    this._countByte += Buffer.byteLength(chunk, this._encoding);
      
    if(this._countByte > this._limit) {
      return callback(new LimitExceededError())
    }
        
    const result = chunk.toString(this._encoding);
        
    callback(null, result);

  }
}

module.exports = LimitSizeStream;
  