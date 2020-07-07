const Request = require('../repositories/request-repository');
const User = require('../repositories/user-repository');
const Yandex = require('./services/yandex-translate-api');

const requestExport = (() => {
  async function createUser(host) {
    await User.create({
      host,
    });
  }

  async function createRequest(hostName) {
    let hostId = await User.findByHost(hostName);
    if (!hostId) {
      await createUser(hostName);
      (() => {
        const me = async () => {
          hostId = await User.findByHost(hostName);

          if (hostId || false) {
            Request.create({
              user: hostId._id,
            });
          } else {
            setTimeout(() => {
              me();
            }, 5000);
          }
        };
        me();
      })();
    } else {
      Request.create({
        user: hostId._id,
      });
    }
  }

  async function updateRequestDate(hostName) {
    const hostId = await User.findByHost(hostName);
    User.updateDate(hostId, Date.now);
  }

  return {
    getTranslation: (req) => {
      const hostIdentifier = req.headers['x-browser-identifier'] || '';

      if (hostIdentifier.length === 0) {
        throw new Error('host identifier not present');
      }

      createRequest(hostIdentifier);
      updateRequestDate(hostIdentifier);

      return Yandex.getTranslation(req.body);
    },
    getLangs: (req) => {
      const hostIdentifier = req.headers['x-browser-identifier'] || '';

      if (hostIdentifier.length === 0) {
        throw new Error('host identifier not present');
      }

      createRequest(hostIdentifier);
      updateRequestDate(hostIdentifier);

      return Yandex.getLangs();
    },
  };
})();

module.exports = requestExport;
