describe('Aadhaar Verification API Tests', () => {
    const baseUrl = 'https://api.kycverify.com/v1';
    let requestId;
    
    before(() => {
        cy.log('Starting Aadhaar Verification API Tests');
    });

    it('Initiate Aadhaar Verification', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/aadhaar/verify`,
            headers: {
                'x-api-key': 'your-api-key',
                'x-request-id': Cypress._.random(100000, 999999).toString()
            },
            body: {
                aadhaarNumber: '123412341234',
                consent: 'Y',
                referenceId: 'testRef123',
                verificationType: 'OTP',
                requestSource: 'automationTest',
                callback: {
                    url: 'https://your-callback-url.com',
                    headers: { 'Authorization': 'Bearer token' }
                }
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('requestId');
            requestId = response.body.requestId;
        });
    });

    it('Submit OTP for Aadhaar Verification', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/aadhaar/verify/otp`,
            headers: {
                'x-api-key': 'your-api-key'
            },
            body: {
                requestId: requestId,
                otp: '123456'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('status');
        });
    });

    it('Check Aadhaar Verification Status', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/aadhaar/status/${requestId}`,
            headers: {
                'x-api-key': 'your-api-key'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('status');
        });
    });
});
