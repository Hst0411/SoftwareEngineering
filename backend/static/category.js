var expenseNO, incomeNO;
var editExpense = 0, editIncome = 0;   //沒有edit
var oldExpenseName, oldIncomeName;
$(document).ready(function () {
    GetExpenseCategory();
    GetIncomeCategory();
});
function GetExpenseCategory(){
    $.ajax({
        url: '/recordCategory/get-docs?incomeOrExpense=支出'+'&jwt='+localStorage.getItem("JWT-token"),
        method: 'GET',
        dataType: 'json',
        success: function(expense_data) {
            console.log(expense_data);
            for(var i = 0; i < expense_data.length; i++){
                var table = document.getElementById("expense_category");
                var row = table.insertRow(table.row);   //增加row
                row.style.background = "#FFD2D2";
                row.innerHTML = "<td id='"+ expense_data[i] +"'></td>"+
                "<td id='name'>" + expense_data[i] + "</td>" +
                "<tr><button class='edit' onclick='edit_expense(this)'>編輯</button>" +
                "<button class='delete' onclick='expense_remind(this)'>刪除</button></tr>";
            }
        }
    });
}
function GetIncomeCategory(){
    $.ajax({
        url: '/recordCategory/get-docs?incomeOrExpense=收入'+'&jwt='+localStorage.getItem("JWT-token"),
        method: 'GET',
        dataType: 'json',
        success: function(income_data) {
            for(var i = 0; i < income_data.length; i++){
                var table = document.getElementById("income_category");
                var row = table.insertRow(table.row);   //增加row
                row.style.background = "#CAFFFF";
                row.innerHTML = "<td id='"+ income_data[i] +"'></td>"+
                "<td id='name'>" + income_data[i] + "</td>" +
                "<tr><button class='edit' onclick='edit_income(this)'>編輯</button>" +
                "<button class='delete' onclick='income_remind(this)'>刪除</button></tr>";
            }
        }
    });
}
function add(){
    document.getElementById("expenseorincome").style.display = "";
}
function add_expense(){
    document.getElementById("expenseorincome").style.display = "none";
    var table = document.getElementById("expense_category");
    var row = table.insertRow(table.row);   //增加row
    row.style.background = "#FFD2D2";
    row.innerHTML = "<td id=''><button class='complete' onclick='complete_expense(this)' style='width:65px;'>完成新增</button></td>"+
    "<td id='categoryname'><input type='textbox' style='width:150px;height:26px;margin:7px;' placeholder='Ex : 學習'></td>" +
    "<tr><button class='edit' onclick='edit_expense(this)'>編輯</button>"+
    "<button class='delete' onclick='expense_remind(this)'>刪除</button></tr>";
    
}
function add_income(){
    document.getElementById("expenseorincome").style.display = "none";
    var table = document.getElementById("income_category");
    var row = table.insertRow(table.row);   //增加row
    row.style.background = "#CAFFFF";
    row.innerHTML = "<td><button class='complete' onclick='complete_income(this)' style='width:65px;'>完成新增</button></td>"+
    "<td id='categoryname'><input type='textbox' style='width:150px;height:26px;margin:7px;' placeholder='Ex : 薪水'></td>" +
    "<tr><button class='edit' onclick='edit_income(this)'>編輯</button>"+
    "<button class='delete' onclick='income_remind(this)'>刪除</button></tr>";
}
//刪除支出
function delete_expense(){
    var table=document.getElementById("expense_category");
    document.getElementById("expense_remind").style.display = "none";
    $.ajax({
        url: '/recordCategory/delete-doc?name='+table.rows[expenseNO].children[1].innerHTML+'&incomeOrExpense=支出'+'&jwt='+localStorage.getItem("JWT-token"),
        type: 'DELETE',
        success: function(result) {
            console.log(result);
        }
    });
	table.deleteRow(expenseNO);         //刪除第幾列
}
//刪除收入
function delete_income(){
    var table=document.getElementById("income_category");
    document.getElementById("income_remind").style.display = "none";
    $.ajax({
        url: '/recordCategory/delete-doc?name='+ table.rows[incomeNO].children[1].innerHTML +'&incomeOrExpense=收入'+'&jwt='+localStorage.getItem("JWT-token"),
        type: 'DELETE',
        success: function(result) {
            console.log(result);
        }
    });
	table.deleteRow(incomeNO);                 //刪除第幾列
}
//刪除支出提醒
function expense_remind(obj){
    document.getElementById("expense_remind").style.display = "";
    expenseNO = obj.parentNode.rowIndex;
}
//刪除收入提醒
function income_remind(obj){
    document.getElementById("income_remind").style.display = "";
    incomeNO = obj.parentNode.rowIndex;
}
function cancel(){
    document.getElementById("expense_remind").style.display = "none";
    document.getElementById("income_remind").style.display = "none";
}
//編輯支出
function edit_expense(obj){
    //obj.style.display="none";
    editExpense = 1;
    var tmp = obj.parentNode.cells[1].innerHTML;
    console.log($(obj.parentNode.cells[0]).attr("id"));
    oldExpenseName = $(obj.parentNode.cells[0]).attr("id");
    console.log(oldExpenseName);
    obj.parentNode.cells[0].innerHTML = "<button class='complete' onclick='complete_expense(this)' style='width:65px;'>完成新增</button>";
    obj.parentNode.cells[1].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
}
//編輯收入
function edit_income(obj){
    editIncome = 1;
    var tmp = obj.parentNode.cells[1].innerHTML;
    console.log($(obj.parentNode.cells[0]).attr("id"));
    oldIncomeName = $(obj.parentNode.cells[0]).attr("id");
    obj.parentNode.cells[0].innerHTML = "<button class='complete' onclick='complete_income(this)' style='width:65px;'>完成新增</button>";
    obj.parentNode.cells[1].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
}
function complete_expense(obj){
    var category_name;
    obj.style.display="none";
    category_name = obj.parentNode.parentNode.cells[1].children[0].value;
    obj.parentNode.parentNode.cells[1].innerHTML = obj.parentNode.parentNode.cells[1].children[0].value;
    if(editExpense == 0){   //f5後編輯
        var data;
        data = {
            "userID": "user001",
            "incomeOrExpense": "支出",
            "name": category_name
        }
        fetch('/recordCategory/insert-doc',
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
            url: '/recordCategory/get-docs?incomeOrExpense=支出'+'&jwt='+localStorage.getItem("JWT-token"),
            method: 'GET',
            dataType: 'json',
            success: function(expense_data) {
                console.log(expense_data);
                //$(obj.parentNode).attr("id", expense_data[0]._id);
            }
        });
    }
    else{   //新增完後編輯
        var data;
        console.log(oldExpenseName);
        console.log(typeof(oldExpenseName));
        console.log(category_name);
        console.log(typeof(category_name));
        data = {
            "id": "user001",
            "old_name": oldExpenseName,
            "old_incomeOrExpense":"支出",
            "new_name": category_name
        }
        fetch('/recordCategory/update-doc',
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem("JWT-token")
                },
                body: JSON.stringify(data)
        })
        console.log(data);
        editExpense = 0;
    }
}
function complete_income(obj){
    var category_name;
    obj.style.display="none";
    category_name = obj.parentNode.parentNode.cells[1].children[0].value;
    obj.parentNode.parentNode.cells[1].innerHTML = obj.parentNode.parentNode.cells[1].children[0].value;
    if(editIncome == 0){   //f5後編輯
        var data;
        data = {
            "userID": "user001",
            "incomeOrExpense": "收入",
            "name": category_name
        }
        fetch('/recordCategory/insert-doc',
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
    }
    else{   //新增完後編輯
        var data;
        data = {
            "id": "user001",
            "old_name": oldIncomeName,
            "old_incomeOrExpense":"收入",
            "new_name": category_name
        }
        fetch('/recordCategory/update-doc',
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem("JWT-token")
                },
                body: JSON.stringify(data)
        })
        editIncome = 0;
    }
}