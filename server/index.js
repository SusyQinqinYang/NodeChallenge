const app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

app.use(bodyParser.json());

/* ===> allPeople section: data query and data cleaning up <===== */
let nextPeoplePageUrl = 'http://swapi.dev/api/people/?page=1';
let allPeople = [];

const retrievePeopleOnePage = async() => {
    try {
        const peopleOnePage = await axios.get(nextPeoplePageUrl);
        let {next, results} = peopleOnePage.data
        nextPeoplePageUrl = next;
        allPeople = allPeople.concat(results)
        // console.log('allPeople', allPeople, 'nextPeoplePageUrl', nextPeoplePageUrl)
    }
    catch(err) {
        console.log('swapi.dev: request people error:', err)
    }
};

app.get('/people/', async (req, res) => {
    let sortBy = req.query.sortBy;
    await retrievePeopleOnePage();
    while (typeof nextPeoplePageUrl  === 'string') {
        await retrievePeopleOnePage();
    }
    if (sortBy !== undefined && allPeople.length > 0) {
        allPeople.sort((a,b) => a[sortBy] - b[sortBy]);
    }
    if (allPeople.length > 0) {
        res.status(200).json(allPeople);
    } else {
        res.status(404).json('Failed to find people list');
    }
})

app.listen(3000, ()=> console.log('Server is listening on port 3000'))

