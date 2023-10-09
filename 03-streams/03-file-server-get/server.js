const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  
  req.on('aborted', () => {
    streamFile.destroy();
  });

  if(pathname !== "favicon.ico") {
 
    if(pathname.includes("/")) {
      res.statusCode = 400;
      return res.end("Invalid path file");
    }

    if(pathname === "") {
      res.statusCode = 400;
      return res.end();
    }

    const filepath = path.join(__dirname, 'files', pathname);
    
    switch (req.method) {
      case 'GET':
        const streamFile = fs.createReadStream(filepath);
        
        streamFile.on("error", err => {
          
          if(err.code === "ENOENT") {
            res.statusCode = 404;
          } else {
            res.statusCode = 500;
          }
          
          return res.end();
        });

        streamFile.pipe(res);
        
        break;

      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  }

});

module.exports = server;
