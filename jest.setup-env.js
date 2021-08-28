// Mock values for aws access keys, so that aws-sdk does not try to fetch
// credential data from instance metadata endpoints during test ececutions

process.env.AWS_ACCESS_KEY_ID = 'AKIAMOCKEDKEY';
process.env.AWS_SECRET_ACCESS_KEY = 'this-does-not-matter';
