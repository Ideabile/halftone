const render = require('./../packages/news-render');
const scraper = require('./../packages/scraper');
const newsProviders = require('./../packages/news-providers');
const createPrint = require('./../packages/printful-products');
const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');
const axios = require('axios');
const today = new Date().toISOString().split('T')[0].replace(/-/g,'');
const basePath = path.resolve(
    __dirname,
    '../news',
    today
);
const FormData = require('form-data');

const defaultProviders = Object.keys(newsProviders).map(provider => ({
    provider: provider.toLowerCase(),
    ...newsProviders[provider]
}));

scraper(defaultProviders)
    .then(images => {
        return Promise.all(
            render(images)
        );
    })
    .then(async (images) => {

        return images.map(async (i) => {
            const formData = new FormData();
            const image = Buffer.from(i.image, 'utf8');

            formData.append('upload', image, {
                filename: `${i.provider}.svg`, // ... or:
                filepath: `${i.provider}.svg`,
                contentType: 'image/svg+xml',
            });

            try {
                const { data } = await axios.post(
                    'http://api.halftone.localhost/article/image',
                    formData,
                    {
                        headers: {
                            ...formData.getHeaders(),
                            "Content-Length": formData.getLengthSync(),
                        }
                    },
                );

                return {
                    ...i,
                    title: i.message,
                    image: data.key,
                };
            } catch(e) {
                console.log('Error in uploading an imnage', i.provider);
                return null;
            }
        });

    }).then(async images => {
            images.forEach(async (image) => {

                image = await image;

                if (!image) return;

                try {
                    await axios({
                        method: 'post',
                        url: 'http://api.halftone.localhost/article',
                        data: image,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (e) {
                    console.log(e.message, e.response.data.message);
                }

            });
    });


