module.exports = {

  friendlyName: 'Download report',

  description: 'Download report file (returning a stream).',

  inputs: { },

  exits: {
    success: {
      statusCode: 200,
      description: 'Document has been sent for download.'
    },
  },

  fn: async function () {
    const reportId = this.req.param('reportId');

    let reports = await Report.find({ id: reportId });

    const path = reports[0].path;
    const uploadsDir = '/home/dominik/Repos/pis-insurance/webapp/.tmp/uploads/';

    let file = require('path').resolve(uploadsDir + path + '.pdf');

    this.res.set("Content-disposition", "attachment; filename=" + path + ".pdf");

    return await sails.startDownload(file);
  }
};
