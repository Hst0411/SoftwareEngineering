href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var year, month, day;
var hour, minute;
var currency = 1;
$(document).ready(function () {
    $.ajax({
        url: '/account/get-name?'+'jwt='+localStorage.getItem("JWT-token"),
        method: 'GET',
        dataType: 'json',
        success: function(account_name) {
            var two = 2, select;
            while(two > 0){
                if(two==2){
                    select = document.getElementById("accountname");
                }else{
                    select = document.getElementById("accountname2");
                }
                for(var i = 0; i < account_name.length; i++){
                    var option = document.createElement("option");
                    option.appendChild(document.createTextNode(account_name[i]));
                    select.appendChild(option);
                }
                two-=1;
            }
        }
    })
  });

function transfer(){
    if(localStorage.getItem('myCurrency') == null){
        currency = 1;
    }
    else{
        currency = localStorage.getItem('myCurrency');
    }
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
    var send = document.getElementById("accountname").value
    var from_account = document.getElementById("accountname2").value;
    var from_index = document.getElementById("accountname2").selectedIndex;
    var from_name = document.getElementById("accountname2").options[from_index].value;
    var to_account = document.getElementById("accountname").value;
    var to_index = document.getElementById("accountname").selectedIndex;
    var to_name = document.getElementById("accountname").options[to_index].value;
    var account_money;
    var send_money;
    $.ajax({
        url: '/account/get-docs?'+'jwt='+localStorage.getItem("JWT-token"),
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
            if(from_name != to_name){
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
                        "transferMoneyAmount": parseInt(send_money*currency)
                    }
                    fetch('/account/transfer/post-doc',
                        {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+localStorage.getItem("JWT-token")
                            },
                            body: JSON.stringify(data)
                    })
                    alert("轉帳成功!");
                    console.log(data);
                    self.location = "account.html";
                }
                else if(account_money < send_money){
                    alert("轉帳金額不可高於帳戶金額!!!")
                }
                else{
                    alert("金額不可為空!!!")
                }
            }
            else{
                alert("寄錢帳戶不可與收錢帳戶相同!!!");
            }
        }
    })
    
}