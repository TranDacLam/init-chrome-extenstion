import fetchApi from '../helpers/fetch-api';
import { GET_PRODUCT_TRANSLATE } from './../constants/api';

const URL_API = process.env.URL_API

export async function getProductTranslate(data = null, headers = {}) {
  try {
    let url = `${URL_API}/api/${GET_PRODUCT_TRANSLATE}`
    const result = await fetchApi.get(url, data, headers)
    return result;
  } catch (error) {
    console.log("error", error)
    return;
  }
}