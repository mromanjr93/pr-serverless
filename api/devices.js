const AWS = require('aws-sdk');

const db = require('../db/connection');

const handler = require('../config/handler-response');
const parser = require('../config/parse-event');
const validator = require('../validations/device-validation');

'use strict';

module.exports.add = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  let response = {};

  const body = parser.extractBody(event);

  const valid = validator.validate(body);
  if (!valid.valid) {
    response.validation = valid;
    response.statusCode = 400;
    return handler.response(callback, response);
  }

  const insertedData = await db.Device.create({
    token: body.token,
    os: body.os
  });

  const device = insertedData.toJSON();

  if (device.deviceId) {
    let newsletterDevices = [];
    body.newsletters.forEach(newsletter => {
      newsletterDevices.push({
        deviceId : device.deviceId,
        newsletterId: newsletter
      });
    });

    await db.NewsletterDevice.bulkCreate(newsletterDevices);
  }

  response.device = device;
  response.message = 'Device succesfully inserted';
  return handler.response(callback, response);
};

module.exports.list = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  let response = {};

  const params = parser.extractParams(event);

  const devices = await db.Device.findAll();

  response.devices = devices;
  response.params = params;
  return handler.response(callback, response);
};

module.exports.get = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  let response = {};

  const devices = await db.Device.findOne();

  response.devices = devices;
  return handler.response(callback, response);
};

module.exports.update = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  let response = {};

  const devices = await db.Device.findAll();

  response.devices = devices;
  return handler.response(callback, response);
};


module.exports.delete = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  let response = {};

  const devices = await db.Device.findAll();

  response.devices = devices;
  return handler.response(callback, response);
};

