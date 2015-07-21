'use strict';
var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

module.exports = Foxx.Model.extend({
  schema: {
    // Describe the attributes with joi here
    _key: joi.string().optional(),
    no: joi.string().required(),
    name: joi.string().required(),
    aboutUs: joi.array(),
    links: joi.array()
  }
});