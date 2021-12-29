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
    console.log(date.getHours())
    if(date.getHours() < 10){
        hour = "0" + date.getHours();
    }else{
        hour = date.getHours();
    }
    if(date.getUTCMinutes() < 10){
        minute = "0" + date.getMinutes();
    }else{
        minute = date.getUTCMinutes();
    }
    console.log(typeof(year));
    console.log(month);
    console.log(day);
    console.log(hour);
    console.log(minute);
    var send = document.getElementById("accountname").value
    var from_account = document.getElementById("accountname2").value;
    var to_account = document.getElementById("accountname").value;
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
            console.log(account_money);
            console.log(send_money);
            console.log(document.getElementById("accountname").value);
            console.log(document.getElementById("accountname2").value);
            if(account_money >= send_money){
                var data;
                data = {
                    "userID": "user001",
                    "accountName": from_account,
                    "transferFromOrTo": "From",
                    "targetAccountName": to_account,
                    "transferDate": {
                        "year": parseInt(year),
                        "month": parseInt(month),
                        "day": parseInt(day),
                        "hour": parseInt(hour),
                        "minute": parseInt(minute)
                    },
                    "transferMoneyAmount": parseInt(send_money)
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
                console.log(data);
            }else{
                alert("轉帳金額不可高於帳戶金額!!!")
            }
        }
    })
    
}