
function newInsuranceClaim(req, res) {
    // add to db, based on blah blah blah
    console.log('received request for a new insurance claim');
    res.view('pages/homepage');
}

async function getInsuranceClaimDetails(req, res) {
    throw new Error('It failed!');
}

module.exports = {

    // handles new insurance claim report
    addInsuranceClaim: (req, res) => { 
        newInsuranceClaim(req, res);
    },

    getInsuranceClaims: (req, res) => {

    },

    getInsuranceClaim: (req, res) => {
        getInsuranceClaimDetails(req, res)
        .then((data) => {
            res.view('pages/insuranceClaimForEmployee',data);
        })
        .catch((err) => {
            res.serverError('Ooops.. something wrong happened on the server: ' + err);
        });
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