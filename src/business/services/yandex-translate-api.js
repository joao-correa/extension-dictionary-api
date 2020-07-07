const https = require('https');
const CONFIGS = require('../../config');

const yandex = (() => {
  function fetchTranslate(info) {
    return new Promise(((resolve) => {
      const fullUrl = `${CONFIGS.yandexBaseUrl}lookup?key=${CONFIGS.yandexApiKey}&lang=${info.lang}&text=${info.text}`;
      https.get(fullUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve(JSON.parse(data));
        });
      });
    }));
  }

  function fetchLangs() {
    return new Promise(((resolve) => {
      const fullUrl = `${CONFIGS.yandexBaseUrl}getLangs?key=${CONFIGS.yandexApiKey}`;
      https.get(fullUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve(JSON.parse(data));
        });
      });
    }));
  }

  return {
    getTranslation: (info) => fetchTranslate(info),
    getLangs: () => fetchLangs(),
  };
})();

module.exports = yandex;
