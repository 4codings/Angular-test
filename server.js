const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);


/** get all team members */
app.get('/api/teams', (req, res) => {
  request(`http://localhost:3000/teams`, (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});
/** get all members */
app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});
/** get a member */
app.get('/api/members/:memberId', (req, res) => {
  const memberId = req.params.memberId;
  request(`http://localhost:3000/members/${memberId}`, (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});
/** create a member */
app.post('/api/members', (req, res) => {
  const newMember = req.body;
  request.post('http://localhost:3000/members', {json: newMember}, (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});
/** update a member */
app.put('/api/members/:memberId', (req, res) => {
  console.log(req.body, req.params.memberId)
  const updatedMember = req.body;
  const memberId = req.params.memberId;
  request.put(`http://localhost:3000/members/${memberId}`, { json: updatedMember}, (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});
/** delete a member */
app.delete('/api/members/:memberId', (req, res) => {
  const memberId = req.params.memberId;
  request.delete(`http://localhost:3000/members/${memberId}`, (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
