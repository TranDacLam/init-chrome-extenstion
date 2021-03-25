chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#3aa757' });
  console.log('onInstalled');
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case 'request-api':
      requestAPI(request.values.url, request.values.options, request.values.typeResponse).then((res) => {
        sendResponse(res);
      });
      break;
  }
  return true; // Will respond asynchronously.
});

async function requestAPI(url, options = {}, typeResponse = '') {
  try {
    const { 
      method = 'GET',
      credentials = 'same-origin', 
      redirect = 'manual', 
      body = null,
      cache = 'default',
      mode = 'cors'
    } = options;

    const result = await fetch(url, {
      method,
      mode,
      cache,
      credentials,
      redirect,
      body: body ? JSON.stringify(body) : null
    });

    console.log("result", result)

    if (result.status != 200) {
      return;
    }

    if(typeResponse == 'text'){
      return result.text();
    }

    return result.json();

  } catch (error) {
    console.log("error", error)
    return;
  }
}