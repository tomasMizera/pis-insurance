/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': 'is-logged-in',
  // Bypass the `is-logged-in` policy for:
  'entrance/*': true,
  'account/logout': true,
  'view-homepage-or-redirect': true,
  'deliver-contact-form-message': true,

  'test-mail': true,
  'test-validate': true,

  InsuranceClaimController: {
    'getInsuranceClaims': true,
    'setInsuranceClaimStatus': true,
    'updateInsuranceClaim': true,
    'getInsuranceClaim': true,
    'finalizeInsuranceClaim': true,
    'getReport': true,
    'getReportById': true,
    '*': 'is-logged-in'
  }
};
