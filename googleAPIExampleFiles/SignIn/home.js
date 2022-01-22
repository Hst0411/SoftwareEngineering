href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var USERID;
var chosen_year, chosen_month, chosen_day;
var incomeNO, expenseNO;
var close = 0;
//初始化
$(document).ready(function () {
    //日期
    var date, day, month, year, today;
    date = new Date();
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    today = date.getFullYear() + "-" + month + "-" + day;
    $('#date').val(today);
    document.getElementById("todaydate").innerHTML = "日期 : " + today;
    //支出
    $.ajax({
        url: 'http://172.20.10.3:9000/record/get-docs?userID=user002&incomeOrExpense=支出&year=2021&month=12&day=7',
        method: 'GET',
        dataType: 'json',
        success: function(expense_data) {
            console.log(expense_data);
            //console.log(getHour(expense_data[i].date));
            for(var i = 0; i < expense_data.length; i++){
                var d = new Date(expense_data[i].date);
                var hr, min;
                if(d.getUTCHours() < 10){
                    hr = "0" + d.getUTCHours();
                }else{
                    hr = d.getUTCHours();
                }
                if(d.getUTCMinutes() < 10){
                    min = "0" + d.getUTCMinutes();
                }else{
                    min = d.getUTCMinutes();
                }
                var table = document.getElementById("expense_table");
                var row = table.insertRow(table.row);   //增加row
                row.style.background = "#FFD2D2";
                row.innerHTML = "<td id='"+ expense_data[i]._id + "'></td>"+
                "<td id='name'>" + expense_data[i].name + "</td>" +
                "<td id='price'>" + expense_data[i].moneyAmount + "</td>"+
                "<td id='account'>" + expense_data[i].accountName + "</td>"+
                "<td id='type'>" + expense_data[i].category + "</td>" +
                "<td id='budget'>" + expense_data[i].budgetName + "</td>" +
                "<td id='time'>" + hr + ":" + min + "</td>" +
                "<tr><button class='edit' id='edit' onclick='edit_expense(this)'>編輯</button>" +
                "<button class='delete' onclick='expense_remind(this)'>刪除</button></tr>";
            }
            USERID = expense_data[0].userID;
            //console.log(USERID);
        }
    });
    //收入
    $.ajax({
        url: 'http://172.20.10.3:9000/record/get-docs?userID=user002&incomeOrExpense=收入&year=2021&month=12&day=7',
        method: 'GET',
        dataType: 'json',
        success: function(income_data) {
            console.log(income_data);
            for(var i = 0; i < income_data.length; i++){
                var d = new Date(income_data[i].date);
                var hr, min;
                if(d.getUTCHours() < 10){
                    hr = "0" + d.getUTCHours();
                }else{
                    hr = d.getUTCHours();
                }
                if(d.getUTCMinutes() < 10){
                    min = "0" + d.getUTCMinutes();
                }else{
                    min = d.getUTCMinutes();
                }
                var table = document.getElementById("income_table");
                var row = table.insertRow(table.row);   //增加row
                row.style.background = "#CAFFFF";
                row.innerHTML = "<td id='"+ income_data[i]._id + "'></td>" + 
                "<td id='account'>" + income_data[i].accountName + "</td>" + 
                "<td id='type'>" + income_data[i].category + "</td>" +
                "<td id='time'>" + hr + ":" + min + "</td>"+
                "<td id='price'>" + income_data[i].moneyAmount + "</td>"+
                "<td></td>" +
                "<td></td>" +
                "<tr><button class='edit' onclick='edit_income(this)' style='top:2px;position:relative;'>編輯</button>" +
                "<button class='delete' onclick='income_remind(this)' style='top:2px;position:relative;'>刪除</button></tr>";
            }
        }
    });
});

//日曆
function calendar(){
    //取得當下選擇的日期
    var datecontrol = document.querySelector('input[type = "date"]');
    var chosendate = datecontrol.value;
    chosen_year = chosendate[0] + chosendate[1] + chosendate[2] + chosendate[3];
    chosen_month = chosendate[5] + chosendate[6];
    chosen_day = chosendate[8] + chosendate[9];
    document.getElementById("todaydate").innerHTML = "日期 : " + chosendate;
}
//記一筆
function add(){
    document.getElementById("expenseorincome").style.display = "";
    close=1;
}
//新增支出
function add_expense(){
    document.getElementById("expenseorincome").style.display = "none";
    var table = document.getElementById("expense_table");
    var row = table.insertRow(table.row);   //增加row
    row.style.background = "#FFD2D2";
    row.innerHTML = "<td><button class='complete' onclick='complete_expense(this)' style='width:65px;'>完成新增</button></td>"+
    "<td id='name'><input type='textbox' style='width:100px;height:23px;margin:7px;' placeholder='Ex : 早餐'></td>" +
    "<td id='price'><input type='textbox' style='width:100px;height:23px;margin:7px;' placeholder='Ex : 50'></td>";
    row.innerHTML += "<td id='account'><select style='width:100px;margin:7px;'><option>錢包</option><option>悠遊卡</option><option>郵局</option><option>台灣銀行</option></select></td>"+
    "<td id='type'><input type='textbox' style='width:100px;height:23px;margin:7px;' placeholder='Ex : 飲食'></td>" +
    "<td id='budget'><select style='width:100px;margin:7px;'><option>飲食</option><option>交通</option><option>娛樂</option><option></option></select></td>" +
    "<td id='time'><input type='time'style='width:130px;height:23px;margin:7px;'></td>" +
    "<tr><button class='edit' id='edit' onclick='edit_expense(this)'>編輯</button>" +
    "<button class='delete' onclick='expense_remind(this)'>刪除</button></tr>";
}
//刪除支出
function delete_expense(){
    var table=document.getElementById("expense_table");
	table.deleteRow(expenseNO);         //刪除第幾列
    document.getElementById("expense_remind").style.display = "none";
}
//新增收入
function add_income(){
    document.getElementById("expenseorincome").style.display = "none";
    var table = document.getElementById("income_table");
    var row = table.insertRow(table.row);   //增加row
    row.style.background = "#CAFFFF";
    row.innerHTML = "<td><button class='complete' onclick='complete_income(this)' style='width:65px;'>完成新增</button></td>";
    row.innerHTML += "<td id='account'><select style='width:100px;margin:7px;'><option>錢包</option><option>悠遊卡</option><option>郵局</option><option>台灣銀行</option></select></td>" + 
    "<td id='type'><input type='textbox' style='width:100px;height:23px;margin:7px;' placeholder='Ex : 薪水'></td>" +
    "<td id='time'><input type='time'style='width:130px;height:23px;margin:7px;'></td>"+
    "<td id='price'><input type='textbox' style='width:100px;height:23px;margin:7px;' placeholder='Ex : 50'></td>"+
    "<td></td>" +
    "<td></td>" +
    "<tr><button class='edit' onclick='edit_income(this)' style='top:2px;position:relative;'>編輯</button>" +
    "<button class='delete' onclick='income_remind(this)' style='top:2px;position:relative;'>刪除</button></tr>";
}
//刪除收入
function delete_income(){
    var table=document.getElementById("income_table");
	table.deleteRow(incomeNO);                 //刪除第幾列
    document.getElementById("income_remind").style.display = "none";
}
//刪除支出提醒
function expense_remind(obj){
    document.getElementById("expense_remind").style.display = "";
    close=1;    //框框要關了
    expenseNO = obj.parentNode.rowIndex;
}
//刪除收入提醒
function income_remind(obj){
    document.getElementById("income_remind").style.display = "";
    close=1;    //框框要關了
    incomeNO = obj.parentNode.rowIndex;
}
//取消提醒
function cancel(){
    document.getElementById("expense_remind").style.display = "none";
    document.getElementById("income_remind").style.display = "none";
}
//編輯支出
function edit_expense(obj){
    //obj.style.display="none";
    console.log(obj.parentNode.cells[1].innerHTML);
    var tmp = obj.parentNode.cells[1].innerHTML;
    obj.parentNode.cells[0].innerHTML = "<button class='complete' onclick='complete_expense(this)' style='width:65px;'>完成新增</button>";
    obj.parentNode.cells[1].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
    tmp = obj.parentNode.cells[2].innerHTML;
    obj.parentNode.cells[2].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
    tmp = obj.parentNode.cells[3].innerHTML;
    console.log(tmp);
    obj.parentNode.cells[3].innerHTML = "<select id='account' style='width:100px;margin:7px;'><option>"+tmp+"</option>"+
    "<option></option><option></option><option></option></select>";
    tmp = obj.parentNode.cells[4].innerHTML;
    obj.parentNode.cells[4].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
    tmp = obj.parentNode.cells[5].innerHTML;
    obj.parentNode.cells[5].innerHTML = "<select id='budget' style='width:100px;margin:7px;'><option>"+tmp+"</option>"+
    "<option>交通</option><option>娛樂</option><option></option></select>";
    tmp = obj.parentNode.cells[6].innerHTML;
    obj.parentNode.cells[6].innerHTML = "<input type='time' style='width:130px;height:23px;margin:7px;' value="+tmp+">";
}
//編輯收入
function edit_income(obj){
    var tmp = obj.parentNode.cells[4].innerHTML;
    //console.log(tmp);
    obj.parentNode.cells[0].innerHTML = "<button class='complete' onclick='complete_expense(this)' style='width:65px;'>完成新增</button>";
    obj.parentNode.cells[4].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
    tmp = obj.parentNode.cells[1].innerHTML;
    obj.parentNode.cells[1].innerHTML = "<select id='account' style='width:100px;margin:7px;'><option>"+tmp+"</option>"+
    "<option></option><option></option><option></option></select>";
    tmp = obj.parentNode.cells[2].innerHTML;
    obj.parentNode.cells[2].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
    tmp = obj.parentNode.cells[3].innerHTML;
    obj.parentNode.cells[3].innerHTML = "<input type='time' style='width:130px;height:23px;margin:7px;' value="+tmp+">";
}
//框框點擊空白關閉
function everytableclose(){
    if(close==1){
        document.getElementById("expenseorincome").style.display = "none";
        document.getElementById("expense_remind").style.display = "none";
        document.getElementById("income_remind").style.display = "none";
        close=0;
    }
}
//完成新增支出
function complete_expense(obj){
    //document.getElementById("edit").style.display="";
    obj.style.display="none";
    //console.log(obj.parentNode.parentNode.cells[1]);
    obj.parentNode.parentNode.cells[1].innerHTML = obj.parentNode.parentNode.cells[1].children[0].value;
    obj.parentNode.parentNode.cells[2].innerHTML = obj.parentNode.parentNode.cells[2].children[0].value;
    obj.parentNode.parentNode.cells[3].innerHTML = obj.parentNode.parentNode.cells[3].children[0].value;
    obj.parentNode.parentNode.cells[4].innerHTML = obj.parentNode.parentNode.cells[4].children[0].value;
    obj.parentNode.parentNode.cells[5].innerHTML = obj.parentNode.parentNode.cells[5].children[0].value;
    obj.parentNode.parentNode.cells[6].innerHTML = obj.parentNode.parentNode.cells[6].children[0].value;
    console.log(obj.parentNode.parentNode.cells[6].innerHTML);
    /*$.ajax({
        url: 'http://172.20.10.3:9000/record/insert-doc',
        method: 'POST',
        dataType: 'json',
        data :{
            "userID": "USERID",
            "accountName": "obj.parentNode.parentNode.cells[3].innerHTML",
            "budgetName": "obj.parentNode.parentNode.cells[5].innerHTML",
            "category": "obj.parentNode.parentNode.cells[4].innerHTML",
            "date":{
                "year":"chosen_year",
                "month":"chosen_month",
                "day":"chosen_day",
                "hour":5,
                "minute":40
            },
            "incomeOrExpense": "支出",
            "moneyAmount": "obj.parentNode.parentNode.cells[2].innerHTML",
            "name": "obj.parentNode.parentNode.cells[1].innerHTML"
        },
        success: function(data) {
            console.log(data);
        }
    });*/
}
//完成新增收入
function complete_income(obj){
    obj.style.display="none";
    console.log(obj.parentNode.parentNode.cells[4]);
    obj.parentNode.parentNode.cells[4].innerHTML = obj.parentNode.parentNode.cells[4].children[0].value;
    obj.parentNode.parentNode.cells[1].innerHTML = obj.parentNode.parentNode.cells[1].children[0].value;
    obj.parentNode.parentNode.cells[2].innerHTML = obj.parentNode.parentNode.cells[2].children[0].value;
    obj.parentNode.parentNode.cells[3].innerHTML = obj.parentNode.parentNode.cells[3].children[0].value;
    /*$.ajax({
        url: 'http://172.20.10.3:9000/record/insert-doc',
        method: 'POST',
        dataType: 'json',
        data :{
            "userID": "USERID",
            "accountName": "obj.parentNode.parentNode.cells[1].innerHTML",
            "budgetName": null,
            "category": "obj.parentNode.parentNode.cells[2].innerHTML",
            "date":{
                "year": "chosen_year",
                "month":"chosen_month",
                "day":"chosen_day",
                "hour":5,
                "minute":40
            },
            "incomeOrExpense": "收入",
            "moneyAmount": "obj.parentNode.parentNode.cells[4].innerHTML",
            "name": null
        },
        success: function(data) {
            console.log(data);
        }
    });*/
}