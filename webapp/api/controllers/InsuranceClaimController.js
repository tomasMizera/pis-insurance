


async function newInsuranceClaim(req, res) {
    // add to db, based on blah blah blah
    console.log('received request for a new insurance claim');
    console.log(req.body)

    // var createdInsurance = await InsuranceClaim.create({
    //   invoice_total: '123',
    //   description: 'Test insert Description',
    //   hospital_clinic: 'Saint Dominik Hospital',
    //   treatment_from: '2000-02-20',
    //   treatment_to: '2000-02-20',
    //   date: '2000-02-20',
    // }).fetch();
    //
    // sails.log('New id is:', createdInsurance.id);
    res.view("pages/dashboard/submited")
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
