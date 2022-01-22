href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
src="https://cdn.anychart.com/releases/8.11.0/js/anychart-base.min.js"
var start_year='', start_month, start_day, dateSent_start, dateSent_end;
var end_year='', end_month, end_day;
var incomelength, expenselength;
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
    document.getElementById("currencyValue").innerHTML = "當下幣值為<strong><span style='color:red;'>"+
    currencyName +"</span></strong>";
});

var data_income = [
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
];
var data_expense = [
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
    {x: "", value: 0},
];
var dataExpense;
var dataIncome;
var mappingExpense;
var mappingIncome;
var elementID = "container";
var elementID2 = "container2";
function GetIncomeData(){
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
        url: '/recordChart/get-category-compare?startDateYear='+start_year+'&startDateMonth='+start_month+
        '&startDateDay='+start_day+'&endDateYear='+end_year+'&endDateMonth='+end_month+'&endDateDay='+end_day+'&incomeOrExpense=收入'+'&jwt='+localStorage.getItem("JWT-token"),
        method: 'GET',
        dataType: 'json',
        success: function(income_data) {
            for(var i=0;i<income_data.length;i++){
                data_income[i].x = income_data[i]._id;
                data_income[i].value = (income_data[i].total_amount/currency).toFixed(2);
                mappingIncome.set(i, "value", data_income[i].value);
                mappingIncome.set(i, "x", data_income[i].x);
            }
            incomelength = income_data.length;
        }
    });
}
function GetExpenseData(){
    if(localStorage.getItem('myCurrency') == null){
        currency = 1;
    }
    else{
        currency = localStorage.getItem('myCurrency');
    }
    $.ajax({
        url: '/recordChart/get-category-compare?startDateYear='+start_year+'&startDateMonth='+start_month+
        '&startDateDay='+start_day+'&endDateYear='+end_year+'&endDateMonth='+end_month+'&endDateDay='+end_day+'&incomeOrExpense=支出'+'&jwt='+localStorage.getItem("JWT-token"),
        method: 'GET',
        dataType: 'json',
        success: function(expense_data) {
            console.log(expense_data)
            for(var i=0;i<expense_data.length;i++){
                data_expense[i].x = expense_data[i]._id;
                data_expense[i].value = (expense_data[i].total_amount/currency).toFixed(2);
                mappingExpense.set(i, "value", data_expense[i].value);
                mappingExpense.set(i, "x", data_expense[i].x);
            }
        }
    });
}
/*anychart.onDocumentReady(function draw_pie() { //一開始就畫的

    //GetExpenseData();
    GetIncomeData();
    console.log(data_expense[0]);
    container.innerHTML = "";
    container2.innerHTML = "";
    
    // create the chart
    var chart = anychart.pie();
  
    // set the chart title
    chart.title("類別對比-收入");
  
    // add the data
    chart.data(mappingIncome);
  
    // display the chart in the container
    chart.container('container');
    chart.draw();

    // create the chart
    var chart2 = anychart.pie();
  
    // set the chart title
    chart2.title("類別對比-支出");
  
    // add the data
    chart2.data(mappingExpense);
  
    // display the chart in the container
    chart2.container('container2');
    chart2.draw();
  
});*/

function setDate(){
    dateSent_start = document.getElementById('startDate').value; //開始日期
    dateSent_end = document.getElementById('endDate').value; //結束日期
    start_year=dateSent_start[0]+dateSent_start[1]+dateSent_start[2]+dateSent_start[3];
    end_year =dateSent_end[0]+dateSent_end[1]+dateSent_end[2]+dateSent_end[3]
    if(dateSent_start[5]==0){
        start_month = dateSent_start[6];
    }else{
        start_month = dateSent_start[5]+dateSent_start[6];
    }
    if(dateSent_start[8]==0){
        start_day = dateSent_start[9];
    }else{
        start_day = dateSent_start[8]+dateSent_start[9];
    }
    if(dateSent_end[5]==0){
        end_month = dateSent_end[6];
    }else{
        end_month = dateSent_end[5]+dateSent_end[6];
    }
    if(dateSent_end[8]==0){
        end_day = dateSent_end[9];
    }else{
        end_day = dateSent_end[8]+dateSent_end[9];
    }
}

function work()
{
    setDate();
    update_pie();
}
function update_pie() //清除並從新畫
{
    //entertainment_income = 5000, travel_income = 8000, food_income = 6000, life_income = 10000;
    //entertainment_expense = 10000, travel_expense = 3000, food_expense = 13000, life_expense = 18000;

    GetIncomeData();
    GetExpenseData();

    dataIncome = anychart.data.set(data_income);
    dataExpense = anychart.data.set(data_expense)
    mappingExpense = dataExpense.mapAs({x: "category", value: 0});
    mappingIncome = dataIncome.mapAs({x: "category", value: 0});

    container.innerHTML = ""; //清 container
    container2.innerHTML = "";


    var chart = anychart.pie();
  
    // set the chart title
    chart.title("類別對比-收入");
  
    // add the data
    chart.data(mappingIncome);
  
    // display the chart in the container
    chart.container('container');
    chart.draw();

    // create the chart
    var chart2 = anychart.pie();
  
    // set the chart title
    chart2.title("類別對比-支出");
  
    // add the data
    chart2.data(mappingExpense);
  
    // display the chart in the container
    chart2.container('container2');
    chart2.draw();
}   

/*
 container.innerHTML = "";
    container2.innerHTML = "";


    var chart = anychart.pie();
  
    // set the chart title
    chart.title("類別對比-收入");
  
    // add the data
    chart.data(newData);
  
    // display the chart in the container
    chart.container('container');
    chart.draw();

    // create the chart
    var chart2 = anychart.pie();
  
    // set the chart title
    chart2.title("類別對比-支出");
  
    // add the data
    chart2.data(newData);
  
    // display the chart in the container
    chart2.container('container2');
    chart2.draw();
*/