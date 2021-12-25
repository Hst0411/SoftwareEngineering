href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"


var start_year='', start_month, start_day, dateSent_start, dateSent_end;
var end_year='', end_month, end_day;
var entertainment_income = 10000, travel_income = 3000, food_income = 9000, life_income = 20000;

var data_income = [
    {x: "娛樂", value: entertainment_income},
    {x: "旅行", value: travel_income},
    {x: "食物", value: food_income},
    {x: "生活", value: life_income}
];

var entertainment_expense = 15000, travel_expense = 8000, food_expense = 17000, life_expense = 28000;
var data_expense = [
    {x: "娛樂", value: entertainment_expense},
    {x: "旅行", value: travel_expense},
    {x: "食物", value: food_expense},
    {x: "生活", value: life_expense}
];

var dataIncome = anychart.data.set(data_income);
var dataExpense = anychart.data.set(data_expense)
var mappingIncome = dataIncome.mapAs({x: "category", value: 1});
var mappingExpense = dataExpense.mapAs({x: "category", value: 1});

var elementID = "container";
var elementID2 = "container2";
/*$.ajax({
    url: 'http://172.20.10.3:9000/record/get-docs?userID=user002&incomeOrExpense=支出&year='+year.toString()+'&month='+month.toString()+'&day='+day.toString()+'',
    method: 'GET',
    dataType: 'json',
    success: function(expense_data) {

    }
});*/
$.ajax({
    url: 'http://172.20.10.3:9000/recordChart/get-category-compare?userID=user002&startDateYear='+start_year+'&startDateMonth='+start_month+'&startDateDay='+start_day+'&endDateYear='+end_year+'&endDateMonth='+end_month+'&endDateDay='+end_day+'&incomeOrExpense=收入',
    method: 'GET',
    dataType: 'json',
    success: function(income_data) {
        
    }
});
anychart.onDocumentReady(function draw_pie() { //一開始就畫的

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
  
});

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
    entertainment_income = 5000, travel_income = 8000, food_income = 6000, life_income = 10000;
    entertainment_expense = 10000, travel_expense = 3000, food_expense = 13000, life_expense = 18000;
    mappingIncome.set(0, "value", entertainment_income);
    mappingIncome.set(1, "value", travel_income);
    mappingIncome.set(2, "value", food_income);
    mappingIncome.set(3, "value", life_income);

    mappingExpense.set(0, "value", entertainment_expense);
    mappingExpense.set(1, "value", travel_expense);
    mappingExpense.set(2, "value", food_expense);
    mappingExpense.set(3, "value", life_expense);

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