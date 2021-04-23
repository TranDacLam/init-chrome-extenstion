import { multipleTranslations } from './transcy';

window.addEventListener("message", event => {
  if (event.source != window) return;
  const {
    data: { 
      typeMessage = "", 
      data = null
    }
  } = event;

  console.log("INIT APP");

  typeMessage == "transcy" && multipleTranslations({data});
}, false );

(function() {
  const extTag = document.createElement("div");
  const extId = chrome.runtime.id;
  extTag.setAttribute('id', 'transcy-extension');
  extTag.setAttribute('data-extension-id', extId);
  document.body.appendChild(extTag);
})()