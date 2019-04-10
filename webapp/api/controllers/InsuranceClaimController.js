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
//   first_in_id = my_insurance_ids[0].id;
first_in_id = 1;
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
  sails.log('Insurance claim successfully added.');
}

function getInsuranceClaimDetails(req, res) {
    Promise.all([InsuranceClaim.getDetailOf(Number(req.param('claimId'))), Vet.getAll()])
    .then((datas) => {
        retObj = {
            claimData: datas[0],
            vets: datas[1]
        }
        return Promise.all([Insurance.getActionCodes(datas[0].insurance_id), retObj])
    })
    .then((data) => {
        
        retObj = data[1];
        retObj.insuranceCodes = data[0];
        res.view('pages/insuranceClaimForEmployee', retObj);
    })
    .catch((err) => {
        res.serverError('Ooops.. something wrong happened on the server: ' + err);
    });
}

function updateInsuranceClaimDetails(req, res) {
    let claimId = Number(req.body.claimId);
    let actionCodes = req.body.codes;
    let vet = req.body.vet;

    if (!actionCodes || !claimId || !vet) {
        res.badRequest('Values you passed are not valid!');
    }
    actionCodes = actionCodes.split(',');

    // Parse id of vet
    vet = Number(vet.split(':')[0]);
    
    // Update entry and redirect user if update was successfull
    Promise.all([
        InsuranceClaim.updateEntry(claimId, 'vet_id', vet),
        InsuranceClaim.addActionCodes(claimId, actionCodes)
    ])
    .then((responseData) => {
        setTimeout(() =>{
            res.redirect(`/finalizeClaim/${claimId}`);
        }, 1500);
    })
    .catch((err) => {
        res.serverError('Something failed .. try again later, error: ' + err);
    });
}

function getFinalizedClaim(req, res) {
    Insurance.isClaimCoveredByInsurance(Number(req.param('claimId')), [])
    .then((data) => {
        setTimeout(() => {
            res.view('pages/insuranceClaimAfterCheck', data);
        }, 3000);
    })
    .catch((err) => {
        res.serverError(err);
    })
}

function provideStateChangeOfClaim(req, res) {
    let decision = req.param('decision');
    let op = 1;

    if (decision == 'accept') {
        op = 3;
    } else if (decision == 'reject') {
        op = 2;
    }

    InsuranceClaim.updateEntry(Number(req.param('claimId')), 'state_id', op)
    .then(() => {getFinalizedClaim(req, res)})
    .then(() => {})
    .catch((err) => res.serverError(err));
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

        // list only pending claims
      InsuranceClaim.find({state_id: 1},function(err, claims){
        res.view('pages/claims', {claims: claims});
      });
    },

    getInsuranceClaim: (req, res) => {
        getInsuranceClaimDetails(req, res);
    },

    setInsuranceClaimStatus: (req, res) => {
        provideStateChangeOfClaim(req, res);
    },

    updateInsuranceClaim: (req, res) => {
        updateInsuranceClaimDetails(req, res);
    },

    finalizeInsuranceClaim: (req, res) => {
        getFinalizedClaim(req, res);
    }

    // Just wanted to add dump data to db 
    // await Vet.create({
    //     emailAddress: 'vet@ma.om',
    //     password: 'patrik',
    //     first_name: 'Patrik',
    //     last_name: 'Skulavy',
    //     address: 'J. Holleho 13, Tvrdosovce u Dominika doma',
    //     phone_number: '0944522011',
    // });
    // await Vet.create({
    //     emailAddress: 'v@ma.com',
    //     password: 'vet',
    //     first_name: 'Bethoven',
    //     last_name: 'Ruzovy',
    //     address: 'J. Holleho 13, Tvrdosovce u Dominika doma',
    //     phone_number: '0944522011',
    //     bank_account: 'SK110092200025125663642'
    // });
}
