/**
* User.js
*
* A user who can log in to this application.
*/

module.exports = {

  getDetailOf: async function(_id) {
    let entry = await InsuranceClaim.findOne({id: _id});
    if (!entry) {
      throw new Error('no such entry in db');
    }

    return entry;
  },

  updateEntry: async function(_id, _key, _value) {
    let oBj = {};
    oBj[_key] = _value;

    let updatedEntry = await InsuranceClaim.update({id: _id}, oBj).fetch();

    if (!updatedEntry) {
      throw new Error('Update unsuccessfull!');
    }
    return updatedEntry;
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
    
    actionCodes: {
      collection: 'actioncode',
      via: 'insuranceClaims'
    }
  },
  
};
