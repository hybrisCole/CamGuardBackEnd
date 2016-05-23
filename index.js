const koa = require('koa');
const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-busboy');
const fs = require('fs');
const app = koa();
const PORT = 1985;

app.use(logger());
app.use(route.get('/test', function *test() {
  this.type = 'json';
  this.body = {
    data : 'test',
  }
}));

app.use(route.post('/image', function *image() {
  if (!this.request.is('multipart/*')) {
    return yield next;
  };
  const parts = parse(this);
  let part;
  while (part = yield parts) {
    part.pipe(fs.createWriteStream(`${new Date().getTime()}.jpg`));
  }
  this.type = 'json';
  this.body = {
    data : 'test',
  }
}));

console.log(`Listening at ${PORT}`);
app.listen(PORT);
