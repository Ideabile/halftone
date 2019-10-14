'use strict';

const PROVIDERS = {
    INDIPENDENT: {
        url: 'https://www.independent.co.uk/',
        res: page => {
            return {
                link: `https://www.independent.co.uk/${page('.article-hero a').first().attr('href')}`,
                img: page('.article-hero amp-img').attr('src'),
                title: page('.article-hero a h2').first().text().trim()
            };
        }
    },

    EL_PAIS: {
        url: 'https://elpais.com/',
        res: page => {
            return {
                link: page('article h2 a').first().attr('href'),
                img: 'http:'+page('article img').first().attr('data-src'),
                title: page('article h2').first().text().trim()
            };
        }
    },

    THE_GUARDIAN: {
        url: 'https://www.theguardian.com/international',
        res: page => {
            return {
                link: page('#headlines h3 a').first().attr('href'),
                img: page('#headlines img').first().attr('src'),
                title: page('#headlines h3').first().text().trim()
            };
        }
    },
};

module.exports = PROVIDERS;
