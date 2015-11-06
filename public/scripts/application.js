// console.log("In application.js");

function copyToClipboard(element) {
  console.log("In copyToClipboard()");
  var tempInputField = $("<input>");
  $("body").append(tempInputField);
  tempInputField.val($(element).text()).select();
  document.execCommand("copy");
  // tempInputField.remove();
}


