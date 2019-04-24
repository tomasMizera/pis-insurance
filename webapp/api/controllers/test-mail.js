/**
 * TestMailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const soapRequest = require('easy-soap-request');
const fs = require('fs');

module.exports = {


  friendlyName: 'Notify with email',


  description: 'Send email to a specific email address.',


  inputs: {

    emailAddress: {
      required: true,
      type: 'string',
      description: 'An email address where we can respond.',
      example: 'hermione@hogwarts.edu'
    },

    emailSubject: {
      required: true,
      type: 'string',
      description: 'The subject of the email.',
      example: 'Important message.'
    },

    emailText: {
      required: true,
      type: 'string',
      description: 'The text of the email.',
    },

  },


  exits: {

    success: {
      description: 'The message was sent successfully.'
    },

  },

  fn: async function(inputs) {
    const url = 'http://labss2.fiit.stuba.sk/pis/ws/NotificationServices/Email';

    const headers = {
      'user-agent': 'sampleTest',
      'Content-Type': 'text/xml;charset=UTF-8',
      'soapAction': 'http://labss2.fiit.stuba.sk/pis/ws/NotificationServices/Email#notify',
    };

    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://labss2.fiit.stuba.sk/pis/notificationservices/email/types">
                    <soapenv:Header/>
                    <soapenv:Body>
                      <typ:notify>
                        <team_id>092</team_id>
                        <password>rrnjEv</password>
                        <email>${inputs.emailAddress}</email>
                        <subject>${inputs.emailSubject}</subject>
                        <message>${inputs.emailText}</message>
                      </typ:notify>
                    </soapenv:Body>
                  </soapenv:Envelope>`;

      const { response } = await soapRequest(url, headers, xml, 1000);
      const { body, statusCode } = response;
      console.log(body);
    console.log(xml);
      console.log(statusCode);
  }

};
