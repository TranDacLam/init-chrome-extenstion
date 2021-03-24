export const fetchDataBackground = async function(contentScriptQuery,values = {}) {
  console.log("fetchDataBackground", contentScriptQuery, values)
  return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
              contentScriptQuery: contentScriptQuery,
              values: values
          },
          function (response) {
              resolve(response);
          }
      );
  });
}