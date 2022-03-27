const cors = require('cors');
const corsOptions = {
  origin: ['https://mern-tshirt-store.netlify.app', 'http://localhost:3000'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = cors(corsOptions);
