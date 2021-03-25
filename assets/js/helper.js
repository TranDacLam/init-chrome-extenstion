export const fetchDataBackground = async function(type, values = {}) {
  return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
					type,
					values
				},
				function (response) {
					resolve(response);
				}
      );
  });
}