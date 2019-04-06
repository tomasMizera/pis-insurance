
function newInsuranceClaim(req, res) {
    // add to db, based on blah blah blah
    console.log('received request for a new insurance claim');
    res.view('pages/homepage');
}


module.exports = {

    // handles new insurance claim report
    addInsuranceClaim: (req, res) => { 
        newInsuranceClaim(req, res);
    },

    getInsuranceClaims: (req, res) => {

    },

    setInsuranceClaimStatus: (req, res) => {

    },

    updateInsuranceClaim: (req, res) => {
        
    }
}