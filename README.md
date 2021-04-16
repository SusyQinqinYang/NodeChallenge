# Modified Star War API

## Description

This API is and modified version of [Star Wars API](https://swapi.dev/). It contains below two endpoints:
- /people : You can retrieve all 87 Star War characters at once.
  note: /people endpoint can also take an optional query param "sortBy" that allows the result array to be sorted by 'name', 'height', or 'mass'.
- /planets : The planets endpoint would return all planets but the residents field on each planet to be replaced with the residents full names instead of the default from SWAPI which is links to each resident in the original Star War API.

## Getting Started

### Prerequisites

You will need to install the following:

```
npm
node.js
```

### Installing

```
git clone repo
npm install
npm start
localhost:3000
```

### Testing via postman

```
localhost:3000/planets
localhost:3000/people/
localhost:3000/people/?sortBy=mass
```

## Built With
- [Express](https://expressjs.com/) - Framework for Node.js

## Authors

- **Susy(Qinqin) Yang**

## Demo
**Modified Star War API**
![alt text](http://g.recordit.co/JlKgf3eZ2G.gif)