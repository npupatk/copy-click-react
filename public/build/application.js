console.log("In application.js");

function copyToClipboard(element) {
  console.log("In copyToClipboard()");
  var temp = $("<input>");
  $("body").append(temp);
  temp.val($(element).text()).select();
  document.execCommand("copy");
  temp.remove();
}
