/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    date: {
      type: 'string',
      // columnType: 'date',
      required: true,
      description: 'Date of submission.'
    },

    treatment_from: {
      type: 'string',
      // columnType: 'date',
      required: true,
      description: 'Start of the treatment.'
    },

    treatment_to: {
      type: 'string',
      // columnType: 'date',
      required: true,
      description: 'End of the treatment.'
    },

    hospital_clinic: {
      type: 'string',
      required: true,
      description: 'Name of the hospital or the clinic.'
    },

    description: {
      type: 'string',
      required: true,
      description: 'Description of what happened'
    },

    invoice_total: {
      type: 'number',
      required: true,
      description: 'Total money to be payed.'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    owner_id: {
      model: 'owner'
    },

    vet_id: {
      model: 'vet'
    },

    report_id: {
      model: 'report'
    },

    state_id: {
      model: 'claimstate'
    },

    insurance_id: {
      model: 'insurance',
    },

    action_codes: {
      collection: 'actioncode',
      via: 'insurace_claims'
    }

  },


};
