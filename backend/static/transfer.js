href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var year, month, day;
var hour, minute;
function transfer(){
    var date;
    date = new Date();
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();

    if(date.getUTCHours() < 10){
        hour = "0" + date.getUTCHours();
    }else{
        hour = date.getUTCHours();
    }
    if(date.getUTCMinutes() < 10){
        minute = "0" + date.getUTCMinutes();
    }else{
        minute = date.getUTCMinutes();
    }
    console.log(typeof(year));
    console.log(month);
    console.log(day);
    console.log(hour);
    console.log(minute);
    console.log(typeof(document.getElementById("accountname").value));
    var send = document.getElementById("accountname").value
    var account_money;
    var send_money;
    $.ajax({
        url: '/account/get-docs?userID=user001',
        method: 'GET',
        dataType: 'json',
        success: function(account_data) {
            for(var i = 0; i < account_data.length; i++){
                if(account_data[i].accountName == send){
                    account_money = account_data[i].leftMoneyAmount;
                }
            }
            send_money = parseInt(document.getElementById("money").value);
            if(account_money >= send_money){
                var data;
                data = {
                    "userID": "user001",
                    "accountName": document.getElementById("accountname2").value,
                    "transferFromOrTo": "From",
                    "targetAccountName": document.getElementById("accountname").value,
                    "transferDate": {
                        "year": parseInt(year),
                        "month": parseInt(month),
                        "day": parseInt(day),
                        "hour": parseInt(hour+8),
                        "minute": parseInt(minute)
                    },
                    "transferMoneyAmount": parseInt(document.getElementById("money").value)
                }
                fetch('/account/transfer/post-doc',
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                })
                alert("轉帳成功!");
            }else{
                alert("轉帳金額不可高於帳戶金額!!!")
            }
        }
    })
    
}