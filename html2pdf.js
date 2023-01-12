var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./cypress/reports/index.html', 'utf8');
var options = { format: 'A4' };

pdf.create(html, options).toFile('./cypress/reports/report.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});