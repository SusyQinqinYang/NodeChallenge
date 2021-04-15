const app = require('express')();
const bodyParser = require('body-parser');
const axios = require('axios');
const Promise = require("bluebird");

app.use(bodyParser.json());

/* ===> allPeople API section: data retrieve and sort <===== */
let nextPeoplePageUrl = 'http://swapi.dev/api/people/?page=1';
let allPeople = [];

const retrievePeopleOnePage = async() => {
    try {
        const peopleOnePage = await axios.get(nextPeoplePageUrl);
        let {next, results} = peopleOnePage.data
        nextPeoplePageUrl = next;
        allPeople = allPeople.concat(results)
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
        res.status(404).json('Failed to retrieve people list');
    }
})

/* ===> allPlanets API section: data retrieve and modification <===== */
let nextPlanetsPageUrl = 'http://swapi.dev/api/planets?page=1';
let allPlanets = [];

const retrievePlanetsOnePage = async() => {
    try {
        const planetsOnePage = await axios.get(nextPlanetsPageUrl);
        let {next, results} = planetsOnePage.data
        nextPlanetsPageUrl = next;
        allPlanets= allPlanets.concat(results)
    }
    catch(err) {
        console.log('swapi.dev: request planets error:', err)
    }
};

const fetchAllResidentsName = async (residentsUrlArr) => {
    const allNamePromise = residentsUrlArr.map(eachResidentsUrl => axios.get(eachResidentsUrl));
  
    return axios.all(allNamePromise).then(
      axios.spread((...responses) => {
        return responses.map(allInfoOfAResident => allInfoOfAResident.data.name)
      }),
    );
};

app.get('/planets/', async (req, res) => {
    await retrievePlanetsOnePage();
    while (typeof nextPlanetsPageUrl  === 'string') {
        await retrievePlanetsOnePage();
    }

    if (allPlanets.length > 0) {
        const modifyPlanets = (allPlanets) => {
            return Promise.all(
                allPlanets.map( async (planetInfo) => {
                    planetInfo.residents = await fetchAllResidentsName(planetInfo.residents);
                    return planetInfo;
                })
            )
        }

        modifyPlanets(allPlanets)
        .then((modifiedPlanets) => {
            res.status(200).json(modifiedPlanets);
        })
    } else {
        res.status(404).json('Failed to retrieve the planets list');
    }
})


app.listen(3000, ()=> console.log('Server is listening on port 3000'))

