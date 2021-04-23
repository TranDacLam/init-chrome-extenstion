import fetchApi from '../helpers/fetch-api';
import { SAVE_CONTENT_TRANSLATE } from './../constants/api';

const URL_API = process.env.URL_API

export async function saveTranslate(data = null, headers = {}) {
  try {
    let url = `${URL_API}/api/${SAVE_CONTENT_TRANSLATE}`
    const result = await fetchApi.post(url, data, headers)
    return result;
  } catch (error) {
    console.log("error", error)
    return;
  }
}