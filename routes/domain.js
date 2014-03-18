var cheerio = require('cheerio'),
  request = require('request'),
  async = require('async');

/*
 * GET domain
 */

exports.show = function (req, res) {
  var domain = req.route.params.domain;
  var base_url = 'http://' + domain;
  request(base_url, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var root_paths = [];
      $('meta[name="x-liabilities-proof-root"]').each(function () {
        console.log($(this).attr('data'));
        root_paths.push($(this).attr('data'));
      });

      var roots = [];
      async.each(root_paths, function (path, cb) {
        request(base_url + '/' + path, function (err, response, body) {
          if (!err && response.statusCode == 200) {
            roots.push(body);
            cb();
          }
          else {
            cb();
          }
        });
      }, function (err) {
        roots = roots.map(function (root) {
          return JSON.parse(root);
        });
        res.send(roots);
      });
    }
    else {
      res.send({ error: err || 'Domain ' + base_url + ' unreachable.' });
    }
  });
};
