'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Activities = require('repositories/activities');
var Activity = require('models/activity');
var controller = new Foxx.Controller(applicationContext);

var activityIdSchema = joi.string().required()
.description('The id of the activity')
.meta({allowMultiple: false});

var activities = new Activities(
  applicationContext.collection('activities'),
  {model: Activity}
);

/** Lists of all activities.
 *
 * This function simply returns the list of all Activity.
 */
controller.get('/', function (req, res) {
  res.json(_.map(activities.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new activity.
 *
 * Creates a new activity. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var activity = req.parameters.activity;
  res.json(activities.save(activity).forClient());
})
.bodyParam('activity', {
  description: 'The activity you want to create',
  type: Activity
});

/** Reads a activity.
 *
 * Reads a activity.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(activities.byId(id).forClient());
})
.pathParam('id', activityIdSchema)
.errorResponse(ArangoError, 404, 'The activity could not be found');

/** Replaces a activity.
 *
 * Changes a activity. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var activity = req.parameters.activity;
  res.json(activities.replaceById(id, activity));
})
.pathParam('id', activityIdSchema)
.bodyParam('activity', {
  description: 'The activity you want your old one to be replaced with',
  type: Activity
})
.errorResponse(ArangoError, 404, 'The activity could not be found');

/** Updates a activity.
 *
 * Changes a activity. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(activities.updateById(id, patchData));
})
.pathParam('id', activityIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your activity to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The activity could not be found');

/** Removes a activity.
 *
 * Removes a activity.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  activities.removeById(id);
  res.json({success: true});
})
.pathParam('id', activityIdSchema)
.errorResponse(ArangoError, 404, 'The activity could not be found');

