/**
 * Owner.js
 *
 * A user who can log in to this application.
 */

module.exports = {
  
  isClaimCoveredByInsurance: async function (_claimId) {
    let iClaim = await InsuranceClaim.getDetailOf(_claimId);
    let insurance = await Insurance.findOne({id: iClaim.insurance_id})
    .populate('action_codes')
    .populate('insurance_type_id')
    .populate('pet_type_id')
    .populate('owner_id');
    
    if(!insurance || !iClaim) {
      throw new Error('No such insurance or insurance claim found');
    }
    retVal = {};
    
    iClaimCodes = iClaim.actionCodes.map(code => code.id);
    insuranceCodes = insurance.action_codes.map(code => code.id);
    
    coveredCodesByInsurance = iClaim.actionCodes.filter(x => insuranceCodes.includes(x.id));
    uncoveredCodesByInsurance = iClaim.actionCodes.filter(x => !insuranceCodes.includes(x.id));
    
    retVal.coveredCodes = coveredCodesByInsurance;
    retVal.uncoveredCodes = uncoveredCodesByInsurance;
    
    // All codes are covered by insurance?
    if (uncoveredCodesByInsurance.length == 0) {
      retVal.codesStatus = 1;
      retVal.codesStatusText = 'All codes are covered by insurance'; 
    } else if (uncoveredCodesByInsurance.length == iClaimCodes.length) {
      retVal.codesStatus = -1;
      retVal.codesStatusText = 'None of the codes are covered by insurance';
    } else {
      retVal.codesStatus = 0;
      retVal.codesStatusText = 'Some of the codes are covered by insurance';
    }
    
    retVal.insuranceData = insurance;
    retVal.claimData = iClaim;
    
    
    // Check whether insurance can pay the claim price
    
    let canCover = (insurance.insurance_type_id.max_cover - insurance.paid_so_far - iClaim.invoice_total) > 0
    switch(canCover) {
      case true:
        retVal.priceStatusText = 'Insurance can cover insurance claims price';
        retVal.priceStatus = 1;
        break;
      case false:
        retVal.priceStatusText = 'Insurance can not cover insurance claims price';
        retVal.priceStatus = 0;
        break;
    }
    
    
    return retVal;
  },
  
  getActionCodes: async function(_id) {
    let entry = await Insurance.findOne({id: _id})
    .populate('action_codes');
    
    if (!entry) {
      throw new Error('No such insurance');
    }
    
    entry = entry.action_codes.map(c => [c.code, c.description]);
    
    return entry;
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
