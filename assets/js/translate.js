import queryString from 'query-string';
import { fetchDataBackground } from './helper';

// var safeEval = require('safe-eval');
// var token = require('google-translate-token');

var languages = require('./languages');

function translate(text, opts) {
    opts = opts || {};

    var e;
    [opts.from, opts.to].forEach(function (lang) {
        if (lang && !languages.isSupported(lang)) {
            e = new Error();
            e.code = 400;
            e.message = 'The language \'' + lang + '\' is not supported';
        }
    });
    if (e) {
        return new Promise(function (resolve, reject) {
            reject(e);
        });
    }

    opts.from = opts.from || 'auto';
    opts.to = opts.to || 'en';

    opts.from = languages.getCode(opts.from);
    opts.to = languages.getCode(opts.to);

    console.log("text", text)

    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
    + opts.from + "&tl=" + opts.to + "&dt=t&q=" + text.replace(/\s/g, '%20');
    var data = {
      client: 'gtx',
        sl: opts.from,
        tl: opts.to,
        dt: 't',
        q: text
    };
    // data[token.name] = token.value;

    return fetchDataBackground('request', {url}).then(function (res) {

      console.log("res fetch", res)
      var result = {
          text: '',
          from: {
              language: {
                  didYouMean: false,
                  iso: ''
              },
              text: {
                  autoCorrected: false,
                  value: '',
                  didYouMean: false
              }
          },
          raw: ''
      };

      if (opts.raw) {
          result.raw = res.body;
      }

      // var body = safeEval(res.body);
      var body = res.body;
      body[0].forEach(function (obj) {
          if (obj[0]) {
              result.text += obj[0];
          }
      });

      if (body[2] === body[8][0][0]) {
          result.from.language.iso = body[2];
      } else {
          result.from.language.didYouMean = true;
          result.from.language.iso = body[8][0][0];
      }

      if (body[7] && body[7][0]) {
          var str = body[7][0];

          str = str.replace(/<b><i>/g, '[');
          str = str.replace(/<\/i><\/b>/g, ']');

          result.from.text.value = str;

          if (body[7][5] === true) {
              result.from.text.autoCorrected = true;
          } else {
              result.from.text.didYouMean = true;
          }
      }

      return result;
  }).catch(function (err) {
      var e;
      e = new Error();
      if (err.statusCode !== undefined && err.statusCode !== 200) {
          e.code = 'BAD_REQUEST';
      } else {
          e.code = 'BAD_NETWORK';
      }
      throw e;
  });
}

export default translate;
export{
  languages
}