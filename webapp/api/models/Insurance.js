/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  areCodesCoveredByInsurance: async function (_claimId, _codes) {
    let iClaim = await InsuranceClaim.getDetailOf(_claimId);
    let insurance = await Insurance.findOne({id: iClaim.insurance_id});
    
    if(!insurance) {
      throw new Error('No such insurance found');
    }

    

    return insurance;
  },
  
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    pet_name: {
      type: 'string',
      required: false,
      description: 'Name of the pet.'
    },

    created_at: {
      type: 'string',
      columnType: 'date',
      required: true,
      description: 'Insurance created at.'
    },

    paid_so_far: {
      type: 'number',
      required: true,
      description: 'Total money already payed.'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    owner_id: {
      model: 'owner',
    },

    insurance_type_id: {
      model: 'insurancetype',
    },

    pet_type_id: {
      model: 'pettype',
    },

    insurance_claims: {
      collection: 'insuranceClaim',
      via: 'insurance_id',
    },

    action_codes: {
      collection: 'actioncode',
      via: 'insuraces'
    }

  },


};
