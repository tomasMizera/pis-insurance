module.exports = {


  friendlyName: 'Update password and login',


  description: 'Finish the password recovery flow by setting the new password and '+
  'logging in the requesting user, based on the authenticity of their token.',


  inputs: {

    password: {
      description: 'The new, unencrypted password.',
      example: 'abc123v2',
      required: true
    },

    token: {
      description: 'The password token that was generated by the `sendPasswordRecoveryEmail` endpoint.',
      example: 'gwa8gs8hgw9h2g9hg29hgwh9asdgh9q34$$$$$asdgasdggds',
      required: true
    }

  },


  exits: {

    success: {
      description: 'Password successfully updated, and requesting user agent is now logged in.'
    },

    invalidToken: {
      description: 'The provided password token is invalid, expired, or has already been used.',
      responseType: 'expired'
    }

  },


  fn: async function (inputs) {

    if(!inputs.token) {
      throw 'invalidToken';
    }

    // Look up the user with this reset token.
    var userRecord = await Owner.findOne({ passwordResetToken: inputs.token });

    // If no such user exists, or their token is expired, bail.
    if (!userRecord || userRecord.passwordResetTokenExpiresAt <= Date.now()) {
      throw 'invalidToken';
    }

    // Hash the new password.
    var hashed = await sails.helpers.passwords.hashPassword(inputs.password);

    // Store the user's new password and clear their reset token so it can't be used again.
    await Owner.updateOne({ id: userRecord.id })
    .set({
      password: hashed,
      passwordResetToken: '',
      passwordResetTokenExpiresAt: 0
    });

    // Log the user in.
    // (This will be persisted when the response is sent.)
    this.req.session.userId = userRecord.id;

  }


};
