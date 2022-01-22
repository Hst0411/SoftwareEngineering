href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var category, name, budget;
var date_start, date_end;
var budgetNO, budgetID;
var editBudget = 0;
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
    console.log(currency);
    console.log(currencyName);
    document.getElementById("currencyValue").innerHTML = "當下幣值為<strong><span style='color:red;'>"+
    currencyName +"</span></strong>";
    $.ajax({
        url: '/budget/get-docs?'+'jwt='+localStorage.getItem("JWT-token"),
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data)
            for(var i = 0; i < data.length; i++){
                var s = new Date(data[i].startDate);
                var e = new Date(data[i].endDate);
                console.log(typeof(data[i].overSpend));
                console.log(s.getDate());
                var table = document.getElementById("budget_table");
                var row = table.insertRow(table.row);   //增加row
                row.style.background = "rgb(199, 253, 255)";
                row.innerHTML = "<td id ="+ data[i]._id +"></td>"+
                "<td id='budgetName'>" + data[i].budgetName + "</td>" +
                "<td id='startDate'>" + s.getFullYear() + "/"+ (s.getMonth() + 1) +"/" + s.getDate() + "</td>"+
                "<td id='endDate'>" + e.getFullYear() + "/"+ (e.getMonth()+1)+"/" + e.getDate() + "</td>" +
                "<td id='targetMoneyAmount'>" + (data[i].targetMoneyAmount/currency).toFixed(2) + "</td>";
                if(data[i].overSpend == true){
                    row.innerHTML+="<td id='overSpend'><span style='color:red;font-size: 18px;font-weight: bolder;'>是</span></td>" +
                    "<td id='usedMoneyAmount'>" + (data[i].usedMoneyAmount/currency).toFixed(2) + "</td>" +
                    "<tr><button class='edit' onclick='edit_budget(this)'>編輯</button>" +
                    "<button class='delete' onclick='budget_remind(this)'>刪除</button></tr>";
                }else{
                    row.innerHTML+="<td id='overSpend'>否</td>" +
                    "<td id='usedMoneyAmount'>" + (data[i].usedMoneyAmount/currency).toFixed(2) + "</td>" +
                    "<tr><button class='edit' onclick='edit_budget(this)'>編輯</button>" +
                    "<button class='delete' onclick='budget_remind(this)'>刪除</button></tr>";
                }
            }
        }
    });
});

function add_budget() {
    var table = document.getElementById("budget_table");
    var row = table.insertRow(table.row);
    row.style.background = "rgb(199, 253, 255)";
    row.innerHTML = "<td id=''><button class='complete' onclick='complete_fill(this)' style='width:65px;'>完成新增</button></td>" +
        "<td id='budgetName'><input type='textbox' style='width:100px;height:27px;margin:7px' placeholder='Ex : 娛樂'></td>" +
        "<td id='startDate'><input type='date' style='width:130px;height:27px;margin:7px;'></td>" +
        "<td id='endDate'><input type='date' style='width:130px;height:27px;margin:7px;'></td>" +
        "<td id='targetMoneyAmount'><input type='textbox' style='width:100px;height:27px;margin:7px' placeholder='Ex : 10000'></td>" +
        "<td id ='overSpend'>否</td>" +
        "<td id ='usedMoneyAmount'>0</td>"+
        "<tr><button class='edit' onclick='edit_budget(this)'>編輯</button>" +
        "<button class='delete' onclick='budget_remind(this)'>刪除</button></tr>";
}

function delete_budget() {
    var table = document.getElementById("budget_table");
    document.getElementById("budget_remind").style.display = "none";
    $.ajax({
        url: '/budget/delete-doc?id='+ budgetID+'&jwt='+localStorage.getItem("JWT-token"),
        type: 'DELETE',
        success: function(result) {
            console.log(result);
        }
    });
    table.deleteRow(budgetNO);         //刪除第幾列
}

function budget_remind(obj) {
    document.getElementById("budget_remind").style.display = "";
    budgetNO = obj.parentNode.rowIndex;
    budgetID = $(obj.parentNode.children[0]).attr("id");
}

function cancel() {
    document.getElementById("budget_remind").style.display = "none";
}

function complete_fill(obj){
    set_text(obj);
}

function set_text(obj)
{
    var budgetName = obj.parentNode.parentNode.cells[1].children[0].value;
    obj.parentNode.parentNode.cells[1].innerHTML = obj.parentNode.parentNode.cells[1].children[0].value;
    var sDay="",eDay="";
    obj.style.display="none";
    for(var i = 0; i < 10; i++){
        if(i == 4 || i == 7){
            sDay += "/";
            eDay += "/";
        }else{
            sDay += obj.parentNode.parentNode.cells[2].children[0].value[i];
            eDay += obj.parentNode.parentNode.cells[3].children[0].value[i];
        }
    }
    obj.parentNode.parentNode.cells[2].innerHTML = sDay;
    obj.parentNode.parentNode.cells[3].innerHTML = eDay;
    console.log(obj.parentNode.parentNode.cells[2].innerHTML);
    console.log(obj.parentNode.parentNode.cells[3].innerHTML)
    obj.parentNode.parentNode.cells[4].innerHTML = obj.parentNode.parentNode.cells[4].children[0].value;
    var year="", month = [0, 1], day = [0, 1];
    if(obj.parentNode.parentNode.cells[2].innerHTML[5] == 0){
        month[0] = obj.parentNode.parentNode.cells[2].innerHTML[6];
    }
    else{
        month[0] = obj.parentNode.parentNode.cells[2].innerHTML[5] + obj.parentNode.parentNode.cells[2].innerHTML[6];
    }
    if(obj.parentNode.parentNode.cells[2].innerHTML[8] == 0){
        day[0] = obj.parentNode.parentNode.cells[2].innerHTML[9];
    }
    else{
        day[0] = obj.parentNode.parentNode.cells[2].innerHTML[8] + obj.parentNode.parentNode.cells[2].innerHTML[9];
    }
    if(obj.parentNode.parentNode.cells[3].innerHTML[5] == 0){
        month[1] = obj.parentNode.parentNode.cells[3].innerHTML[6];
    }
    else{
        month[1] = obj.parentNode.parentNode.cells[3].innerHTML[5] + obj.parentNode.parentNode.cells[3].innerHTML[6];
    }
    if(obj.parentNode.parentNode.cells[3].innerHTML[8] == 0){
        day[1] = obj.parentNode.parentNode.cells[3].innerHTML[9];
    }
    else{
        day[1] = obj.parentNode.parentNode.cells[3].innerHTML[8] + obj.parentNode.parentNode.cells[3].innerHTML[9];
    }
    for(var i=0;i<4;i++){
        year+=obj.parentNode.parentNode.cells[2].innerHTML[i];
    }
    if(editBudget==0){
        var data;
        data = {
            "userID":"user001",
            "budgetName":budgetName,
            "startDate":{
                "year": parseInt(year),
                "month": parseInt(month[0]),
                "day": parseInt(day[0])
            },
            "endDate":{
                "year": parseInt(year),
                "month": parseInt(month[1]),
                "day": parseInt(day[1])
            },
            "targetMoneyAmount":parseInt(obj.parentNode.parentNode.cells[4].innerHTML*currency)
        }
        fetch('/budget/insert-doc',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem("JWT-token")
                },
                body: JSON.stringify(data),
                error: function(warn){
                    window.alert("輸入不可為空白")
                }
        })
        console.log(data);
        $.ajax({
            url: '/budget/get-docs?'+'jwt='+localStorage.getItem("JWT-token"),
            method: 'GET',
            dataType: 'json',
            success: function(budget_data) {
                console.log(budget_data);
                $(obj.parentNode).attr("id", budget_data[0]._id);
            }
        });
    }
    else{
        var data;
        budgetID = $(obj.parentNode).attr("id");
        console.log(budgetID);
        console.log(budgetName);
        data = {
            "userID":"user001",
            "budgetName":budgetName,
            "id":budgetID,
            "startDate":{
                "year": parseInt(year),
                "month": parseInt(month[0]),
                "day": parseInt(day[0])
            },
            "endDate":{
                "year": parseInt(year),
                "month": parseInt(month[1]),
                "day": parseInt(day[1])
            },
            "targetMoneyAmount":parseInt(obj.parentNode.parentNode.cells[4].innerHTML)
        }
        console.log(data)
        fetch('/budget/update-doc',
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem("JWT-token")
                },
                body: JSON.stringify(data)
        })
        editBudget = 0;
    }
}

function edit_budget(obj)
{
    editBudget = 1;
    console.log(obj.parentNode.cells[1].innerHTML);
    var tmp = obj.parentNode.cells[1].innerHTML;
    obj.parentNode.cells[0].innerHTML = "<button class='complete' onclick='complete_fill(this)' style='width:65px;'>完成新增</button>";
    obj.parentNode.cells[1].innerHTML = "<input type='textbox' style='width:100px;height:26px;margin:7px' value="+tmp+">";
    tmp = obj.parentNode.cells[2].innerHTML;
    obj.parentNode.cells[2].innerHTML = "<input type='date' id='startDate' style='width:130px;height:27px;margin:7px;'>";
    tmp = obj.parentNode.cells[3].innerHTML;
    obj.parentNode.cells[3].innerHTML = "<input type='date' id='endDate' style='width:130px;height:27px;margin:7px;'>";
    tmp = obj.parentNode.cells[4].innerHTML;
    obj.parentNode.cells[4].innerHTML = "<input type='textbox' style='width:100px;height:26px;margin:7px;' placeholder='Ex : 10000' value="+tmp+">";
}
