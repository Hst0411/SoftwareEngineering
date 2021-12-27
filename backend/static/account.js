href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var accountNO, accountID;
var editAccount = 0;
$(document).ready(function () {
    $.ajax({
        url: '/account/get-docs?userID=user001',
        method: 'GET',
        dataType: 'json',
        success: function(account_data) {
            for(var i = 0; i < account_data.length; i++){
                var record = "";
                var table = document.getElementById("account_table");
                var row = table.insertRow(table.row);   //增加row
                row.style.background = "#FFD2D2";
                row.innerHTML = "<td id ="+ account_data[i]._id +"></td>"+
                "<td id='accountname'>" + account_data[i].accountName + "</td>" +
                "<td id='money'>"+ account_data[i].leftMoneyAmount +"</td>";
                if(account_data[i].transferRecord.length != 0){
                    for(var j = 0; j < account_data[i].transferRecord.length - 1; j++){
                        if(account_data[i].transferRecord[j].transferFromOrTo == "From"){
                            record += account_data[i].accountName+"轉了"+account_data[i].transferRecord[j].transferMoneyAmount+"元到"+
                            account_data[i].transferRecord[j].targetAccountName+" "+account_data[i].transferRecord[j].transferDate +"<br>";
                        }
                        else if(account_data[i].transferRecord[j].transferFromOrTo == "To"){
                            record += account_data[i].accountName+"轉了"+account_data[i].transferRecord[j].transferMoneyAmount+"元到"+
                            account_data[i].transferRecord[j].targetAccountName+" "+account_data[i].transferRecord[j].transferDate +"<br>";
                        }
                    }
                    for(var j = account_data[i].transferRecord.length - 1; j < account_data[i].transferRecord.length; j++){
                        if(account_data[i].transferRecord[j].transferFromOrTo == "From"){
                            record += account_data[i].accountName+"轉了"+account_data[i].transferRecord[j].transferMoneyAmount+"元到"+
                            account_data[i].transferRecord[j].targetAccountName+" "+account_data[i].transferRecord[j].transferDate;
                        }
                        else if(account_data[i].transferRecord[j].transferFromOrTo == "To"){
                            record += account_data[i].accountName+"轉了"+account_data[i].transferRecord[j].transferMoneyAmount+"元到"+
                            account_data[i].transferRecord[j].targetAccountName+" "+account_data[i].transferRecord[j].transferDate;
                        }
                    }
                }
                row.innerHTML += "<td id='transrecord'>"+ record +"</td><tr><button class='edit' onclick='account_edit(this)'>編輯</button>"+
                "<button class='delete' onclick='account_remind(this)'>刪除</button>"+
                "<a style='text-decoration:none;' href=transferrecord.html><button class='show' onclick='show_fransfer(this)'>轉帳紀錄</button></a></tr>";
            }
        }
    });
});

function addacount(){
    var table = document.getElementById("account_table");
    var row = table.insertRow(table.row);   //增加row
    row.style.background = "#FFD2D2";
    row.innerHTML = "<td id=''><button class='complete' onclick='account_complete(this)' style='width:65px;'>完成新增</button></td>"+
    "<td id='accountname'><input type='textbox' style='width:150px;height:26px;' placeholder='Ex : 悠遊卡'></td>" +
    "<td id='money'><input type='textbox' style='width:150px;height:26px;' placeholder='Ex : 500'></td>"+
    "<td id='transrecord'></td>"+
    "<tr><button class='edit' onclick='account_edit(this)'>編輯</button><button class='delete' onclick='account_remind(this)'>刪除</button>"+
    "<a style='text-decoration:none;' href=transferrecord.html><button class='show' onclick='show_fransfer(this)'>轉帳紀錄</button></a></tr>";
}
function account_remind(obj){
    document.getElementById("remind").style.display = "";
    accountNO = obj.parentNode.rowIndex;
    accountID = $(obj.parentNode.children[0]).attr("id");
}
function cancel(){
    document.getElementById("remind").style.display = "none";
}

function account_delete(){
    var table=document.getElementById("account_table");
	table.deleteRow(accountNO);                 //刪除第幾列
    document.getElementById("remind").style.display = "none";
    $.ajax({
        url: '/account/delete-doc?id='+ accountID +'&userID=user001',
        type: 'DELETE',
        success: function(result) {
            console.log(result);
        }
    });
}

function account_complete(obj){
    var account_name, account_money;
    obj.style.display="none";

    account_name = obj.parentNode.parentNode.cells[1].children[0].value;
    obj.parentNode.parentNode.cells[1].innerHTML = obj.parentNode.parentNode.cells[1].children[0].value;

    account_money = obj.parentNode.parentNode.cells[2].children[0].value;
    obj.parentNode.parentNode.cells[2].innerHTML = obj.parentNode.parentNode.cells[2].children[0].value;
    if(editAccount == 0){
        var data;
        data = {
            "userID": "user001",
            "accountName": account_name,
            "leftMoneyAmount": account_money
        }
        fetch('/account/insert-doc',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        })
    }
    else{
        accountID = $(obj.parentNode).attr("id");
        console.log(typeof(accountID));
        var data;
        data = {
            "id": accountID,
            "userID": "user001",
            "accountName": account_name
        }
        fetch('/account/update-doc',
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        })
        editAccount = 1;
    }
}
function account_edit(obj){
    editAccount = 1;
    var tmp = obj.parentNode.cells[1].innerHTML;
    obj.parentNode.cells[0].innerHTML = "<button class='complete' onclick=' account_complete(this)' style='width:65px;'>完成新增</button>";
    obj.parentNode.cells[1].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
    tmp = obj.parentNode.cells[2].innerHTML;
    obj.parentNode.cells[2].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
}
