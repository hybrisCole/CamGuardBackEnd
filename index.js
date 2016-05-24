const koa = require('koa');
const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-busboy');
const serve = require('koa-static');
const fs = require('fs');
const app = koa();
const PORT = 1985;
const publish = require('./socket');
let imageName = 'image';

app.use(logger());
app.use(serve(__dirname, {
  maxage : 0,
}));

app.use(route.post('/image', function *image() {
  if (!this.request.is('multipart/*')) {
    return yield next;
  };
  const parts = parse(this);
  let part;
  while (part = yield parts) {
    const stream = part.pipe(fs.createWriteStream(`${imageName}.jpg`));
    stream.on('finish', () => {
      console.log('sending');
      publish('camguard:newimage', imageName);
    });
  }
  this.type = 'json';
  this.body = {
    data : 'test',
  }
}));

console.log(`Listening at ${PORT}`);
app.listen(PORT);
