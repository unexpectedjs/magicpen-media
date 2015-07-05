# magicpen-media
Add media support to magicpen (images, audio, video)'

```javascript
var MagicPen = require('magicpen');

var pen = new MagicPen().installPlugin(require('magicpen-media')).clone('html');

pen.image('foo.png');
```
