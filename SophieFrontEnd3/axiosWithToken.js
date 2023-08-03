const axios = require('axios');
const token = 'my_token';
const config = {
headers: { Authorization: `Bearer ${token}` }
};
get('/api/users', config)
. then(res => console. log(res. data))
. catch(err => console. error(err));