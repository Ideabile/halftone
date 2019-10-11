const axios = require('axios');
const cheerio = require('cheerio');

// encoding issue
// https://stackoverflow.com/questions/40211246/encoding-issue-with-axios
module.exports = (providers) => Promise.all(providers.map(site => {
    return axios.get(site.url)
        .catch(() => {
            console.log(site.url, 'Got an error');
        })
        .then(({data}) => {
            return site.res(
                cheerio.load(data, { decodeEntities: false })
            );
        }).then(res => Promise.resolve({
            ...res,
            ...site,
        })).catch(() => {
            console.log(site.url, 'Got an error');
        });
}));
