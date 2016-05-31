const _ = require('lodash');
const uuid = require('uuid');
const fs = require('fs');
const koa = require('koa');
// const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-busboy');
const serve = require('koa-static');
const app = koa();
const PORT = 1985;
const socketRef = require('./socket');
let imageArray = [];
let imageName = new Date().getTime();

// app.use(logger());
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
    imageName = uuid.v4();
    const stream = part.pipe(fs.createWriteStream(`${imageName}.jpg`));
    stream.on('finish', () => {
      console.log('saving image');
      imageArray.push(imageName);
    });
  }
  this.type = 'json';
  this.body = {
    data : 'test',
  }
}));

socketRef.subscribe('camguard:requestimage', (message) =>{
  const nextImage = imageArray[0];
  if (message.previousImage !== 'NO_IMAGE') {
    setTimeout(function () {
      fs.unlink(`${message.previousImage}.jpg`, function (err) {
        if (err) {
          console.log(err.Error);
        } else {
          console.log('todo bien');
        }
      });
    }, 1500);
  }
  console.log(`next image should be ${nextImage}`);
  socketRef.publish('camguard:newimage', nextImage || 'borraja');
  imageArray = _.drop(imageArray);
  console.log(`${imageArray.length} images to send`);
});

console.log(`Listening at ${PORT}`);
app.listen(PORT);
