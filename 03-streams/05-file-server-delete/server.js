const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURI(url.pathname.slice(1));

  if(pathname === "" || pathname.includes("/")) {
    res.statusCode = 400;
    return res.end("Invalid path file");
  }

  const filepath = path.join(__dirname, 'files', pathname);
 
  switch (req.method) {
    case 'DELETE':
      try {
        await fs.promises.unlink(filepath);
        res.statusCode = 200;
      }catch(err) {
        if(err.code === "ENOENT") {
          res.statusCode = 404;
          res.write("file is not exist")
        } else {
          res.statusCode = 500;
          console.log(err);
          res.write("unexpected error");
        }
      } finally {
        res.end();
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
