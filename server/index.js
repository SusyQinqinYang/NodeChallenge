const app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('get', (req, res) => {
    res.status(201).json('the server responded')
})

app.listen(3000, ()=> console.log('Server is listening on port 3000'))

