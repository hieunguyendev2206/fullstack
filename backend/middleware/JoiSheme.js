const Joi = require("joi");

exports.string = Joi.string().allow(null, "");
exports.stringReq = Joi.string().required();
exports.numberReq = Joi.number().required();
exports.number = Joi.string().allow(null, "");
exports.array = Joi.array().allow(null, "");
exports.arrayReq = Joi.array().required();
exports.binaryReq = Joi.binary().required();
exports.objectReq = Joi.object().required();
