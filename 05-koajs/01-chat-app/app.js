const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');

const router = new Router();

const store = new Map();

router.get('/subscribe', async function(ctx, next) {
    // const id = ctx.querystring.split("=")[1]; 
    ctx.req.on('close', () => {
        store.delete(ctx)
    }); 

    await new Promise(function(resolve, reject) {
        store.set(ctx, resolve);
    });

});

router.post('/publish', async function(ctx, next) {
    const message = ctx.request.body.message;

    if(message === undefined) {
        return ctx.status = 400;
    }
  
    for (let arr of store) {
        const ctx = arr[0];
        const resolve = arr[1];

        ctx.status = 200;
        ctx.body = message;
        resolve()
    }

    store.clear();
    ctx.status = 200;

});

app.use(router.routes());

module.exports = app;