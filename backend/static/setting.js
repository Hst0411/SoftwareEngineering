href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

function GetCurrencyValue(){
    var select = document.getElementById("Currencyvalue");
    var selectData = select.options[select.selectedIndex].value;
    console.log(selectData);
    $.ajax({
        url: '/currencyExchange/get-exchange-rate?targetCurrency='+selectData.toString()+'&jwt='+localStorage.getItem("JWT-token"),
        method: 'GET',
        dataType: 'json',
        success:function(currency){
            console.log(currency);
            localStorage.setItem('myCurrency', currency);
        }
    });
    alert("貨幣轉換成功!");
}

function json2csv(){
    $.ajax({
        url: 'record/get-csv?',
        method: 'GET',
        dataType: 'json',
        success: function(target) {
            var final='帳戶,預算,類別,支出,金額,日期\n';
            for(var i=0;i<target.length;i++){
                final+=target[i].accountName+',';
                if(target[i].budgetName==null){
                    final+='無,';
                }
                else{
                    final+=target[i].budgetName+',';
                }
                final+=target[i].category+',';
                final+=target[i].incomeOrExpense+',';
                final+=target[i].moneyAmount+',';
                final+=target[i].date+',';
                final+='\n';
           }
           let filename='csv檔_'+(new Date()).getTime()+'.csv';
           let link = document.createElement('a');
            link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(final));
            link.setAttribute('download', filename);
            link.click();
        }
    });
   
}
