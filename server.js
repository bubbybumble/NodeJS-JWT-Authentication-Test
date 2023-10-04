const express = require('express');
const app = express();

const path = require('path');
const jwt = require('jsonwebtoken')
const PORT = 5000;

const secretKey = 'ajslhdfajsdfhasd';
const { expressjwt: exjwt } = require('express-jwt');
const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ['HS256']
});

let users = [
  {
    id: 1,
    username: 'fabio',
    password: '123'
  },
  {
    id: 2,
    username: 'aiden',
    password: '49'
  }
]

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api/dashboard', jwtMW, (req, res) => {
  res.json({
    success: true,
    text: 'Secret content that only logged in people can see.'
  });
});

app.get('/api/prices', jwtMW, (req, res) => {
  res.json({
    success: true,
    text: 'Ayo 3.99 for a sandwich? satisfactory'
  });
});

app.get('/api/settings', jwtMW, (req, res) => {
  res.json({
    success: true,
    text: 'Settings page works! :)'
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  for (let user of users) {
    if (username == user.username && password == user.password) {
      let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '30s' });
      res.json({
        success: true,
        err: null,
        token
      });
      break;
    }
  }

  res.status(401).json({
    success: false,
    token: null,
    err: 'Username or password is incorrect'
  });

  res.json({ data: 'it works!' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      officialError: err,
      err: 'Username or password is incorrect 2'
    });
  }
});

app.listen(PORT, () => {
  console.log(`serving on port ${PORT}`);
});
