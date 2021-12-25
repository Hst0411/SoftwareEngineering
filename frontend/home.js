href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var USERID;
var year, month, day;
var expenseNO, incomeNO, expenseID, incomeID;
var editExpense = 0, editIncome = 0;   //沒有edit
var close = 0;
var expense_type, income_type;
var expense_budget;
//初始化
$(document).ready(function () {
    //日期
    var date, today;
    date = new Date();
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    today = date.getFullYear() + "-" + month + "-" + day;
    $('#date').val(today);
    document.getElementById("todaydate").innerHTML = "日期 : " + today;
    console.log(year);
    console.log(month);
    console.log(day);
    //支出
    GetExpenseData();
    //收入
    GetIncomeData();
});
function GetExpenseData(){
    $.ajax({
        url: 'http://172.20.10.3:9000/record/get-docs?userID=user002&incomeOrExpense=支出&year='+year.toString()+'&month='+month.toString()+'&day='+day.toString()+'',
        method: 'GET',
        dataType: 'json',
        success: function(expense_data) {
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
                row.innerHTML = "<td id ="+ expense_data[i]._id +"></td>"+
                "<td id='name'>" + expense_data[i].name + "</td>" +
                "<td id='price'>" + expense_data[i].moneyAmount + "</td>"+
                "<td id='account'>" + expense_data[i].accountName + "</td>"+
                "<td id='type'>" + expense_data[i].category + "</td>" +
                "<td id='budget'>" + expense_data[i].budgetName + "</td>" +
                "<td id='time'>" + hr + ":" + min + "</td>" +
                "<tr><button class='edit' onclick='edit_expense(this)'>編輯</button>" +
                "<button class='delete' onclick='expense_remind(this)'>刪除</button></tr>";
            }
            //console.log(USERID);
        }
    });
}
function GetIncomeData(){
    $.ajax({
        url: 'http://172.20.10.3:9000/record/get-docs?userID=user002&incomeOrExpense=收入&year='+year.toString()+'&month='+month.toString()+'&day='+day.toString()+'',
        method: 'GET',
        dataType: 'json',
        success: function(income_data) {
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
                row.innerHTML = "<td id ="+ income_data[i]._id +"></td>" + 
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
}
function GetExpenseCategory(){
    $.ajax({
        url: 'http://172.20.10.3:9000/recordCategory/get-docs?userID=user001&incomeOrExpense=支出',
        method: 'GET',
        dataType: 'json',
        success: function(expense_data) {
            var select = document.getElementById("expenseType");
            for(var i = 0; i < expense_data.length; i++){
                var option = document.createElement("option");
                option.appendChild(document.createTextNode(expense_data[i]));
                select.appendChild(option);
            }
        }
    });
}
function GetIncomeCategory(){
    $.ajax({
        url: 'http://172.20.10.3:9000/recordCategory/get-docs?userID=user001&incomeOrExpense=收入',
        method: 'GET',
        dataType: 'json',
        success: function(income_data) {
            var select = document.getElementById("incomeType");
            for(var i = 0; i < income_data.length; i++){
                var option = document.createElement("option");
                option.appendChild(document.createTextNode(income_data[i])); 
                select.appendChild(option);
            }
        }
    });
}
function GetBudget(){
    $.ajax({
        url: 'http://172.20.10.3:9000/budget/get-available-budget?userID=user001&year='+year.toString()+'&month='+month.toString()+'&day='+day.toString()+'',
        method: 'GET',
        dataType: 'json',
        success: function(budget_data) {
            var select = document.getElementById("expenseBudget");
            for(var i = 0; i < budget_data.length; i++){
                var option = document.createElement("option");
                option.appendChild(document.createTextNode(budget_data[i]));
                select.appendChild(option);
            }
        }
    });
}
//日曆
function calendar(){
    //取得當下選擇的日期
    var datecontrol = document.querySelector('input[type = "date"]');
    var chosendate = datecontrol.value;
    year = chosendate[0] + chosendate[1] + chosendate[2] + chosendate[3];
    month = chosendate[5] + chosendate[6];
    day = chosendate[8] + chosendate[9];
    document.getElementById("todaydate").innerHTML = "日期 : " + chosendate;
    //支出
    var Expensetable=document.getElementById("expense_table");
    var expenseRows=document.getElementById("expense_table").rows.length;
    for(var i = 1, j = 1; j < expenseRows; j++){
        Expensetable.deleteRow(i);
    }
    GetExpenseData();
    //收入
    var Incometable=document.getElementById("income_table");
    var incomeRows=document.getElementById("income_table").rows.length;
    for(var i = 1, j = 1; j < incomeRows; j++){
        Incometable.deleteRow(i);
    }
    GetIncomeData();
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
    row.innerHTML = "<td id=''><button class='complete' onclick='complete_expense(this)' style='width:65px;'>完成新增</button></td>"+
    "<td id='name'><input type='textbox' style='width:100px;height:23px;margin:7px;' placeholder='Ex : 早餐' onblur='checknull(this,1)'><br><span id='ndisplay'></span></td>" +
    "<td id='price'><input type='textbox' style='width:100px;height:23px;margin:7px;' placeholder='Ex : 50' onblur='checknull(this,2)'><br><span id='pdisplay'></span></td>"+
    "<td id='account'><select style='width:100px;margin:7px;'><option>錢包</option><option>悠遊卡</option><option>郵局</option><option>台灣銀行</option></select></td>"+
    "<td id='type'><select id='expenseType' style='width:100px;margin:7px;'></select></td>" +
    "<td id='budget'><select id='expenseBudget' style='width:100px;margin:7px;'></select></td>" +
    "<td id='time'><input type='time' style='width:130px;height:23px;margin:7px;' onblur='checknull(this,5)'><br><span id='timedisplay'></td>" +
    "<tr><button class='edit' id='edit' onclick='edit_expense(this)'>編輯</button>" +
    "<button class='delete' onclick='expense_remind(this)'>刪除</button></tr>";
    GetExpenseCategory();
    GetBudget();
}
//刪除支出
function delete_expense(){
    var table=document.getElementById("expense_table");
	table.deleteRow(expenseNO);         //刪除第幾列
    document.getElementById("expense_remind").style.display = "none";
    $.ajax({
        url: 'http://172.20.10.3:9000/record/delete-doc?id='+ expenseID + '&userID=user002',
        type: 'DELETE',
        success: function(result) {
            console.log(result);
        }
    });
}
//新增收入
function add_income(){
    document.getElementById("expenseorincome").style.display = "none";
    var table = document.getElementById("income_table");
    var row = table.insertRow(table.row);   //增加row
    row.style.background = "#CAFFFF";
    row.innerHTML = "<td id=''><button class='complete' onclick='complete_income(this)' style='width:65px;'>完成新增</button></td>";
    row.innerHTML += "<td id='account'><select style='width:100px;margin:7px;'><option>錢包</option><option>悠遊卡</option><option>郵局</option><option>台灣銀行</option></select></td>" + 
    "<td id='type'><select id='incomeType' style='width:100px;margin:7px;'></select></td>" +
    "<td id='time'><input type='time' style='width:130px;height:23px;margin:7px;' onblur='checknull(this,6)'><br><span id='Timedisplay'></td>"+
    "<td id='price'><input type='textbox' style='width:100px;height:23px;margin:7px;' placeholder='Ex : 50'></td>"+
    "<td></td>" +
    "<td></td>" +
    "<tr><button class='edit' id='edit' onclick='edit_income(this)' style='top:2px;position:relative;'>編輯</button>" +
    "<button class='delete' onclick='income_remind(this)' style='top:2px;position:relative;'>刪除</button></tr>";
    GetIncomeCategory();
}
//刪除收入
function delete_income(){
    var table=document.getElementById("income_table");
	table.deleteRow(incomeNO);                 //刪除第幾列
    document.getElementById("income_remind").style.display = "none";
    $.ajax({
        url: 'http://172.20.10.3:9000/record/delete-doc?id='+ incomeID + '&userID=user002',
        type: 'DELETE',
        success: function(result) {
            console.log(result);
        }
    });
}
//刪除支出提醒
function expense_remind(obj){
    document.getElementById("expense_remind").style.display = "";
    close=1;    //框框要關了
    expenseNO = obj.parentNode.rowIndex;
    expenseID = $(obj.parentNode.children[0]).attr("id");
    console.log(expenseID);
}
//刪除收入提醒
function income_remind(obj){
    document.getElementById("income_remind").style.display = "";
    close=1;    //框框要關了
    incomeNO = obj.parentNode.rowIndex;
    incomeID = $(obj.parentNode.children[0]).attr("id");
}
//取消提醒
function cancel(){
    document.getElementById("expense_remind").style.display = "none";
    document.getElementById("income_remind").style.display = "none";
}
//編輯支出
function edit_expense(obj){
    //obj.style.display="none";
    editExpense = 1;
    var tmp = obj.parentNode.cells[1].innerHTML;
    obj.parentNode.cells[0].innerHTML = "<button class='complete' onclick='complete_expense(this)' style='width:65px;'>完成新增</button>";
    obj.parentNode.cells[1].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
    tmp = obj.parentNode.cells[2].innerHTML;
    obj.parentNode.cells[2].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
    tmp = obj.parentNode.cells[3].innerHTML;
    obj.parentNode.cells[3].innerHTML = "<select id='account' style='width:100px;margin:7px;'><option>"+tmp+"</option>"+
    "<option></option><option></option><option></option></select>";
    var categoryIndex = expense_type;
    obj.parentNode.cells[4].innerHTML = "<select id='expenseType' style='width:100px;margin:7px;'></select></td>";
    $.ajax({
        url: 'http://172.20.10.3:9000/recordCategory/get-docs?userID=user001&incomeOrExpense=支出',
        method: 'GET',
        dataType: 'json',
        success: function(expense_data) {
            var select = document.getElementById("expenseType");
            for(var i = 0; i < expense_data.length; i++){
                var option = document.createElement("option");
                option.appendChild(document.createTextNode(expense_data[i])); 
                select.appendChild(option);
            }
            select.options[categoryIndex].selected = true;
        }
    });
    var BudgetIndex = expense_budget;
    obj.parentNode.cells[5].innerHTML = "<select id='expenseBudget' style='width:100px;margin:7px;'></select></td>";
    $.ajax({
        url: 'http://172.20.10.3:9000/budget/get-available-budget?userID=user001&year='+year.toString()+'&month='+month.toString()+'&day='+day.toString()+'',
        method: 'GET',
        dataType: 'json',
        success: function(budget_data) {
            var select = document.getElementById("expenseBudget");
            for(var i = 0; i < budget_data.length; i++){
                var option = document.createElement("option");
                option.appendChild(document.createTextNode(budget_data[i])); 
                select.appendChild(option);
            }
            select.options[BudgetIndex].selected = true;
        }
    });
    tmp = obj.parentNode.cells[6].innerHTML;
    obj.parentNode.cells[6].innerHTML = "<input type='time' style='width:130px;height:23px;margin:7px;' value="+tmp+">";
}
//編輯收入
function edit_income(obj){
    editIncome = 1;
    console.log("進入edit_income");
    var tmp = obj.parentNode.cells[4].innerHTML;
    obj.parentNode.cells[0].innerHTML = "<button class='complete' onclick='complete_income(this)' style='width:65px;'>完成新增</button>";
    obj.parentNode.cells[4].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
    tmp = obj.parentNode.cells[1].innerHTML;
    obj.parentNode.cells[1].innerHTML = "<select id='account' style='width:100px;margin:7px;'><option>"+tmp+"</option>"+
    "<option></option><option></option><option></option></select>";
    var categoryIndex = income_type;
    console.log(categoryIndex);
    obj.parentNode.cells[2].innerHTML = "<select id='incomeType' style='width:100px;margin:7px;'></select></td>";
    $.ajax({
        url: 'http://172.20.10.3:9000/recordCategory/get-docs?userID=user001&incomeOrExpense=收入',
        method: 'GET',
        dataType: 'json',
        success: function(income_data) {
            var select = document.getElementById("incomeType");
            for(var i = 0; i < income_data.length; i++){
                var option = document.createElement("option");
                option.appendChild(document.createTextNode(income_data[i])); 
                select.appendChild(option);
            }
            select.options[categoryIndex].selected = true;
        }
    });
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
    var accountName, budgetName, category, moneyAmount, name;
    obj.style.display="none";
    name = obj.parentNode.parentNode.cells[1].children[0].value;
    obj.parentNode.parentNode.cells[1].innerHTML = obj.parentNode.parentNode.cells[1].children[0].value;
    moneyAmount = obj.parentNode.parentNode.cells[2].children[0].value;
    obj.parentNode.parentNode.cells[2].innerHTML = obj.parentNode.parentNode.cells[2].children[0].value;
    accountName = obj.parentNode.parentNode.cells[3].children[0].value;
    obj.parentNode.parentNode.cells[3].innerHTML = obj.parentNode.parentNode.cells[3].children[0].value;

    expense_type = document.getElementById("expenseType").selectedIndex;
    category = obj.parentNode.parentNode.cells[4].children[0].value;
    obj.parentNode.parentNode.cells[4].innerHTML = obj.parentNode.parentNode.cells[4].children[0].value;

    expense_budget = document.getElementById("expenseBudget").selectedIndex;
    budgetName = obj.parentNode.parentNode.cells[5].children[0].value;
    obj.parentNode.parentNode.cells[5].innerHTML = obj.parentNode.parentNode.cells[5].children[0].value;

    obj.parentNode.parentNode.cells[6].innerHTML = obj.parentNode.parentNode.cells[6].children[0].value;
    var time = [0, 1];
    if(obj.parentNode.parentNode.cells[6].innerHTML[0] == 0){
        time[0] = obj.parentNode.parentNode.cells[6].innerHTML[1];
    }
    else{
        time[0] = obj.parentNode.parentNode.cells[6].innerHTML[0] + obj.parentNode.parentNode.cells[6].innerHTML[1];
    }
    if(obj.parentNode.parentNode.cells[6].innerHTML[3] == 0){
        time[1] = obj.parentNode.parentNode.cells[6].innerHTML[4];
    }
    else{
        time[1] = obj.parentNode.parentNode.cells[6].innerHTML[3] + obj.parentNode.parentNode.cells[6].innerHTML[4];
    }
    if(editExpense == 0){   //f5後編輯
        var data;
        data = {
            "userID": "user002",
            "accountName": accountName,
            "budgetName": budgetName,
            "category": category,
            "date": {
                "year": parseInt(year),
                "month": parseInt(month),
                "day": parseInt(day),
                "hour": parseInt(time[0]),
                "minute": parseInt(time[1])
            },
            "incomeOrExpense": "支出",
            "moneyAmount": parseInt(moneyAmount),
            "name": name
        }
        fetch('http://172.20.10.3:9000/record/insert-doc',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                error: function(warn){
                    window.alert("輸入不可為空白")
                }
        })
        console.log(data);
        $.ajax({
            url: 'http://172.20.10.3:9000/record/get-docs?userID=user002&incomeOrExpense=支出&year='+year.toString()+'&month='+month.toString()+'&day='+day.toString()+'',
            method: 'GET',
            dataType: 'json',
            success: function(expense_data) {
                console.log(expense_data);
                $(obj.parentNode).attr("id", expense_data[0]._id);
            }
        });
        //console.log(expenseID);
        //console.log(obj.parentNode);
    }
    else{   //新增完後編輯
        expenseID = $(obj.parentNode).attr("id");
        console.log(typeof(expenseID));
        var data;
        data = {
            "id": expenseID,
            "userID": "user002",
            "new_name": name,
            "new_category": category,
            "new_date":{
                "year": parseInt(year),
                "month": parseInt(month),
                "day": parseInt(day),
                "hour": parseInt(time[0]),
                "minute": parseInt(time[1])
            },
            "new_moneyAmount": parseInt(moneyAmount),
            "new_accountName": accountName,
            "new_budgetName": budgetName
        }
        fetch('http://172.20.10.3:9000/record/update-doc',
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        })
        editExpense = 0;
    }
}
//完成新增收入
function complete_income(obj){
    var accountName, category, moneyAmount;
    obj.style.display="none";
    accountName = obj.parentNode.parentNode.cells[1].children[0].value;
    obj.parentNode.parentNode.cells[1].innerHTML = obj.parentNode.parentNode.cells[1].children[0].value;
    income_type = document.getElementById("incomeType").selectedIndex;
    category = obj.parentNode.parentNode.cells[2].children[0].value;
    obj.parentNode.parentNode.cells[2].innerHTML = obj.parentNode.parentNode.cells[2].children[0].value;
    obj.parentNode.parentNode.cells[3].innerHTML = obj.parentNode.parentNode.cells[3].children[0].value;
    moneyAmount = obj.parentNode.parentNode.cells[4].children[0].value;
    obj.parentNode.parentNode.cells[4].innerHTML = obj.parentNode.parentNode.cells[4].children[0].value;
    var time = [0, 1];
    if(obj.parentNode.parentNode.cells[3].innerHTML[0] == 0){
        time[0] = obj.parentNode.parentNode.cells[3].innerHTML[1];
    }
    else{
        time[0] = obj.parentNode.parentNode.cells[3].innerHTML[0] + obj.parentNode.parentNode.cells[3].innerHTML[1];
    }
    if(obj.parentNode.parentNode.cells[3].innerHTML[3] == 0){
        time[1] = obj.parentNode.parentNode.cells[3].innerHTML[4];
    }
    else{
        time[1] = obj.parentNode.parentNode.cells[3].innerHTML[3] + obj.parentNode.parentNode.cells[3].innerHTML[4];
    }
    if(editIncome == 0){    //f5後編輯
        var data;
        data = {
            "userID": "user002",
            "accountName": accountName,
            "budgetName": null,
            "category": category,
            "date": {
                "year": parseInt(year),
                "month": parseInt(month),
                "day": parseInt(day),
                "hour": parseInt(time[0]),
                "minute": parseInt(time[1])
            },
            "incomeOrExpense": "收入",
            "moneyAmount": parseInt(moneyAmount),
            "name": null
        }
        fetch('http://172.20.10.3:9000/record/insert-doc',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        })
        console.log(data);
        $.ajax({
            url: 'http://172.20.10.3:9000/record/get-docs?userID=user002&incomeOrExpense=收入&year='+year.toString()+'&month='+month.toString()+'&day='+day.toString()+'',
            method: 'GET',
            dataType: 'json',
            success: function(income_data) {
                $(obj.parentNode).attr("id", income_data[0]._id)
            }
        });
        //console.log(incomeID);
        //console.log(obj.parentNode);
    }
    else{   //新增完後編輯
        incomeID = $(obj.parentNode).attr("id");
        console.log(typeof(incomeID));
        var data;
        data = {
            "id": incomeID,
            "userID": "user002",
            "new_name": null,
            "new_category": category,
            "new_date":{
                "year": parseInt(year),
                "month": parseInt(month),
                "day": parseInt(day),
                "hour": parseInt(time[0]),
                "minute": parseInt(time[1])
            },
            "new_moneyAmount": parseInt(moneyAmount),
            "new_accountName": accountName,
            "new_budgetName": null
        }
        fetch('http://172.20.10.3:9000/record/update-doc',
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        })
        editIncome = 0;
    }
}
function checknull(id,pos){ //判斷點擊輸入框後空白
    var display;
    switch(pos){
        case 1:
            display = document.getElementById("ndisplay");
            break;
        case 2:
            display = document.getElementById("pdisplay");
            break;
        /*case 3:
            display = document.getElementById("tdisplay");
            break;*/
        case 4:
            display = document.getElementById("Tdisplay");
            break;
        case 5:
            display = document.getElementById("timedisplay");
        break;
        case 6:
            display = document.getElementById("Timedisplay");
        break;
    }
    if(id.value =="") {
        display.innerHTML="不可為空，請輸入!"
        id.focus();
    }
    else{
        display.innerHTML=""
    }
}