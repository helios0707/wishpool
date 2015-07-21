'use strict';
var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

module.exports = Foxx.Model.extend({
  schema: {
    // Describe the attributes with joi here
    _key: joi.string().required(),    
    firstname: joi.string().required(),    
    lastname: joi.string().required(),    
    email: joi.string().required(),
    password: joi.string().required()
  }
});