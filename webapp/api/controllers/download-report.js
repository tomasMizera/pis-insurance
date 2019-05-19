module.exports = {

  friendlyName: 'Download report',

  description: 'Download report file (returning a stream).',

  inputs: { },

  exits: {
    success: {
      statusCode: 200,
      description: 'Document has been sent for download.'
    },

    notFound: {
      statusCode: 403,
      description: 'not found'
    },
  },

  fn: async function () {
    const id = this.req.param('reportId');

    const report = await Report.findOne({ id });
    if(!report) {
      throw 'notFound';
    }

    const filename = `${report.path}.${report.extension}`;

    const file = require('path').resolve(sails.config.custom.downloadDir + filename);
    if(!file) {
      throw 'notFound';
    }

    this.res.attachment(filename);

    return await sails.startDownload(file);
  }
};
