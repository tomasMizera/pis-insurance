/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  getDetailOf: async function(_id) {
    let entry = await InsuranceClaim.findOne({id: Number(_id)});
    if (!entry) {
      throw new Error('no such entry in db');
    }

    // let ownerData = await Owner.findOne({id: entry.owner_id}).populate('insurace_claims');
    // if (!ownerData) {
    //   throw new Error('no such entry in db');
    // }
    // console.log(ownerData);

    return entry;
  },

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
      description: 'Total money to be paid.'
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
