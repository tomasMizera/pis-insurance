module.exports = {


  friendlyName: 'Get current iso date',


  description: 'Returns the current date in standard ISO format.',


  inputs: {

  },


  exits: {

    success: {
      outputFriendlyName: 'Current iso date',
    },

  },


  fn: async function (inputs, exits) {
    const today = new Date();
    let dd = today.getDate();

    let mm = today.getMonth()+1;
    const yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;

    // Send back the result through the success exit.
    return exits.success(yyyy+'-'+mm+'-'+dd);
  }

};

