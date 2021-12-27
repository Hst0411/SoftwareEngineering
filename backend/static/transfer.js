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
    console.log(year);
    console.log(month);
    console.log(day);
    console.log(date);
    console.log(minute);

    /*var data;
        data = {
            "userID": "user001",
            "accountName": "我的錢包",
            "transferFromOrTo": "From",
            "targetAccountName": "中華郵政",
            "transferDate": {
                "year": 2021,
                "month": 12,
                "day": 25,
                "hour": 20,
                "minute": 10
            },
            "transferMoneyAmount": 666
        }
        fetch('http://172.20.10.3:9000/account/transfer/post-doc',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        })*/
    alert("轉帳成功!");
}