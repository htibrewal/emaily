if (process.env.NODE_ENV == 'production') {
  module.exports = require('./prod');
} else {
  //import and then export it immediately if in development
  module.exports = require('./dev');
}
