href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var bar_url = "test.html"
var currency = 1, currencyName;
$(document).ready(function () {
  if(localStorage.getItem('myCurrency') == null){
    currency = 1;
    currencyName = "TWD";
  }
  else{
      currency = localStorage.getItem('myCurrency');
      currencyName = localStorage.getItem('myCurrencyName');
  }
  document.getElementById("currencyValue").innerHTML = "當下幣值為<strong><span style='color:red;'>"+
  currencyName +"</span></strong>";
});
function show_bar()
{
    href = "bar_url"
}