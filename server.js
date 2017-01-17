const url = require('url');
const express = require('express');
const app = express();

const URLS = {};

const generateRandomInt = () => {
  const number = Math.floor(1000 + Math.random() * 9000);
  const currentNumbers = Object.values(URLS);
  const isInURLS = currentNumbers.filter(num => num == number);
  if (isInURLS.length > 0) {
    generateRandomInt();
  }
  return number;
}

app.get('/:shortUrl', (req, res) => {
  const longUrl = Object.keys(URLS).filter(key => URLS[key] == req.params.shortUrl);

  if (longUrl.length === 0) {
    res.send(JSON.stringify({
      error: 'This url is not on the database.'
    }));
    return res.end();
  }

  res.redirect(longUrl[0]);
  res.end();
});

app.get('/new/*', (req, res) => {
  const parsedUrl = url.parse(req.params[0]);
  let shortUrl;
  let formattedUrl;

  if (!parsedUrl.protocol || !parsedUrl.host) {
    res.send(JSON.stringify({ error: 'Wrong url format, make sure you have a valid protocol and real site.' }));
    return res.end();
  }

  formattedUrl = parsedUrl.format();
  shortUrl = generateRandomInt();
  URLS[formattedUrl] = shortUrl;

  console.log(URLS);

  res.send(JSON.stringify({
    "original_url": formattedUrl,
    "short_url": `http://${req.headers.host}/${shortUrl}`
  }));
  res.end();
});

app.listen(process.env.PORT || 8080);
