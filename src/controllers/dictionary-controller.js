const service = require('../business/request');

exports.getTranslation = async (req, res) => {
  try {
    const results = await service.getTranslation(req);
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({
      message: 'Falha na requisicao',
      error,
    });
  }
};

exports.getLangs = async (req, res) => {
  try {
    const result = await service.getLangs(req);
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send({
      message: 'Falha na requisicao',
      error: e,
    });
  }
};
