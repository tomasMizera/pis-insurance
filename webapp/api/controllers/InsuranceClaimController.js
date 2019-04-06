async function addClaim(req, res) {
  sails.log('Adding new insurance claim.');
  console.log(req.body);
  // description: getValue('description'),
  //   hospital: getValue('hospital'),
  //   docName: getValue('docName'),
  //   invoice: getValue('invoice'),
  //   vetDocButton: getValue('vetDocButton'),
  //   descFileButton: getValue('descFileButton'),
  //   dateFrom: getValue('dateFrom'),
  //   dateTo: getValue('dateTo'),

  var createdInsurance = await InsuranceClaim.create({
    invoice_total: req.body.invoice,
    description: req.body.description,
    hospital_clinic: req.body.hospital,
    treatment_from: req.body.dateFrom,
    treatment_to: req.body.dateTo,

    date: '2000-02-20',
    owner_id: req.me.id,

  }).fetch();

  sails.log('New id is:', createdInsurance.id);
  sails.log('Insurance claim successfully added.')
}

module.exports = {

    addInsuranceClaim: (req, res) => {
        addClaim(req, res).then((data) => {
          res.ok();
        })
        .catch((err) => {
          res.serverError();
        });
    },

    getInsuranceClaims: (req, res) => {

    },

    setInsuranceClaimStatus: (req, res) => {

    },

    updateInsuranceClaim: (req, res) => {
        
    }
};
