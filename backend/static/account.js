function addacount(){
    var table = document.getElementById("account_table");
    var row = table.insertRow(table.row);   //增加row
    row.style.background = "#FFD2D2";
    row.innerHTML = "<td><button class='complete' onclick='account_complete(this)' style='width:65px;'>完成新增</button></td>"+
    "<td id='accountname'><input type='textbox' style='width:150px;height:26px;' placeholder='Ex : 悠遊卡'></td>" +
    "<td id='money'><input type='textbox' style='width:150px;height:26px;' placeholder='Ex : 500'></td>"+
    "<td id='transrecord'></td>"+
    "<tr><button class='edit' onclick='account_edit(this)'>編輯</button>"+
    "<button class='delete' onclick='account_remind(this)'>刪除</button>"+
    "<a style='text-decoration:none;' href=transferrecord.html><button class='show' onclick='show_fransfer(this)'>轉帳紀錄</button></a></tr>";
}
function account_remind(obj){
    document.getElementById("remind").style.display = "";
    accountNO = obj.parentNode.rowIndex;
}
function cancel(){
    document.getElementById("remind").style.display = "none";
}

function account_delete(){
    var table=document.getElementById("account_table");
	table.deleteRow(accountNO);                 //刪除第幾列
    document.getElementById("remind").style.display = "none";
}

function account_complete(obj){
    var account_name,account_money;
    obj.style.display="none";
    account_name = obj.parentNode.parentNode.cells[1].children[0].value;
    obj.parentNode.parentNode.cells[1].innerHTML = obj.parentNode.parentNode.cells[1].children[0].value;
    account_money = obj.parentNode.parentNode.cells[2].children[0].value;
    obj.parentNode.parentNode.cells[2].innerHTML = obj.parentNode.parentNode.cells[2].children[0].value;
}
function account_edit(obj){
    var tmp = obj.parentNode.cells[1].innerHTML;
    obj.parentNode.cells[0].innerHTML = "<button class='complete' onclick=' account_complete(this)' style='width:65px;'>完成新增</button>";
    obj.parentNode.cells[1].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
    tmp = obj.parentNode.cells[2].innerHTML;
    obj.parentNode.cells[2].innerHTML = "<input type='textbox' style='width:100px;height:23px;margin:7px;' value="+tmp+">";
}
