const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require("./LimitSizeStream");

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURI(url.pathname.slice(1));
  let streamFile = null;
  let limitedStream = null;   


  req.on('aborted', async () => {

    if(streamFile && streamFile instanceof require('stream').Writable) {
      streamFile.destroy();
      limitedStream.destroy()
      try {
        await fs.promises.unlink(filepath);
      }catch(err) {
        console.log(err);
      }
    }
  });

  if(pathname === "") {
    res.statusCode = 400;
    return res.end();
  }

  if(pathname.includes("/")) {      
    res.statusCode = 400;
    return res.end("Invalid path file");
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      try {
        await fs.promises.access(path.join(__dirname, "files"));
      } catch (err) {

          if(err.code !== "ENOENT") {
            res.statusCode = 500;
            return res.end("Unexpected situation on the server");
          }
          
          try {
            await fs.promises.mkdir(path.join(__dirname, "files"));
          } catch(err) {
            res.statusCode = 500;
            return res.end("Failed to create folder on server");
          }

      } finally {

        try {
          await fs.promises.access(filepath);
          
          res.statusCode = 409;
          res.end("File exist");
        } catch(err) {        
   
          
          streamFile = fs.createWriteStream(filepath);
          limitedStream = new LimitSizeStream({limit: 1024 * 1024});

          req.pipe(limitedStream).pipe(streamFile);
    
          
          limitedStream.on("error", async err=> {
            console.log(err.message)
            res.statusCode = 413;
            try {
              streamFile.destroy()
              await fs.promises.unlink(filepath);
              console.log("DELETE FILE");
            }catch(err) {
              res.statusCode = 500;
              console.log(err)
            }

          });
          
          limitedStream.on("end", _ => {console.log("end limitedStream")});
          limitedStream.on("close", _ => {
            console.log("close limitedStream");
          });

          streamFile.on("error", err => {
            limitedStream.destroy()
            console.log("error streamFile");
          })
          streamFile.on("finish", () => {
            res.statusCode = 201;
            console.log("finish streamFile");
          });
          streamFile.on("close", _ => {
            console.log("close streamFile");
                
            return res.end();
          });
        }
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
