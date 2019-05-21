# inter-plugin

> 整理一下工作上用得到的插件

## chrome

## web

### jimp

> The "JavaScript Image Manipulation Program" :-)

REFER: https://github.com/oliver-moran/jimp/tree/master/packages/jimp

An image processing library for `Node` written entirely in JavaScript, with zero native dependencies.

```js
npm install jimp -S

const Jimp = require('jimp)

// open a file called 'lenna.png'
Jimp.read('lenna.png', (err, lenna) => {
  if (err) throw err
  lenna
    .resize(256, 256)
    .qulity(60)
    .greyscale()
    write('lena-small-bw.jpg)
})

// Using promies
Jimp.read('lenna.png')
  .then(lenna => {
    return lenna
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write('lena-small-bw.jpg'); // save
  })
  .catch(err => {
    console.error(err);
  });
```

## server

### Mokia

> A mock server integrated data simulation and http service

REFER: https://github.com/varHarrie/mokia/blob/develop/README.zh-cn.md

```js
npm install mokia -S

// mock.ts
import { mock, PORT, ServerConfig } from 'mokia'

const config: ServerConfig = {
  [PORT]: 3000,
  'GET /users': () => {
    return {
      users: mock.array({
        id: mock.uuid(),
        name: mock.fullName()
      }, 0, 5)
    }
  },
  'GET /users/:id': () => {
    return {
      id: mock.uuid(),
      name: mock.fullName()
    }
  }
}

export default config
```

## test

## Git

### github-rank

> Github Users Ranking

REFER: https://github.com/jaywcjlove/github-rank