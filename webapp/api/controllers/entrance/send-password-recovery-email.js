module.exports = {


  friendlyName: 'Send password recovery email',


  description: 'Send a password recovery notification to the user with the specified email address.',


  inputs: {

    emailAddress: {
      description: 'The email address of the alleged user who wants to recover their password.',
      example: 'rydahl@example.com',
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      description: 'The email address might have matched a user in the database.  (If so, a recovery email was sent.)'
    },

  },


  fn: async function (inputs) {

    // Find the record for this user.
    // (Even if no such user exists, pretend it worked to discourage sniffing.)
    var userRecord = await Owner.findOne({ emailAddress: inputs.emailAddress });
    if (!userRecord) {
      return;
    }//•

    // Come up with a pseudorandom, probabilistically-unique token for use
    // in our password recovery email.
    var token = await sails.helpers.strings.random('url-friendly');

    // Store the token on the user record
    // (This allows us to look up the user when the link from the email is clicked.)

    // Original
    // await Owner.update({ id: userRecord.id })
    // .set({
    //   passwordResetToken: token,
    //   passwordResetTokenExpiresAt: Date.now() + sails.config.custom.passwordResetTokenTTL,
    // });

    function makeid(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

    var new_password = makeid(5);
    sails.log(new_password);
    var hashed = await sails.helpers.passwords.hashPassword(new_password);

    // Store the user's new password and clear their reset token so it can't be used again.
    await Owner.updateOne({ id: userRecord.id })
      .set({
        password: hashed,
        passwordResetToken: '',
        passwordResetTokenExpiresAt: 0
      });

    // Send recovery email
    await sails.helpers.sendTemplateEmail.with({
      to: inputs.emailAddress,
      subject: 'Password reset instructions',
      template: 'email-reset-password',
      templateData: {
        fullName: userRecord.fullName,
        token: new_password
      }
    });

  }


};
