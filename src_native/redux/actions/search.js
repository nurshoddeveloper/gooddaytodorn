import {
  SEARCH, SEARCH_CLEAR
} from '../constants';
import apiCall from '../../../src_web/src_web_changed/core/gd/data/api-call';


export function search(query) {
  console.log('search action');
  return {
    type: SEARCH,
    payload: apiCall(this, 'post', 'search/quick', {query})
    /*payload: new Promise((resolve, reject) => {
      apiCall(this, 'post', 'search/quick', {query})
        .then((data) => {
          resolve(data);
        })
        .catch(reject)
    })*/
  }
}


export function searchClear() {
  return {
    type: SEARCH_CLEAR,
  }
}