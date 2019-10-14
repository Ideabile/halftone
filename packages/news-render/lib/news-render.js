const renderer = require('vue-server-renderer').createRenderer();
const halfTone = require('component-halftone-circle');
const Vue = require('vue');
const https = require('https');
const fs = require('fs');
const sharp = require('sharp');
const getPixels = require("get-pixels");
const scraper = require('scraper');

const newsProviders = require('news-providers');
const defaultOptions = {
    type: 'svg',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    size: {
        width: 100,
        height: 100
    }
};

module.exports = (images) => images.map(({provider, img, title, link, options }) => new Promise((resolve, reject) => {
    options = Object.assign({}, defaultOptions, options);

    getPixels(img, (err, pixels) => {

        try {
        sharp(pixels.data, {raw: {width: pixels.shape[0], height: pixels.shape[1], channels: pixels.shape[2]}})
            .resize(options.size.width, options.size.height, {
                fit: 'contain',
                position: sharp.strategy.entropy,
                background: options.background,
            })
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(({data, info}) => {

                const props = {
                    img: {
                        width: info.width,
                        height: info.height,
                        data
                    }
                };

                halfTone.propsData = props;

                renderer.renderToString(new Vue(halfTone)).then(html => {

                    if (options.type === 'svg') {
                        resolve({image: html, type: options.type, title, link, provider});
                        return;
                    }

                    if (options.type === 'png') {
                        sharp(Buffer.from(html))
                            .flatten({ background: options.background }).png()
                            .toBuffer()
                            .then(data => resolve({image: data, type: options.type, title, link, provider}));
                    }

                }).catch(reject);
            });
        }catch(e) {
            console.log('Error parsing image', provider);
        }
    });

}));
