async function addClaim(req, res) {
  sails.log('Adding new insurance claim.');
  //console.log(req.body);

  //console.log(req.file('vet_doc'));
  // req.file('vet_doc').upload(function (err, uploadedFiles) {
  //   if (err) {
  //     console.log('file upload went wrong!');
  //     console.log(err);
  //   }
  //
  //   console.log('Upload successful', uploadedFiles);
  // });

  // description: getValue('description'),
  //   hospital: getValue('hospital'),
  //   docName: getValue('docName'),
  //   invoice: getValue('invoice'),
  //   vetDocButton: getValue('vetDocButton'),
  //   descFileButton: getValue('descFileButton'),
  //   dateFrom: getValue('dateFrom'),
  //   dateTo: getValue('dateTo'),

  function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10)
    {
      dd='0'+dd;
    }

    if(mm<10)
    {
      mm='0'+mm;
    }

    return yyyy+'-'+mm+'-'+dd;
  }

  my_insurance_ids = await Insurance.find({ owner_id: req.me.id});
  first_in_id = my_insurance_ids[0].id;
  //
  // console.log(req.file('vetDocButton'));
  //
  console.log(req.body);
  var createdInsurance = await InsuranceClaim.create({
    invoice_total: req.body.invoice,
    description: req.body.description,
    hospital_clinic: req.body.hospital,
    treatment_from: req.body.dateFrom,
    treatment_to: req.body.dateTo,

    state_id: 1,
    date: getCurrentDate(),
    owner_id: req.me.id,
    insurance_id: first_in_id,

  });
  sails.log('Insurance claim successfully added.')
}

module.exports = {

    addInsuranceClaim: (req, res) => {
        addClaim(req, res).then((data) => {
          res.ok();
        })
        .catch((err) => {
          console.log(err);
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
