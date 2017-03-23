var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/goscrape', function(req, res){
  // use this to determine which film or entry to scrape, in this case, Dilwale
  url = 'http://www.imdb.com/title/tt4535650/';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var title, release, rating, production;
      var json = { title : "", release : "", rating : "", production :""};

      $('.title_wrapper').filter(function(){
        var data = $(this);
        title = data.children().first().text().trim();
        release = data.children().last().children().last().text().trim();
        json.title = title;
        json.release = release;
       
      })

      $('.ratingValue').filter(function(){
        var data = $(this);
        rating = data.text().trim();

        json.rating = rating;
      })

       $('.itemprop').filter(function(){
        var data = $(this);
        production = data.text().trim();

        json.production = production;
       })


    }

    fs.writeFile('results.json', JSON.stringify(json, null, 4), function(err){
      console.log('Done go check the results.json file');
    })

    res.send('Check the results.json file in your directory!')
  })
})

app.listen('8081')
console.log('Listening on port 8081');
exports = module.exports = app;