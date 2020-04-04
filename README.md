# magicpen-media

Add media support to magicpen (images, audio, video). Can also be used as a
plugin to [Unexpected 9.0.0+](https://unexpected.js.org/).

[![NPM version](https://badge.fury.io/js/magicpen-media.svg)](http://badge.fury.io/js/magicpen-media)
[![Build Status](https://travis-ci.org/unexpectedjs/magicpen-media.svg?branch=master)](https://travis-ci.org/unexpectedjs/magicpen-media)
[![Coverage Status](https://coveralls.io/repos/unexpectedjs/magicpen-media/badge.svg)](https://coveralls.io/r/unexpectedjs/magicpen-media)
[![Dependency Status](https://david-dm.org/unexpectedjs/magicpen-media.svg)](https://david-dm.org/unexpectedjs/magicpen-media)

```javascript
var MagicPen = require('magicpen');

var pen = new MagicPen().installPlugin(require('magicpen-media')).clone('html');

pen.image('foo.png');

console.log(pen.toString());
```

Output:

```html
<div style="font-family: monospace; white-space: nowrap">
  <div><img src="foo.png" /></div>
</div>
```
