async function addClaim(req, res) {
  req.file('vet_doc').upload({
    dirname: require('path').resolve(sails.config.custom.uploadDir)
  }, async function (err, uploadedFiles) {
    if (err) {
      res.serverError('Could not upload file: ' + err);
    }

    let fd = uploadedFiles[0].fd.split('/').pop().split('.');
    const file_extension = fd.pop();
    const file_name = fd.join('');

    sails.log.debug(file_name);
    sails.log.debug(file_extension);

    const newReport = await Report.create({
        path: file_name,
        extension: file_extension,
        insurance_claim: null,
      }).fetch();

    my_insurance_ids = await Insurance.find({ owner_id: req.me.id});
    // first_in_id = my_insurance_ids[0].id;
    first_in_id = 1;

    await InsuranceClaim.create({
      invoice_total: req.body.invoice,
      description: req.body.description,
      hospital_clinic: req.body.hospital,
      treatment_from: req.body.dateFrom,
      treatment_to: req.body.dateTo,

      vet_id: undefined,
      report_id: newReport.id,
      state_id: 1,
      date: await sails.helpers.getCurrentIsoDate(),
      owner_id: req.me.id,
      insurance_id: first_in_id,
      pay_to_vet: (req.body.payToVet === 1),
    });
  });
}

function getInsuranceClaimDetails(req, res) {
    Promise.all([InsuranceClaim.getDetailOf(Number(req.param('claimId'))), Vet.getAll()])
    .then((datas) => {
        retObj = {
            claimData: datas[0],
            vets: datas[1]
        };
        return Promise.all([Insurance.getActionCodes(datas[0].insurance_id), retObj])
    })
    .then((data) => {
        retObj = data[1];
        retObj.insuranceCodes = data[0];
        if (retObj.claimData.report_id) {
            let pa = retObj.claimData.report_id.path;
            pa = pa.split('/');
            let ix = pa.indexOf("documents");
            retObj.claimData.report_id.path = pa[ix+1];
        }
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
            if (data.claimData.report_id) {
                let pa = data.claimData.report_id.path;
                pa = pa.split('/');
                let ix = pa.indexOf("reports");
                data.claimData.report_id.path = '/' + pa[ix] + '/' + pa[ix+1];
            }
            res.view('pages/insuranceClaimAfterCheck', data);
        }, 3000);
    })
    .catch((err) => {
        res.serverError(err);
    })
}


function getCheckedClaim(req, res) {

  let dec = "sent to supervisor";

  if (req.param('decision') == 'accept') {
    dec = 'accepted';
    if (req.param('payToVet') == "true")
    if (req.param('vetMail') != ""){
    sails.request({
      url: '/test/validate',
      method: 'GET',
      data: {
        emailAddress: req.param('vetMail'),
      },
    }, error => {
      if (error)
        console.log(error);
    });

    sails.request({
      url: '/test/email',
      method: 'GET',
      data: {
        emailAddress: req.param('vetMail'),
        emailSubject: 'Missing bank account',
        emailText: 'Please add your bank account',
      },
    }, error => {
      if (error)
        console.log(error);
    });}
  } else if (req.param('decision') == 'reject') {
    dec = 'rejected';
  }

  sails.request({
    url: '/test/validate',
    method: 'GET',
    data: {
      emailAddress: req.param('ownerMail'),
    },
  }, error => {
    if (error)
      console.log(error);
  });

  sails.request({
    url: '/test/email',
    method: 'GET',
    data: {
      emailAddress: req.param('ownerMail'),
      emailSubject: 'Your insurance claim',
      emailText: 'Your claim has been '+dec,
    },
  }, error => {
    if (error)
      console.log(error);
  });


  res.view('pages/claimFinish', {vetMail: req.param('vetMail'),ownerMail: req.param('ownerMail')});
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
    .then(() => {getCheckedClaim(req, res)})
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
    },
};
