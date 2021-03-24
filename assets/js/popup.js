import translate from './translate';
// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {

  console.log("Click");


  let text = "Hiện Hùng Dũng đã hồi tỉnh sau ca mổ, sức khỏe ổn nhưng còn mệt nên Hùng Dũng không nói gì nhiều. Dự kiến anh tiếp tục nằm tại bệnh viện cho tới 13h30 hôm nay trước khi được xuất viện, tuy nhiên Dũng sẽ còn ở lại TP. HCM trong 3 ngày trước khi được chuyển ra Hà Nội để bắt đầu hồi phục.";
  console.log("text11", text)
  translate(text,
  {
    from: 'vi',
    to: 'en'
  });

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
