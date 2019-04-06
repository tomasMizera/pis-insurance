/**
 * TestMailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const soapRequest = require('easy-soap-request');
var parser = require('fast-xml-parser');
const fs = require('fs');

module.exports = {

  friendlyName: 'Validate email',

  description: 'Validate a specific email address.',

  inputs: {

    emailAddress: {
      required: true,
      type: 'string',
      description: 'An email address where we can respond.',
      example: 'hermione@hogwarts.edu'
    },

  },

  exits: {

    success: {
      description: 'The email is valid.'
    },

    notValid: {
      description: 'Email invalid.'
    }

  },

  fn: async function(inputs) {
    const url = 'http://labss2.fiit.stuba.sk/pis/ws/Validator';

    const headers = {
      'user-agent': 'sampleTest',
      'Content-Type': 'text/xml;charset=UTF-8',
      'soapAction': 'http://labss2.fiit.stuba.sk/pis/ws/Validator#validateEmail',
    };

    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://labss2.fiit.stuba.sk/pis/validator/types">
                   <soapenv:Header/>
                   <soapenv:Body>
                      <typ:validateEmail>
                         <email>${inputs.emailAddress}</email>
                      </typ:validateEmail>
                   </soapenv:Body>
                </soapenv:Envelope>`;

    const { response } = await soapRequest(url, headers, xml, 1000);
    const { body, statusCode } = response;

    if( parser.validate(body) === true) { //optional (it'll return an object in case it's not valid)
      const jsonObj = parser.parse(body);
      const isValid = jsonObj['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:validateEmailResponse'].success;

      if (!isValid) {
        throw 'notValid';
      }
    }
  }

};
