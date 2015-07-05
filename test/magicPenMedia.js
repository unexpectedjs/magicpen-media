/*global describe, it, beforeEach, afterEach, global, Uint8Array*/
var MagicPen = require('magicpen'),
    magicPen = new MagicPen().installPlugin(require('../lib/magicPenMedia')),
    sinon = require('sinon'),
    expect = require('unexpected').clone().installPlugin(require('unexpected-sinon'));

describe('magicpen-media', function () {
    describe('in HTML mode', function () {
        it('should render an image given as a path', function () {
            expect(
                magicPen.clone('html').media('foo/bar.jpg').toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><img src="foo/bar.jpg"></div>\n' +
                '</div>'
            );
        });

        it('should entitify the src attribute properly', function () {
            expect(
                magicPen.clone('html').media('foo&bar".jpg').toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><img src="foo&amp;bar&quot;.jpg"></div>\n' +
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
                '  <div><img style="max-width: 6em; max-width: 10ch; max-height: 20em" src="foo/bar.jpg"></div>\n' +
                '</div>'
            );
        });

        it('should render a video via the video style with an options object that has width and height', function () {
            expect(
                magicPen.clone('html').video('foo.mkv', { width: 10, height: 20 }).toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><video style="max-width: 6em; max-width: 10ch; max-height: 20em" src="foo.mkv"></video></div>\n' +
                '</div>'
            );
        });

        it('should render audio via the audio style with an options object that has width and height', function () {
            expect(
                magicPen.clone('html').audio('foo.aiff', { width: 10, height: 20 }).toString(),
                'to equal',
                '<div style="font-family: monospace; white-space: nowrap">\n' +
                '  <div><audio style="max-width: 6em; max-width: 10ch; max-height: 20em" src="foo.aiff"></audio></div>\n' +
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
            it('should render an image given as a path and no Content-Type as-is with a media: prefix', function () {
                expect(magicPen.clone('text').media('foo/bar.jpg').toString(), 'to equal', 'media:foo/bar.jpg');
            });

            it('should render an image given as a path and a Content-Type of "image" as-is with an image: prefix', function () {
                expect(magicPen.clone('text').media('foo/bar.jpg', 'image').toString(), 'to equal', 'image:foo/bar.jpg');
            });

            it('should accept the contentType property in the options object', function () {
                expect(magicPen.clone('text').media('foo/bar.jpg', { contentType: 'image' }).toString(), 'to equal', 'image:foo/bar.jpg');
            });

            it('should render the file size when given a Buffer', function () {
                expect(magicPen.clone('text').media(new Buffer([1, 2, 3]), { contentType: 'image' }).toString(), 'to equal', 'image:Buffer(3)');
            });
        });

        describe('#image', function () {
            it('should render an image given as a path and no Content-Type as-is with an image: prefix when the image style is used', function () {
                expect(magicPen.clone('text').image('foo/bar.jpg').toString(), 'to equal', 'image:foo/bar.jpg');
            });

            it('should accept the content type as the second parameter', function () {
                expect(magicPen.clone('text').image('foo/bar.jpg', 'image/jpeg').toString(), 'to equal', 'image/jpeg:foo/bar.jpg');
            });

            it('should accept the contentType property in the options object', function () {
                expect(magicPen.clone('text').image('foo/bar.jpg', { contentType: 'image/jpeg' }).toString(), 'to equal', 'image/jpeg:foo/bar.jpg');
            });
        });

        describe('#audio', function () {
            it('should render an audio file given as a path and no Content-Type as-is with an audio: prefix when the audio style is used', function () {
                expect(magicPen.clone('text').audio('foo/bar.aiff').toString(), 'to equal', 'audio:foo/bar.aiff');
            });

            it('should accept the content type as the second parameter', function () {
                expect(magicPen.clone('text').audio('foo/bar.aiff', 'audio/aiff').toString(), 'to equal', 'audio/aiff:foo/bar.aiff');
            });

            it('should accept the contentType property in the options object', function () {
                expect(magicPen.clone('text').audio('foo/bar.aiff', { contentType: 'audio/aiff' }).toString(), 'to equal', 'audio/aiff:foo/bar.aiff');
            });
        });

        describe('#video', function () {
            it('should render an video file given as a path and no Content-Type as-is with an video: prefix when the video style is used', function () {
                expect(magicPen.clone('text').video('foo/bar.mkv').toString(), 'to equal', 'video:foo/bar.mkv');
            });

            it('should accept the contentType as the second parameter', function () {
                expect(magicPen.clone('text').video('foo/bar.mkv', 'video/x-matroska').toString(), 'to equal', 'video/x-matroska:foo/bar.mkv');
            });

            it('should accept the contentType property in the options object', function () {
                expect(magicPen.clone('text').video('foo/bar.mkv', { contentType: 'video/x-matroska' }).toString(), 'to equal', 'video/x-matroska:foo/bar.mkv');
            });
        });
    });
});
