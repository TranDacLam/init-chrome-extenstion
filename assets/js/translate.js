import { fetchDataBackground } from './helper';
import languages from './languages';
import { URL_TRANSLATE_GOOGLEAPI } from './../../constants/api'

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

    var url = `${URL_TRANSLATE_GOOGLEAPI}?client=gtx&sl=${opts.from}&tl=${opts.to}&dt=t&q=${text.replace(/\s/g, '%20')}`;

    return fetchDataBackground('request-api', { url }).then(function (res) {

      console.log("res fetch", res)
      
      var result = {
        text: '',
        from: opts.from,
        to: opts.to
      };

      res[0].forEach(function (obj) {
        if (obj[0]) {
          result.text += obj[0];
        }
      });

      if(res && res[2]){
        result.from = res[2];
      }
      console.log("result fetch", result)
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