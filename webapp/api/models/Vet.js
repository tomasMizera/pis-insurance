/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  getAll: async function() {
    return await Vet.find();
  },

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'mary.sue@example.com'
    },

    password: {
      type: 'string',
      required: true,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },

    first_name: {
      type: 'string',
      required: true,
      description: 'Full representation of the user\'s first name.',
      maxLength: 120,
      example: 'Mary'
    },

    last_name: {
      type: 'string',
      required: true,
      description: 'Full representation of the user\'s last name.',
      maxLength: 120,
      example: 'Sue van der McHenst'
    },

    address: {
      type: 'string',
      required: true,
      description: 'Address',
      example: 'J.Hollého 13, 94110 Tvrdošovce Slovakia'
    },

    phone_number: {
      type: 'string',
      required: true,
      description: 'Phone number',
      example: '0944 969 238'
    },

    bank_account: {
      type: 'string',
      required: false,
      description: 'IBAN of the bank account',
      example: 'SK2716998193778922622234'
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    insurace_claims: {
      collection: 'insuranceclaim',
      via: 'vet_id'
    }

  },


};
