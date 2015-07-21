'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Users = require('repositories/users');
var User = require('models/user');
var controller = new Foxx.Controller(applicationContext);

var userIdSchema = joi.string().required()
.description('The id of the user')
.meta({allowMultiple: false});

var users = new Users(
  applicationContext.collection('users'),
  {model: User}
);

/** Lists of all users.
 *
 * This function simply returns the list of all User.
 */
controller.get('/', function (req, res) {
  res.json(_.map(users.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new user.
 *
 * Creates a new user. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var user = req.parameters.user;
  res.json(users.save(user).forClient());
})
.bodyParam('user', {
  description: 'The user you want to create',
  type: User
});

/** Reads a user.
 *
 * Reads a user.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(users.byId(id).forClient());
})
.pathParam('id', userIdSchema)
.errorResponse(ArangoError, 404, 'The user could not be found');

/** Replaces a user.
 *
 * Changes a user. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var user = req.parameters.user;
  res.json(users.replaceById(id, user));
})
.pathParam('id', userIdSchema)
.bodyParam('user', {
  description: 'The user you want your old one to be replaced with',
  type: User
})
.errorResponse(ArangoError, 404, 'The user could not be found');

/** Updates a user.
 *
 * Changes a user. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(users.updateById(id, patchData));
})
.pathParam('id', userIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your user to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The user could not be found');

/** Removes a user.
 *
 * Removes a user.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  users.removeById(id);
  res.json({success: true});
})
.pathParam('id', userIdSchema)
.errorResponse(ArangoError, 404, 'The user could not be found');

