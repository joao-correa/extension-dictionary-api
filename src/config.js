require('dotenv').config();

const {
  CONNECTION_STRING,
  YANDEX_API_KEY,
  YANDEX_BASE_URL,
} = process.env;

module.exports = {
  connectionString: CONNECTION_STRING,
  yandexApiKey: YANDEX_API_KEY,
  yandexBaseUrl: YANDEX_BASE_URL,
};
