module.exports = {


  friendlyName: 'View Submited page',


  description: 'Display the dashboard "Submited" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/submited',
      description: 'Display the submited page for authenticated users.'
    },

  },


  fn: async function () {

    return {};

  }


};
