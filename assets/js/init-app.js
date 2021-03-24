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

  console.log("INIT APP", event)

  typeMessage == "transcy" && translate(text, options);
}, false );