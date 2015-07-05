/*global URL, Blob, btoa*/
function sanitizeContentType(contentType) {
    return contentType && contentType.trim().replace(/\s*;.*$/, ''); // Strip charset etc.
}

module.exports = {
    name: 'magicpen-media',
    installInto: function (magicPen) {
        magicPen.addStyle('media', function (media, contentType) {
            var majorContentType;
            if (typeof contentType === 'string') {
                majorContentType = contentType.replace(/\/.*/, '');
            }

            this.raw({
                html: {
                    // TODO: Allow specifying these:
                    width: 0,
                    height: 0,
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
                        if (!majorContentType || majorContentType === 'image') {
                            return '<img src="' + src + '">';
                        } else {
                            return '<' + majorContentType + ' src="' + src + '"></' + majorContentType + '>';
                        }
                    }
                },
                fallback: function () {
                    this.text((contentType || 'media') + ':' + String(media));
                }
            });
        });

        magicPen.addStyle('image', function (image, contentType) {
            this.media(image, contentType || 'image');
        });

        magicPen.addStyle('audio', function (audio, contentType) {
            this.media(audio, contentType || 'audio');
        });

        magicPen.addStyle('video', function (video, contentType) {
            this.media(video, contentType || 'video');
        });
    }
};
