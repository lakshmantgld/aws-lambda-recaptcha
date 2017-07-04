'use strict';

import config from './config.json';
const googleRecaptcha = require('google-recaptcha');

const captcha = new googleRecaptcha({
  secret: config.captchaSiteSecret
});

module.exports.recaptcha = (event, context, callback) => {

  let captchaResponse = event.body.captchaResponse;

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Captcha correct',
      input: event,
    }),
  };

  captcha.verify({response: captchaResponse}, (error) => {
    if (error) {
      callback(error);
    }

    callback(null, response);
  })
};
