/**
 * User.js
 *
 * A user who can log in to this application.
 */

/*
!! anonymous {
  action_codes:
   [ { createdAt: 0,
       updatedAt: 0,
       id: 1,
       code: 'XC123',
       description: 'flu' },
     { createdAt: 0,
       updatedAt: 0,
       id: 2,
       code: 'XC321',
       description: 'headache' } ],
  createdAt: 0,
  updatedAt: 0,
  id: 1,
  pet_name: 'figo',
  created_at: 2019-04-12T22:00:00.000Z,
  paid_so_far: 2300,
  owner_id: 1,
  insurance_type_id:
   { createdAt: 0,
     updatedAt: 0,
     id: 1,
     is_comprehensive: null,
     name: 'main',
     max_length: 2,
     max_interest: 2,
     max_cover: 10000 },
  pet_type_id: 1 } !!!! anonymous {
  actionCodes:
   [ { createdAt: 0,
       updatedAt: 0,
       id: 2,
       code: 'XC321',
       description: 'headache' },
     { createdAt: 0,
       updatedAt: 0,
       id: 3,
       code: 'PA111',
       description: 'tattoo' },
     { createdAt: 0,
       updatedAt: 0,
       id: 4,
       code: 'PA112',
       description: 'blackeye' } ],
  createdAt: 1554577494134,
  updatedAt: 1554637430762,
  id: 3,
  date: '2000-04-09',
  treatment_from: 'asd',
  treatment_to: 'asdff',
  hospital_clinic: 'asdfasdf',
  description: 'On the 25th of February my pet ...',
  invoice_total: 22,
  owner_id: 2,
  vet_id: 2,
  report_id: null,
  state_id: 3,
  insurance_id: 1 }

*/

module.exports = {

  areCodesCoveredByInsurance: async function (_claimId) {
    let iClaim = await InsuranceClaim.getDetailOf(_claimId);
    let insurance = await Insurance.findOne({id: iClaim.insurance_id}).populate('action_codes').populate('insurance_type_id');
    
    if(!insurance || !iClaim) {
      throw new Error('No such insurance or insurance claim found');
    }
    console.log('!!', insurance, '!!!!', iClaim);
    

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
      via: 'insurances'
    }

  },


};
