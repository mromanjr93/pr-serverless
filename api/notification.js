const AWS = require('aws-sdk');

const db = require('../db/connection');
const parser = require('../config/parse-event');
const handler = require('../config/handler-response');
'use strict';

module.exports.send = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let response = {};
  const body = parser.extractBody(event);

  const newsletterDevices = await db.NewsletterDevice.findAll({
    where: {
      newsletterId: body.newsletterId
    },
    include: [
      db.Device
    ]
  });

  const sns = new AWS.SNS({ region: 'us-east-1', accessKeyId: 'AKIAJPXFYJACKFES6T5Q', secretAccessKey: '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' });
  const platformApp = await sns.createPlatformApplication({
    Name: 'AppPushNotification',
    Platform: 'GCM',
    Attributes: {
      PlatformCredential: 'AAAAftHMDXs:APA91bHqZFgTFNDNNOf5BGRtEp7yn_gu0bQ-96s8lSWXfXeYLkrHFiZ_M2MK_dOa1_tT9lCL7ey-xhCIHE-u9_p0xs_oCh5FOfUvkLjIcKNkICDZyIjqM_T5xncBcyMtSgjSnVL0TfsF'
    }
  }).promise();

  if (!platformApp.PlatformApplicationArn) {
    response.statusCode = 400;
    return handler.response(callback, response);
  }

  for (let newsletterDevice of newsletterDevices) {
    for (let device of newsletterDevice.Devices) {
      const endpoint = await preparePlatformEndpoint(sns, device.token, platformApp.PlatformApplicationArn);

      if (!endpoint.EndpointArn) {
        response.message = 'Error EndpointArn';
        response.statusCode = 400;
        return handler.response(callback, response);
      }


      let payload = {
        'GCM': JSON.stringify({
          notification: {
            title: body.title,
            text: body.text
          }
        })
      }

      payload = JSON.stringify(payload);

      await publishPushNotification(sns, payload, endpoint.EndpointArn);
    }
  }



  response.devices = newsletterDevices;
  response.message = 'Push enviado com sucesso';
  return handler.response(callback, response);
};

async function preparePlatformEndpoint(sns, token, platformApplicationArn) {
  return await sns.createPlatformEndpoint({
    PlatformApplicationArn: platformApplicationArn,
    Token: token,
    Attributes: {
      Enabled: 'true'
    }
  }).promise();
}


async function publishPushNotification(sns, payload, endpointArn) {
  return await sns.publish({
    Message: payload,
    MessageStructure: 'json',
    TargetArn: endpointArn
  }).promise();
}