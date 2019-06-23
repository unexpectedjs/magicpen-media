const MagicPen = require('magicpen');

const magicPen = new MagicPen().installPlugin(require('../lib/magicPenMedia'));

const getTemporaryFilePath = require('gettemporaryfilepath');

const sinon = require('sinon');

const expect = require('unexpected')
  .clone()
  .installPlugin(require('unexpected-sinon'))
  .installPlugin(require('unexpected-fs'));

describe('magicpen-media', () => {
  describe('in HTML mode', () => {
    it('should render an image given as a path', () => {
      expect(
        magicPen
          .clone('html')
          .media('foo/bar.jpg')
          .toString(),
        'to equal',
        '<div style="font-family: monospace; white-space: nowrap"><div><img src="foo/bar.jpg" title="foo/bar.jpg"></div></div>'
      );
    });

    it('should link to the image url if link:true is provided in the options object', () => {
      expect(
        magicPen
          .clone('html')
          .media('foo/bar.jpg', { link: true })
          .toString(),
        'to equal',
        '<div style="font-family: monospace; white-space: nowrap"><div><a href="foo/bar.jpg"><img src="foo/bar.jpg" title="foo/bar.jpg"></a></div></div>'
      );
    });

    it('should link to an arbitrary url if link is provided in the options object with a string value', () => {
      expect(
        magicPen
          .clone('html')
          .media('foo/bar.jpg', { link: 'http://unexpected.js.org/' })
          .toString(),
        'to equal',
        '<div style="font-family: monospace; white-space: nowrap"><div><a href="http://unexpected.js.org/"><img src="foo/bar.jpg" title="foo/bar.jpg"></a></div></div>'
      );
    });

    it('should entitify the src attribute properly', () => {
      expect(
        magicPen
          .clone('html')
          .media('foo&bar".jpg')
          .toString(),
        'to equal',
        '<div style="font-family: monospace; white-space: nowrap"><div><img src="foo&amp;bar&quot;.jpg" title="foo&amp;bar&quot;.jpg"></div></div>'
      );
    });

    it('should support an alt text passed in the options object', () => {
      expect(
        magicPen
          .clone('html')
          .media('foobar.jpg', { alt: 'hey"there' })
          .toString(),
        'to equal',
        '<div style="font-family: monospace; white-space: nowrap"><div><img src="foobar.jpg" alt="hey&quot;there" title="foobar.jpg"></div></div>'
      );
    });

    it('should support a title passed in the options object', () => {
      expect(
        magicPen
          .clone('html')
          .media('foobar.jpg', { title: 'hey"there' })
          .toString(),
        'to equal',
        '<div style="font-family: monospace; white-space: nowrap"><div><img src="foobar.jpg" title="hey&quot;there"></div></div>'
      );
    });

    it('should render an image given as a data: url', () => {
      expect(
        magicPen
          .clone('html')
          .media('data:image/jpg,base64;Zm9v')
          .toString(),
        'to equal',
        '<div style="font-family: monospace; white-space: nowrap"><div><img src="data:image/jpg,base64;Zm9v"></div></div>'
      );
    });

    it('should specify width and height if provided in the options object', () => {
      expect(
        magicPen
          .clone('html')
          .media('foo/bar.jpg', { width: 10, height: 20 })
          .toString(),
        'to equal',
        '<div style="font-family: monospace; white-space: nowrap"><div><img src="foo/bar.jpg" title="foo/bar.jpg" style="max-width: 6em; max-width: 10ch; max-height: 20em"></div></div>'
      );
    });

    it('should render a video via the video style with an options object that has width and height', () => {
      expect(
        magicPen
          .clone('html')
          .video('foo.mkv', { width: 10, height: 20 })
          .toString(),
        'to equal',
        '<div style="font-family: monospace; white-space: nowrap"><div><video src="foo.mkv" title="foo.mkv" style="max-width: 6em; max-width: 10ch; max-height: 20em"></video></div></div>'
      );
    });

    it('should render audio via the audio style with an options object that has width and height', () => {
      expect(
        magicPen
          .clone('html')
          .audio('foo.aiff', { width: 10, height: 20 })
          .toString(),
        'to equal',
        '<div style="font-family: monospace; white-space: nowrap"><div><audio src="foo.aiff" title="foo.aiff" style="max-width: 6em; max-width: 10ch; max-height: 20em"></audio></div></div>'
      );
    });

    describe('with Blob and URL.createObjectURL available', () => {
      const originalBlob = global.Blob;

      const originalURL = global.URL;
      beforeEach(() => {
        global.Blob = sinon.spy(function(data, contentType) {
          this.data = data;
          this.contentType = contentType;
        });

        global.URL = {
          createObjectURL: sinon.spy(() => 'blob:foobarquux')
        };
      });

      afterEach(() => {
        global.Blob = originalBlob;
        global.URL = originalURL;
      });

      it('should render an image given as a Uint8Array as a blob: url', () => {
        expect(
          magicPen
            .clone('html')
            .media(new Uint8Array([1, 2, 3]), 'image/png')
            .toString(),
          'to equal',
          '<div style="font-family: monospace; white-space: nowrap"><div><img src="blob:foobarquux"></div></div>'
        );
        expect(global.Blob, 'was called once');
        expect(global.Blob, 'was called with new');
        expect(global.URL.createObjectURL, 'was called once');
        expect(
          global.URL.createObjectURL,
          'was always called with',
          new global.Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' })
        );
      });

      it('should render an image given as a Buffer as a blob: url', () => {
        expect(
          magicPen
            .clone('html')
            .media(new Uint8Array([1, 2, 3]), 'image/png')
            .toString(),
          'to equal',
          '<div style="font-family: monospace; white-space: nowrap"><div><img src="blob:foobarquux"></div></div>'
        );
        expect(global.Blob, 'was called once');
        expect(global.Blob, 'was called with new');
        expect(global.URL.createObjectURL, 'was called once');
        expect(
          global.URL.createObjectURL,
          'was always called with',
          new global.Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' })
        );
      });
    });

    describe('with Blob and URL.createObjectURL unavailable', () => {
      const originalBlob = global.Blob;

      const originalURL = global.URL;
      beforeEach(() => {
        global.Blob = undefined;
        global.URL = undefined;
      });

      afterEach(() => {
        global.Blob = originalBlob;
        global.URL = originalURL;
      });

      it('should render an image given as a Uint8Array as a data: url', () => {
        expect(
          magicPen
            .clone('html')
            .media(new Uint8Array([1, 2, 3]), 'image/png')
            .toString(),
          'to equal',
          '<div style="font-family: monospace; white-space: nowrap"><div><img src="data:image/png;base64,AQID"></div></div>'
        );
      });

      it('should render an image given as a Buffer as a data: url', () => {
        expect(
          magicPen
            .clone('html')
            .media(new Buffer([1, 2, 3]), 'image/png')
            .toString(),
          'to equal',
          '<div style="font-family: monospace; white-space: nowrap"><div><img src="data:image/png;base64,AQID"></div></div>'
        );
      });

      describe('and btoa available', () => {
        const originalBtoa = global.Blob;
        beforeEach(() => {
          global.btoa = sinon.spy(obj => new Buffer(obj).toString('base64'));
        });

        afterEach(() => {
          global.btoa = originalBtoa;
        });

        it('should use btoa when building a data: url', () => {
          expect(
            magicPen
              .clone('html')
              .media(new Uint8Array([1, 2, 3]), 'image/png')
              .toString(),
            'to equal',
            '<div style="font-family: monospace; white-space: nowrap"><div><img src="data:image/png;base64,AQID"></div></div>'
          );
          expect(global.btoa, 'was called once');
        });
      });
    });
  });

  describe('in text mode', () => {
    describe('#media', () => {
      it('should render an image given as a path and no Content-Type as-is with "media" in parentheses', () => {
        expect(
          magicPen
            .clone('text')
            .media('foo/bar.jpg')
            .toString(),
          'to equal',
          'foo/bar.jpg (image/jpeg)'
        );
      });

      it('should render an image given as a path and a Content-Type of "image" as-is with "image" in parentheses', () => {
        expect(
          magicPen
            .clone('text')
            .media('foo/bar.jpg', 'image')
            .toString(),
          'to equal',
          'foo/bar.jpg (image/jpeg)'
        );
      });

      it('should accept the contentType property in the options object', () => {
        expect(
          magicPen
            .clone('text')
            .media('foo/bar.jpg', { contentType: 'image' })
            .toString(),
          'to equal',
          'foo/bar.jpg (image/jpeg)'
        );
      });

      it('should render the file size when given a Buffer', () => {
        expect(
          magicPen
            .clone('text')
            .media(new Buffer([1, 2, 3]), { contentType: 'image' })
            .toString(),
          'to equal',
          'Buffer[3] (image)'
        );
      });
    });

    describe('#image', () => {
      it('should render an image given as a path and no Content-Type as-is with a looked up Content-Type', () => {
        expect(
          magicPen
            .clone('text')
            .image('foo/bar.svg')
            .toString(),
          'to equal',
          'foo/bar.svg (image/svg+xml)'
        );
      });

      it('should accept the content type as the second parameter', () => {
        expect(
          magicPen
            .clone('text')
            .image('foo/bar.jpg', 'image/jpeg')
            .toString(),
          'to equal',
          'foo/bar.jpg (image/jpeg)'
        );
      });

      it('should accept the contentType property in the options object', () => {
        expect(
          magicPen
            .clone('text')
            .image('foo/bar.jpg', { contentType: 'image/jpeg' })
            .toString(),
          'to equal',
          'foo/bar.jpg (image/jpeg)'
        );
      });

      it('should render a data url', () => {
        expect(
          magicPen
            .clone('text')
            .image('data:image/png,base64;AQID')
            .toString(),
          'to equal',
          'data url (image/png)'
        );
      });

      it('should prefer the Content-Type from the data: url over the one given in the options object', () => {
        expect(
          magicPen
            .clone('text')
            .image('data:image/png,base64;AQID', { contentType: 'image/jpeg' })
            .toString(),
          'to equal',
          'data url (image/png)'
        );
      });
    });

    describe('#audio', () => {
      it('should render an audio file given as a path and no Content-Type with the looked up Content-Type in parentheses', () => {
        expect(
          magicPen
            .clone('text')
            .audio('foo/bar.aiff')
            .toString(),
          'to equal',
          'foo/bar.aiff (audio/x-aiff)'
        );
      });

      it('should accept the content type as the second parameter', () => {
        expect(
          magicPen
            .clone('text')
            .audio('foo/bar.aiff', 'audio/aiff')
            .toString(),
          'to equal',
          'foo/bar.aiff (audio/aiff)'
        );
      });

      it('should accept the contentType property in the options object', () => {
        expect(
          magicPen
            .clone('text')
            .audio('foo/bar.aiff', { contentType: 'audio/aiff' })
            .toString(),
          'to equal',
          'foo/bar.aiff (audio/aiff)'
        );
      });
    });

    describe('#video', () => {
      it('should render an video file given as a path and no Content-Type as-is with the looked up Content-Type in parentheses', () => {
        expect(
          magicPen
            .clone('text')
            .video('foo/bar.mkv')
            .toString(),
          'to equal',
          'foo/bar.mkv (video/x-matroska)'
        );
      });

      it('should render an video file given as a path and no Content-Type as-is with "video" in parentheses when the video style is used and the extension is unknown', () => {
        expect(
          magicPen
            .clone('text')
            .video('foo/bar.foo')
            .toString(),
          'to equal',
          'foo/bar.foo (video)'
        );
      });

      it('should accept the contentType as the second parameter', () => {
        expect(
          magicPen
            .clone('text')
            .video('foo/bar.mkv', 'video/x-matroska')
            .toString(),
          'to equal',
          'foo/bar.mkv (video/x-matroska)'
        );
      });

      it('should accept the contentType property in the options object', () => {
        expect(
          magicPen
            .clone('text')
            .video('foo/bar.mkv', { contentType: 'video/x-matroska' })
            .toString(),
          'to equal',
          'foo/bar.mkv (video/x-matroska)'
        );
      });
    });

    describe('with fallbackToDisc', () => {
      it('should write the contents of a data: url to a temporary file', () =>
        expect(
          () => {
            const text = magicPen
              .clone('text')
              .image('data:image/png;base64,AQID', { fallbackToDisc: true })
              .toString();
            expect(text, 'to match', /^\/tmp\/.* \(image\/png\)$/);
            const fileName = text.split(' ')[0];

            return expect(fileName, 'to be a path satisfying', {
              isFile: true,
              content: new Buffer([1, 2, 3])
            });
          },
          'with fs mocked out',
          {
            '/tmp': {}
          },
          'not to error'
        ));

      it('should write the contents of a Uint8Array to a temporary file', () =>
        expect(
          () => {
            const text = magicPen
              .clone('text')
              .image(new Uint8Array([1, 2, 3]), { fallbackToDisc: true })
              .toString();
            expect(text, 'to match', /^\/tmp\/.* \(image\)$/);
            const fileName = text.split(' ')[0];

            return expect(fileName, 'to be a path satisfying', {
              isFile: true,
              content: new Buffer([1, 2, 3])
            });
          },
          'with fs mocked out',
          {
            '/tmp': {}
          },
          'not to error'
        ));

      it('should write the contents of a Buffer to a temporary file', () =>
        expect(
          () => {
            const text = magicPen
              .clone('text')
              .image(new Buffer([1, 2, 3]), { fallbackToDisc: true })
              .toString();
            expect(text, 'to match', /^\/tmp\/.* \(image\)/);
            const fileName = text.split(' ')[0];

            return expect(fileName, 'to be a path satisfying', {
              isFile: true,
              content: new Buffer([1, 2, 3])
            });
          },
          'with fs mocked out',
          {
            '/tmp': {}
          },
          'not to error'
        ));

      it('should use an explicitly provided file name when a data url is written to disc', () =>
        expect(
          () => {
            const fileName = getTemporaryFilePath({ suffix: '.foobar' });
            expect(
              magicPen
                .clone('text')
                .image('data:image/png;base64,MTIz', {
                  fallbackToDisc: fileName
                })
                .toString(),
              'to equal',
              fileName + ' (image/png)'
            );

            return expect(fileName, 'to be a path satisfying', {
              isFile: true,
              content: new Buffer('123')
            });
          },
          'with fs mocked out',
          {
            '/tmp': {}
          },
          'not to error'
        ));

      it('should use an explicitly provided file name', () =>
        expect(
          () => {
            const fileName = getTemporaryFilePath({ suffix: '.foobar' });
            expect(
              magicPen
                .clone('text')
                .image(new Buffer([1, 2, 3]), { fallbackToDisc: fileName })
                .toString(),
              'to equal',
              fileName + ' (image)'
            );

            return expect(fileName, 'to be a path satisfying', {
              isFile: true,
              content: new Buffer([1, 2, 3])
            });
          },
          'with fs mocked out',
          {
            '/tmp': {}
          },
          'not to error'
        ));
    });
  });
});
