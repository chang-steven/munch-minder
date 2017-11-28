//Database URLs
require('dotenv').config();
module.exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/munch-minder';
module.exports.TEST_DATABASE_URL =  global.TEST_DATABASE_URL || 'mongodb://localhost/test-munch-minder';

//Server listen port
module.exports.PORT = process.env.PORT || 8080;

//JWT Secret and Expiry
module.exports.JWT_SECRET = process.env.JWT_SECRET || 'testing';
module.exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';


//AWS S3 Configuration keys
exports.AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
exports.AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
exports.AWS_BUCKET = process.env.AWS_BUCKET || 'test-munchy-images';
