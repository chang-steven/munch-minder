module.exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/munch-minder';
module.exports.TEST_DATABASE_URL = 'mongodb://localhost/test-munch-minder';
module.exports.PORT = process.env.PORT || 8080;
module.exports.JWT_SECRET = process.env.JWT_SECRET;
module.exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
