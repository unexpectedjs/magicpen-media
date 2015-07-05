/*global describe, it*/
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
                '</div>');
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
        });
    });

    describe('in text mode', function () {
        it('should render an image given as a path and no Content-Type as-is with a media: prefix', function () {
            expect(magicPen.clone('text').media('foo/bar.jpg').toString(), 'to equal', 'media:foo/bar.jpg');
        });

        it('should render an image given as a path and a Content-Type of "image" as-is with an image: prefix', function () {
            expect(magicPen.clone('text').media('foo/bar.jpg', 'image').toString(), 'to equal', 'image:foo/bar.jpg');
        });

        it('should render an image given as a path and no Content-Type as-is with an image: prefix when the image style is used', function () {
            expect(magicPen.clone('text').image('foo/bar.jpg').toString(), 'to equal', 'image:foo/bar.jpg');
        });

        it('should render an audio file given as a path and no Content-Type as-is with an audio: prefix when the audio style is used', function () {
            expect(magicPen.clone('text').audio('foo/bar.aiff').toString(), 'to equal', 'audio:foo/bar.aiff');
        });

        it('should render an video file given as a path and no Content-Type as-is with an video: prefix when the video style is used', function () {
            expect(magicPen.clone('text').video('foo/bar.mkv').toString(), 'to equal', 'video:foo/bar.mkv');
        });
    });
});
