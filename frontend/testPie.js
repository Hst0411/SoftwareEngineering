href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var entertainment = 10000, travel = 3000, food = 9000, life = 20000;
var mapping;
var data = [
    {x: "娛樂", value: entertainment},
    {x: "旅行", value: travel},
    {x: "食物", value: food},
    {x: "生活", value: life}
];

var dataSet = anychart.data.set(data);
var mapping = dataSet.mapAs({x: "category", value: 1});

var elementID = "container";
var elementID2 = "container2";

var dateSent_start;
var dateSent_end;

anychart.onDocumentReady(function draw_pie() { //一開始就畫的

    container.innerHTML = "";
    container2.innerHTML = "";
    
    // create the chart
    var chart = anychart.pie();
  
    // set the chart title
    chart.title("類別對比-收入");
  
    // add the data
    chart.data(mapping);
  
    // display the chart in the container
    chart.container('container');
    chart.draw();

    // create the chart
    var chart2 = anychart.pie();
  
    // set the chart title
    chart2.title("類別對比-支出");
  
    // add the data
    chart2.data(mapping);
  
    // display the chart in the container
    chart2.container('container2');
    chart2.draw();
  
});

function setDate(){
    dateSent_start = document.getElementById('startDate').value; //開始日期
    dateSent_end = document.getElementById('endDate').value; //結束日期
    console.log(dateSent_start);
    console.log(dateSent_end);
}

function work()
{
    setDate();
    update_pie();
}

function update_pie() //清除並從新畫
{
    entertainment = 6000, travel = 2000, food = 10000, life = 15000; //測試用的新的值
    mapping.set(0, "value", entertainment);
    mapping.set(1, "value", travel);
    mapping.set(2, "value", food);
    mapping.set(3, "value", life);


    container.innerHTML = ""; //清 container
    container2.innerHTML = "";


    var chart = anychart.pie();
  
    // set the chart title
    chart.title("類別對比-收入");
  
    // add the data
    chart.data(mapping);
  
    // display the chart in the container
    chart.container('container');
    chart.draw();

    // create the chart
    var chart2 = anychart.pie();
  
    // set the chart title
    chart2.title("類別對比-支出");
  
    // add the data
    chart2.data(mapping);
  
    // display the chart in the container
    chart2.container('container2');
    chart2.draw();
}   

function update_value()
{
    //用時間抓資料並更新
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