/*global describe, it, beforeEach, afterEach, global, Uint8Array*/
var MagicPen = require('magicpen'),
    magicPen = new MagicPen().installPlugin(require('../lib/magicPenMedia')),
    getTemporaryFilePath = require('gettemporaryfilepath'),
    sinon = require('sinon'),
    expect = require('unexpected').clone()
        .installPlugin(require('unexpected-sinon'))
        .installPlugin(require('unexpected-fs'));

describe('magicpen-media', function () {
    describe('in HTML mode', function () {
        it('should render an image given as a path', function () {
            expect(
                magicPen.clone('html').media('foo/bar.jpg').toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><img src="foo/bar.jpg" title="foo/bar.jpg"></div>\n' +
                '</div>'
            );
        });

        it('should entitify the src attribute properly', function () {
            expect(
                magicPen.clone('html').media('foo&bar".jpg').toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><img src="foo&amp;bar&quot;.jpg" title="foo&amp;bar&quot;.jpg"></div>\n' +
                '</div>'
            );
        });

        it('should support an alt text passed in the options object', function () {
            expect(
                magicPen.clone('html').media('foobar.jpg', { alt: 'hey"there' }).toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><img src="foobar.jpg" alt="hey&quot;there" title="foobar.jpg"></div>\n' +
                '</div>'
            );
        });

        it('should support a title passed in the options object', function () {
            expect(
                magicPen.clone('html').media('foobar.jpg', { title: 'hey"there' }).toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><img src="foobar.jpg" title="hey&quot;there"></div>\n' +
                '</div>'
            );
        });

        it('should render an image given as a data: url', function () {
            expect(
                magicPen.clone('html').media('data:image/jpg,base64;Zm9v').toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><img src="data:image/jpg,base64;Zm9v"></div>\n' +
                '</div>'
            );
        });

        it('should specify width and height if provided in the options object', function () {
            expect(
                magicPen.clone('html').media('foo/bar.jpg', { width: 10, height: 20 }).toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><img src="foo/bar.jpg" title="foo/bar.jpg" style="max-width: 6em; max-width: 10ch; max-height: 20em"></div>\n' +
                '</div>'
            );
        });

        it('should render a video via the video style with an options object that has width and height', function () {
            expect(
                magicPen.clone('html').video('foo.mkv', { width: 10, height: 20 }).toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><video src="foo.mkv" title="foo.mkv" style="max-width: 6em; max-width: 10ch; max-height: 20em"></video></div>\n' +
                '</div>'
            );
        });

        it('should render audio via the audio style with an options object that has width and height', function () {
            expect(
                magicPen.clone('html').audio('foo.aiff', { width: 10, height: 20 }).toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><audio src="foo.aiff" title="foo.aiff" style="max-width: 6em; max-width: 10ch; max-height: 20em"></audio></div>\n' +
                '</div>'
            );
        });

        describe('with Blob and URL.createObjectURL available', function () {
            var originalBlob = global.Blob,
                originalURL = global.URL;
            beforeEach(function () {
                global.Blob = sinon.spy(function (data, contentType) {
                    this.data = data;
                    this.contentType = contentType;
                });

                global.URL = {
                    createObjectURL: sinon.spy(function () {
                        return 'blob:foobarquux';
                    })
                };
            });

            afterEach(function () {
                global.Blob = originalBlob;
                global.URL = originalURL;
            });

            it('should render an image given as a Uint8Array as a blob: url', function () {
                expect(
                    magicPen.clone('html').media(new Uint8Array([1, 2, 3]), 'image/png').toString(),
                    'to equal',
                    '<div style="font-family: monospace; white-space: nowrap">\n' +
                    '  <div><img src="blob:foobarquux"></div>\n' +
                    '</div>'
                );
                expect(global.Blob, 'was called once');
                expect(global.Blob, 'was called with new');
                expect(global.URL.createObjectURL, 'was called once');
                expect(global.URL.createObjectURL, 'was always called with', new global.Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' }));
            });

            it('should render an image given as a Buffer as a blob: url', function () {
                expect(
                    magicPen.clone('html').media(new Uint8Array([1, 2, 3]), 'image/png').toString(),
                    'to equal',
                    '<div style="font-family: monospace; white-space: nowrap">\n' +
                    '  <div><img src="blob:foobarquux"></div>\n' +
                    '</div>'
                );
                expect(global.Blob, 'was called once');
                expect(global.Blob, 'was called with new');
                expect(global.URL.createObjectURL, 'was called once');
                expect(global.URL.createObjectURL, 'was always called with', new global.Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' }));
            });
        });

        describe('with Blob and URL.createObjectURL unavailable', function () {
            var originalBlob = global.Blob,
                originalURL = global.URL;
            beforeEach(function () {
                global.Blob = undefined;
                global.URL = undefined;
            });

            afterEach(function () {
                global.Blob = originalBlob;
                global.URL = originalURL;
            });

            it('should render an image given as a Uint8Array as a data: url', function () {
                expect(
                    magicPen.clone('html').media(new Uint8Array([1, 2, 3]), 'image/png').toString(),
                    'to equal',
                    '<div style="font-family: monospace; white-space: nowrap">\n' +
                    '  <div><img src="data:image/png;base64,AQID"></div>\n' +
                    '</div>'
                );
            });

            it('should render an image given as a Buffer as a data: url', function () {
                expect(
                    magicPen.clone('html').media(new Buffer([1, 2, 3]), 'image/png').toString(),
                    'to equal',
                    '<div style="font-family: monospace; white-space: nowrap">\n' +
                    '  <div><img src="data:image/png;base64,AQID"></div>\n' +
                    '</div>'
                );
            });

            describe('and btoa available', function () {
                var originalBtoa = global.Blob;
                beforeEach(function () {
                    global.btoa = sinon.spy(function (obj) {
                        return new Buffer(obj).toString('base64');
                    });
                });

                afterEach(function () {
                    global.btoa = originalBtoa;
                });

                it('should use btoa when building a data: url', function () {
                    expect(
                        magicPen.clone('html').media(new Uint8Array([1, 2, 3]), 'image/png').toString(),
                        'to equal',
                        '<div style="font-family: monospace; white-space: nowrap">\n' +
                        '  <div><img src="data:image/png;base64,AQID"></div>\n' +
                        '</div>'
                    );
                    expect(global.btoa, 'was called once');
                });
            });
        });
    });

    describe('in text mode', function () {
        describe('#media', function () {
            it('should render an image given as a path and no Content-Type as-is with "media" in parentheses', function () {
                expect(magicPen.clone('text').media('foo/bar.jpg').toString(), 'to equal', 'foo/bar.jpg (media)');
            });

            it('should render an image given as a path and a Content-Type of "image" as-is with "image" in parentheses', function () {
                expect(magicPen.clone('text').media('foo/bar.jpg', 'image').toString(), 'to equal', 'foo/bar.jpg (image)');
            });

            it('should accept the contentType property in the options object', function () {
                expect(magicPen.clone('text').media('foo/bar.jpg', { contentType: 'image' }).toString(), 'to equal', 'foo/bar.jpg (image)');
            });

            it('should render the file size when given a Buffer', function () {
                expect(magicPen.clone('text').media(new Buffer([1, 2, 3]), { contentType: 'image' }).toString(), 'to equal', 'Buffer[3] (image)');
            });
        });

        describe('#image', function () {
            it('should render an image given as a path and no Content-Type as-is with "image" in parentheses when the image style is used', function () {
                expect(magicPen.clone('text').image('foo/bar.jpg').toString(), 'to equal', 'foo/bar.jpg (image)');
            });

            it('should accept the content type as the second parameter', function () {
                expect(magicPen.clone('text').image('foo/bar.jpg', 'image/jpeg').toString(), 'to equal', 'foo/bar.jpg (image/jpeg)');
            });

            it('should accept the contentType property in the options object', function () {
                expect(magicPen.clone('text').image('foo/bar.jpg', { contentType: 'image/jpeg' }).toString(), 'to equal', 'foo/bar.jpg (image/jpeg)');
            });

            it('should render a data url', function () {
                expect(magicPen.clone('text').image('data:image/png,base64;AQID').toString(), 'to equal', 'data url (image/png)');
            });

            it('should prefer the Content-Type from the data: url over the one given in the options object', function () {
                expect(magicPen.clone('text').image('data:image/png,base64;AQID', { contentType: 'image/jpeg' }).toString(), 'to equal', 'data url (image/png)');
            });
        });

        describe('#audio', function () {
            it('should render an audio file given as a path and no Content-Type as-is with "audio" in parentheses when the audio style is used', function () {
                expect(magicPen.clone('text').audio('foo/bar.aiff').toString(), 'to equal', 'foo/bar.aiff (audio)');
            });

            it('should accept the content type as the second parameter', function () {
                expect(magicPen.clone('text').audio('foo/bar.aiff', 'audio/aiff').toString(), 'to equal', 'foo/bar.aiff (audio/aiff)');
            });

            it('should accept the contentType property in the options object', function () {
                expect(magicPen.clone('text').audio('foo/bar.aiff', { contentType: 'audio/aiff' }).toString(), 'to equal', 'foo/bar.aiff (audio/aiff)');
            });
        });

        describe('#video', function () {
            it('should render an video file given as a path and no Content-Type as-is with "video" in parentheses when the video style is used', function () {
                expect(magicPen.clone('text').video('foo/bar.mkv').toString(), 'to equal', 'foo/bar.mkv (video)');
            });

            it('should accept the contentType as the second parameter', function () {
                expect(magicPen.clone('text').video('foo/bar.mkv', 'video/x-matroska').toString(), 'to equal', 'foo/bar.mkv (video/x-matroska)');
            });

            it('should accept the contentType property in the options object', function () {
                expect(magicPen.clone('text').video('foo/bar.mkv', { contentType: 'video/x-matroska' }).toString(), 'to equal', 'foo/bar.mkv (video/x-matroska)');
            });
        });

        describe('with fallbackToDisc', function () {
            it('should write the contents of a data: url to a temporary file', function () {
                return expect(function () {
                    var text = magicPen.clone('text').image('data:image/png;base64,AQID', { fallbackToDisc: true }).toString();
                    expect(text, 'to match', /^\/tmp\/.* \(image\/png\)$/);
                    var fileName = text.split(' ')[0];

                    return expect(fileName, 'to be a path satisfying', {
                        isFile: true,
                        content: new Buffer([1, 2, 3])
                    });
                }, 'with fs mocked out', {
                    '/tmp': {}
                }, 'not to error');
            });

            it('should write the contents of a Uint8Array to a temporary file', function () {
                return expect(function () {
                    var text = magicPen.clone('text').image(new Uint8Array([1, 2, 3]), { fallbackToDisc: true }).toString();
                    expect(text, 'to match', /^\/tmp\/.* \(image\)$/);
                    var fileName = text.split(' ')[0];

                    return expect(fileName, 'to be a path satisfying', {
                        isFile: true,
                        content: new Buffer([1, 2, 3])
                    });
                }, 'with fs mocked out', {
                    '/tmp': {}
                }, 'not to error');
            });

            it('should write the contents of a Buffer to a temporary file', function () {
                return expect(function () {
                    var text = magicPen.clone('text').image(new Buffer([1, 2, 3]), { fallbackToDisc: true }).toString();
                    expect(text, 'to match', /^\/tmp\/.* \(image\)/);
                    var fileName = text.split(' ')[0];

                    return expect(fileName, 'to be a path satisfying', {
                        isFile: true,
                        content: new Buffer([1, 2, 3])
                    });
                }, 'with fs mocked out', {
                    '/tmp': {}
                }, 'not to error');
            });

            it('should use an explicitly provided file name when a data url is written to disc', function () {
                return expect(function () {
                    var fileName = getTemporaryFilePath({ suffix: '.foobar' });
                    expect(magicPen.clone('text').image('data:image/png;base64,MTIz', { fallbackToDisc: fileName }).toString(), 'to equal', fileName + ' (image/png)');

                    return expect(fileName, 'to be a path satisfying', {
                        isFile: true,
                        content: new Buffer('123')
                    });
                }, 'with fs mocked out', {
                    '/tmp': {}
                }, 'not to error');
            });

            it('should use an explicitly provided file name', function () {
                return expect(function () {
                    var fileName = getTemporaryFilePath({ suffix: '.foobar' });
                    expect(magicPen.clone('text').image(new Buffer([1, 2, 3]), { fallbackToDisc: fileName }).toString(), 'to equal', fileName + ' (image)');

                    return expect(fileName, 'to be a path satisfying', {
                        isFile: true,
                        content: new Buffer([1, 2, 3])
                    });
                }, 'with fs mocked out', {
                    '/tmp': {}
                }, 'not to error');
            });
        });
    });
});
