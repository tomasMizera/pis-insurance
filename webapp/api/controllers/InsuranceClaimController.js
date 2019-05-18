const os = require('os');
const fs = require('fs');

function getCurrentDate() {
  const today = new Date();
  let dd = today.getDate();

  let mm = today.getMonth()+1;
  const yyyy = today.getFullYear();
  if(dd<10) dd='0'+dd;
  if(mm<10) mm='0'+mm;

  return yyyy+'-'+mm+'-'+dd;
}

async function addClaim(req, res) {
  let vet_first_name = req.body.vetName.split(' ')[0];
  let vet_last_name = req.body.vetName.split(' ')[1];
  let vet = await Vet.find({ first_name: vet_first_name, last_name: vet_last_name});
  let vet_id = undefined;
  if (vet[0]) {
    vet_id = vet[0].id;
  } else {
    console.log("No vet with such name.");
  }

  let file_name = undefined;
  
  req.file('vet_doc').upload( async function (err, uploadedFiles) {
    if (err) sails.log(err);

    file_name = uploadedFiles[0].fd.split('/').pop().split('.');
    const file_extension = file_name.pop();
    file_name = file_name.join('');

    sails.log.warn(file_name);
    sails.log.warn(file_extension);
    await Report.create({
      path: file_name,
      extension: file_extension,
      insurance_claim: null,
    }).fetch()
      .then(async value => {
        const file_id = value.id;

        my_insurance_ids = await Insurance.find({ owner_id: req.me.id});
        // first_in_id = my_insurance_ids[0].id;
        first_in_id = 1;

        console.log(file_id);

        var createdInsurance = await InsuranceClaim.create({
          invoice_total: req.body.invoice,
          description: req.body.description,
          hospital_clinic: req.body.hospital,
          treatment_from: req.body.dateFrom,
          treatment_to: req.body.dateTo,

          vet_id: vet_id,
          report_id: file_id,
          state_id: 1,
          date: getCurrentDate(),
          owner_id: req.me.id,
          insurance_id: first_in_id,
          pay_to_vet: (req.body.payToVet === 1),

        });
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
