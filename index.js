const koa = require('koa');
const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-busboy');
const serve = require('koa-static');
const fs = require('fs');
const app = koa();
const PORT = 1985;

const publish = require('./socket');

app.use(logger());
app.use(serve(__dirname, {
  maxage : 50 * 1000,
}));

app.use(route.post('/image', function *image() {
  if (!this.request.is('multipart/*')) {
    return yield next;
  };
  const parts = parse(this);
  let part;
  while (part = yield parts) {
    const imageName = new Date().getTime();
    publish('camguard:newimage', imageName);
    part.pipe(fs.createWriteStream(`${imageName}.jpg`));
  }
  this.type = 'json';
  this.body = {
    data : 'test',
  }
}));

console.log(`Listening at ${PORT}`);
app.listen(PORT);
