import translate from './translate';
import { saveTranslate } from './../api/translate';
import { getProductTranslate } from './../api/products';

async function multipleTranslations({data}){
  let { productId = 0, type = "PRODUCT", token = "" } = data;
  let headers = {
    "Authorization": `Bearer ${token || ''}`
  }
  let resPT = await getProductTranslate({id: productId, type}, headers);
  if(resPT.status){
    let { content = [], defaultLanguage = 'auto', otherLanguages = [] } = resPT.data;
    if(!otherLanguages.length || !content.length) return;
    let list = [];
    otherLanguages.forEach(item => {
      content.forEach(subItem => {
        if(!subItem.value) return
        list.push({content: subItem, sourceLanguage: defaultLanguage, targetLanguage: item})
      })
    })
    let listClone = JSON.parse(JSON.stringify(list));
    const fn = p => translate(p.content.value, {from: p.sourceLanguage, to: p.targetLanguage});
    const actions = list.map(fn);
    Promise.all(actions).then(res => {
      let listSaveTranlate = [];
      listClone.forEach((item, index) => {
        if(!item.content.value){
          return
        }
        let obj = {};
        obj['locale'] = res[index].to
        obj['value'] = res[index].text
        obj['key'] = item.content.key
        obj['translatableContentDigest'] = item.content.digest
        listSaveTranlate.push(obj)
      })
      let dataForm = {
        id: productId,
        type: type,
        translations: listSaveTranlate
      }
      saveTranslate(dataForm, headers).then(resSave => {
        if(resSave.status){
          alert(resSave.message);
        }
      })
    });
  }
}

export{
  multipleTranslations
}