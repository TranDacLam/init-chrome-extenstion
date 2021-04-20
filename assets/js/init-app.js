import translate from './translate';

window.addEventListener("message", event => {
  if (event.source != window) return;
  const {
    data: { 
      typeMessage = "", 
      text = "",
      options = null
    }
  } = event;

  console.log("INIT APP", event.data)

  typeMessage == "transcy" && translate(text, options);
}, false );

(function() {
  const extTag = document.createElement("div");
  const extId = chrome.runtime.id;
  extTag.setAttribute('id', 'transcy-extension');
  extTag.setAttribute('data-extension-id', extId);
  document.body.appendChild(extTag);
})()