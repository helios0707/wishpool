'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Groups = require('repositories/groups');
var Group = require('models/group');
var controller = new Foxx.Controller(applicationContext);

var groupIdSchema = joi.string().required()
.description('The id of the group')
.meta({allowMultiple: false});

var groups = new Groups(
  applicationContext.collection('groups'),
  {model: Group}
);

/** Lists of all groups.
 *
 * This function simply returns the list of all Group.
 */

controller.get('/', function (req, res) {
  res.json(_.map(groups.all(), function (model) {
    return model.forClient();
  }));
});


/** Creates a new group.
 *
 * Creates a new group. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var group = req.parameters.group;
  res.json(groups.save(group).forClient());
})
.bodyParam('group', {
  description: 'The group you want to create',
  type: Group
});

/** Reads a group.
 *
 * Reads a group.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(groups.byId(id).forClient());
})
.pathParam('id', groupIdSchema)
.errorResponse(ArangoError, 404, 'The group could not be found');

/** Replaces a group.
 *
 * Changes a group. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var group = req.parameters.group;
  res.json(groups.replaceById(id, group));
})
.pathParam('id', groupIdSchema)
.bodyParam('group', {
  description: 'The group you want your old one to be replaced with',
  type: Group
})
.errorResponse(ArangoError, 404, 'The group could not be found');

/** Updates a group.
 *
 * Changes a group. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(groups.updateById(id, patchData));
})
.pathParam('id', groupIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your group to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The group could not be found');

/** Removes a group.
 *
 * Removes a group.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  groups.removeById(id);
  res.json({success: true});
})
.pathParam('id', groupIdSchema)
.errorResponse(ArangoError, 404, 'The group could not be found');
