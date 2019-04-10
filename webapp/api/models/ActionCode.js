/**
 * Owner.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  getValidActionCodes: function(_codes) {
    _codes = _codes.map(x => x.toUpperCase());
    aCodesFromDb = _codes.map(async (c) => await ActionCode.findOne({code:c}));
    return Promise.all(aCodesFromDb);
  },

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    code: {
      type: 'string',
      required: true,
      description: 'Action code.',
      unique: true,
      example: 'U123IO'
    },

    description: {
      type: 'string',
      required: true,
      description: 'What the code involves.',
      example: 'Vaccination against ebola.'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    insurances: {
      collection: 'insurance',
      via: 'action_codes'
    },

    insuranceClaims: {
      collection: 'insuranceclaim',
      via: 'actionCodes'
    }
  },
};
