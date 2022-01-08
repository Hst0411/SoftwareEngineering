href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

function GetCurrencyValue(){
    var select = document.getElementById("Currencyvalue");
    var selectData = select.options[select.selectedIndex].value;
    console.log(selectData);
    $.ajax({
        url: '/currencyExchange/get-exchange-rate?targetCurrency='+selectData.toString()+'',
        method: 'GET',
        dataType: 'json',
        success:function(currency){
            console.log(currency);
            localStorage.setItem('myCurrency', currency);
        }
    });
    alert("貨幣轉換成功!");
}