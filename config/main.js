exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/munch-minder';
exports.TEST_DATABASE_URL = 'mongodb://localhost/test-munch-minder';
exports.PORT = process.env.PORT || 8080;
