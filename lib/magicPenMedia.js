/*global URL, Blob, btoa*/
var _ = require('lodash');

function sanitizeContentType(contentType) {
    return contentType && contentType.trim().replace(/\s*;.*$/, ''); // Strip charset etc.
}

function entitify(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

module.exports = {
    name: 'magicpen-media',
    installInto: function (magicPen) {
        magicPen.addStyle('media', function (media, options) {
            if (typeof options === 'string') {
                options = { contentType: options };
            } else {
                options = options || {};
            }

            var contentType = options.contentType;
            var majorContentType = typeof contentType === 'string' && contentType.replace(/\/.*/, '');
            var width = options.width || 0;
            var height = options.height || 0;

            this.alt({
                html: {
                    width: width,
                    height: height,
                    content: function () {
                        var src;
                        if (typeof media === 'string') {
                            src = media;
                        } else if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function' && typeof Blob !== 'undefined') {
                            src = URL.createObjectURL(new Blob([media], { type: sanitizeContentType(contentType) }));
                        } else {
                            src = 'data:' + sanitizeContentType(contentType) + ';base64,';
                            if (Buffer.isBuffer(media)) {
                                src += media.toString('base64');
                            } else if (typeof btoa === 'function') {
                                src += btoa(media);
                            } else {
                                src += new Buffer(media).toString('base64');
                            }
                        }

                        var attributes = [ 'src="' + entitify(src) + '"' ];

                        var styleProperties = [];
                        if (width) {
                            styleProperties.push('max-width: ' + (0.6 * width) + 'em', 'max-width: ' + width + 'ch');
                        }
                        if (height) {
                            styleProperties.push('max-height: ' + height + 'em');
                        }
                        if (styleProperties.length) {
                            attributes.push('style="' + entitify(styleProperties.join('; ')) + '"');
                        }

                        var attributeStr = attributes.length ? ' ' + attributes.join(' ') : '';
                        if (!majorContentType || majorContentType === 'image') {
                            return '<img' + attributeStr + '>';
                        } else {
                            return '<' + majorContentType + attributeStr + '></' + majorContentType + '>';
                        }
                    }
                },
                fallback: function () {
                    var text;
                    if (typeof media === 'string') {
                        var matchDataUrl = media.match(/^data:([\w\-\+\.]+\/[\w\-\+\.]+)?(?:;charset=([\w\/\-]+))?(;base64)?,([\u0000-\u007f]*)$/);
                        if (matchDataUrl) {
                            text = 'data:' + matchDataUrl[1] || 'text/plain';
                        } else {
                            // path or non-data: url
                            text = media;
                        }
                    } else {
                        // Uint8Array or Buffer
                        text = media.constructor.name + '(' + media.length + ')';
                    }
                    this.text((contentType || 'media') + ':' + text);
                }
            });
        });

        magicPen.addStyle('image', function (image, options) {
            if (typeof options === 'string') {
                options = { contentType: options };
            } else {
                options = options || {};
            }
            this.media(image, _.extend({ contentType: 'image' }, options));
        });

        magicPen.addStyle('audio', function (audio, options) {
            if (typeof options === 'string') {
                options = { contentType: options };
            } else {
                options = options || {};
            }
            this.media(audio, _.extend({ contentType: 'audio' }, options));
        });

        magicPen.addStyle('video', function (video, options) {
            if (typeof options === 'string') {
                options = { contentType: options };
            } else {
                options = options || {};
            }
            this.media(video, _.extend({ contentType: 'video' }, options));
        });
    }
};
