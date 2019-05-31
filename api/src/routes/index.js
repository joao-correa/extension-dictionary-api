let express, router;

express = require("express");
router = express.Router();

router.get( "/" , ( req, res, next ) => {
    res.status(200).send({
        title : "Node API - Dictionary",
        version : "1.0.0"
    })
} );

module.exports = router;