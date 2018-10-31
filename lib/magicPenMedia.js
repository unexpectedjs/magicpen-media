/*global URL, Blob, btoa*/
const _ = require('lodash');
const fs = require('fs');
const pathModule = require('path');
const mime = require('mime');
const getTemporaryFilePath = require('gettemporaryfilepath');

function sanitizeContentType(contentType) {
  return contentType && contentType.trim().replace(/\s*;.*$/, ''); // Strip charset etc.
}

function entitify(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

module.exports = {
  name: 'magicpen-media',
  version: require('../package.json').version,
  installInto(magicPen) {
    magicPen.addStyle('media', function(media, options) {
      if (typeof options === 'string') {
        options = { contentType: options };
      } else {
        options = options || {};
      }

      let contentType = options.contentType;
      const majorContentType =
        typeof contentType === 'string' && contentType.replace(/\/.*/, '');
      const width = options.width || 0;
      const height = options.height || 0;
      const alt = options.alt;
      let title = options.title;
      const fallbackToDisc = options.fallbackToDisc;

      if (
        typeof media === 'string' &&
        !/data:/.test(media) &&
        (typeof contentType === 'undefined' || contentType.indexOf('/') === -1)
      ) {
        const extension = pathModule.extname(media);
        if (extension) {
          contentType =
            mime.getType(extension.replace(/^\./, '')) || contentType;
        }
      }

      this.alt({
        html: {
          width,
          height,
          content() {
            let src;
            if (typeof media === 'string') {
              src = media;
              if (!/^data:/.test(media)) {
                if (typeof title === 'undefined') {
                  title = media;
                }
              }
            } else if (
              typeof URL !== 'undefined' &&
              typeof URL.createObjectURL === 'function' &&
              typeof Blob !== 'undefined'
            ) {
              src = URL.createObjectURL(
                new Blob([media], { type: sanitizeContentType(contentType) })
              );
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

            const attributes = ['src="' + entitify(src) + '"'];

            if (typeof alt !== 'undefined') {
              attributes.push('alt="' + entitify(String(alt)) + '"');
            }
            if (typeof title !== 'undefined') {
              attributes.push('title="' + entitify(String(title)) + '"');
            }

            const styleProperties = [];
            if (width) {
              styleProperties.push(
                'max-width: ' + 0.6 * width + 'em',
                'max-width: ' + width + 'ch'
              );
            }
            if (height) {
              styleProperties.push('max-height: ' + height + 'em');
            }
            if (styleProperties.length) {
              attributes.push(
                'style="' + entitify(styleProperties.join('; ')) + '"'
              );
            }

            const attributeStr = attributes.length
              ? ' ' + attributes.join(' ')
              : '';
            let html = '';
            if (options.link) {
              html +=
                '<a href="' +
                entitify(options.link === true ? src : options.link) +
                '">';
            }
            if (!majorContentType || majorContentType === 'image') {
              html += '<img' + attributeStr + '>';
            } else {
              html +=
                '<' +
                majorContentType +
                attributeStr +
                '></' +
                majorContentType +
                '>';
            }
            if (options.link) {
              html += '</a>';
            }
            return html;
          }
        },
        fallback() {
          function writeToDisc(data) {
            if (data.constructor.name === 'Uint8Array') {
              data = new Buffer(data);
            }
            let fileName;
            if (typeof fallbackToDisc === 'string') {
              fileName = fallbackToDisc;
            } else {
              fileName = getTemporaryFilePath({
                suffix:
                  '.' +
                  (mime.getExtension(contentType) || majorContentType || 'data')
              });
            }
            fs.writeFileSync(fileName, data);
            return fileName;
          }

          if (typeof media === 'string') {
            const matchDataUrl = media.match(
              /^data:([\w+.-]+\/[\w+.-]+)?(?:;charset=([\w/-]+))?(;base64)?,([ -\x7f]*)$/
            );
            if (matchDataUrl) {
              contentType = matchDataUrl[1] || contentType || 'text/plain';
              if (
                matchDataUrl[3] &&
                options.fallbackToDisc &&
                fs.writeFileSync
              ) {
                this.text(
                  writeToDisc(new Buffer(matchDataUrl[4], 'base64')) +
                    ' (' +
                    contentType +
                    ')'
                );
              } else {
                this.text('data url (' + contentType + ')');
              }
            } else {
              this.text(media + ' (' + (contentType || 'media') + ')');
            }
          } else {
            // Uint8Array or Buffer

            if (options.fallbackToDisc && fs.writeFileSync) {
              this.text(writeToDisc(media) + ' (' + contentType + ')');
            } else {
              this.text(
                media.constructor.name +
                  '[' +
                  media.length +
                  '] (' +
                  (contentType || 'media') +
                  ')'
              );
            }
          }
        }
      });
    });

    magicPen.addStyle('image', function(image, options) {
      if (typeof options === 'string') {
        options = { contentType: options };
      } else {
        options = options || {};
      }
      this.media(image, _.extend({ contentType: 'image' }, options));
    });

    magicPen.addStyle('audio', function(audio, options) {
      if (typeof options === 'string') {
        options = { contentType: options };
      } else {
        options = options || {};
      }
      this.media(audio, _.extend({ contentType: 'audio' }, options));
    });

    magicPen.addStyle('video', function(video, options) {
      if (typeof options === 'string') {
        options = { contentType: options };
      } else {
        options = options || {};
      }
      this.media(video, _.extend({ contentType: 'video' }, options));
    });
  }
};
