// document.writeln("<script type='text/javascript' src='./js/background-api.js'></script>");
let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

const CONSTANT = {
  GET_TABS: 'GET_TABS',
  SENDER_FROM_TAB: 'SENDER_FROM_TAB',
  UPDATE_TAB: 'UPDATE_TAB'
};

function listenTabs(request, sender, sendResponse) {
  try {
    const { type = '', tabId = null, options = {} } = request;

    switch (type) {
      case CONSTANT.GET_TABS:
        getTabs(options, sendResponse);
        break;
      case CONSTANT.SENDER_FROM_TAB:
        sendResponse(sender.tab);
        break;
      case CONSTANT.UPDATE_TAB:
        updateTab(tabId, options, sendResponse);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

function getTabs(options = {}, sendResponse = null) {
  return new Promise((resolve) =>
    chrome.tabs.query(options, (tabs) => {
      sendResponse ? sendResponse(tabs) : resolve(tabs);
    })
  );
}

function updateTab(tabId, options = {}, sendResponse = null) {
  return new Promise((resolve) => {
    chrome.tabs.update(tabId, options, (tabs) => {
      sendResponse ? sendResponse(tabs) : resolve(tabs);
    });
  });
}


function initListenerTab() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    listenTabs(request, sender, sendResponse);
  });
}

initListenerTab()

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("request", request)
  switch (request.contentScriptQuery) {
    case 'request':
      console.log("request oke")
      requestAPI(request.values.url).then((res) => {
        sendResponse(res);
      });
      break;
  }
  return true; // Will respond asynchronously.
});

async function requestAPI(url) {
  try {
    console.log("requestAPI", url, fetch)
    const result = await fetch(url, {
      method: 'GET',
    });
    console.log("result", result)
    if (result.status != 200) {
      return;
    }

    return result.text();
  } catch (error) {
    console.log("error", error)
    return;
    throw error;
  }
}