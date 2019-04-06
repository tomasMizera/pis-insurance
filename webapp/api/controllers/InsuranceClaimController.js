
function newInsuranceClaim(req, res) {
    // add to db, based on blah blah blah
    console.log('received request for a new insurance claim');
    res.view('pages/homepage');
}

function getInsuranceClaimDetails(req, res) {
    InsuranceClaim.getDetailOf(req.param('claimId'))
    .then((data) => {
        allData = {
            claimData: data,
            // ownerData: owner
        };
        // allData.claimData.date = String(allData.claimData.date.split(' ').splice(1,3));
        return res.view('pages/insuranceClaimForEmployee', allData);
    })
    .catch((err) => {
        return res.serverError('Ooops.. something wrong happened on the server: ' + err);
    });
}

module.exports = {

    // handles new insurance claim report
    addInsuranceClaim: (req, res) => {
        newInsuranceClaim(req, res);
    },

    getInsuranceClaims: (req, res) => {

      InsuranceClaim.find(function(err, claims){
        res.view('pages/claims', {claims: claims});
      });




    },

    getInsuranceClaim: (req, res) => {
        getInsuranceClaimDetails(req, res);
    },

    setInsuranceClaimStatus: (req, res) => {

    },

    updateInsuranceClaim: (req, res) => {

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
