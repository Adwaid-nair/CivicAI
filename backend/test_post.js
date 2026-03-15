const fs = require('fs');
const FormData = require('form-data');
const http = require('http');

const form = new FormData();
form.append('category', 'Electricity');
form.append('description', 'Sparks flying from pole');
form.append('lat', '20');
form.append('lng', '78');
// Assuming dummy.jpg exists as created by the previous echo "dummy" > dummy.jpg
form.append('images', fs.createReadStream('./dummy.jpg'));

const request = http.request({
  method: 'post',
  host: 'localhost',
  port: 5000,
  path: '/api/reports/submit',
  headers: form.getHeaders()
});

form.pipe(request);

request.on('response', function(res) {
  res.setEncoding('utf8');
  res.on('data', chunk => console.log('Response body:', chunk));
});
