href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var d = new Date();

var firstMonthIncome, firstMonthExpense, secondMonthIncome, secondMonthExpense, thirdMonthIncome, thirdMonthExpense; //目前沒設預設值所以沒有圖
var currency = 1, currencyName;
var month;
$(document).ready(function () {
  var date = new Date();
  month = pad2(date.getMonth()+1); //月份
  var day = pad2(date.getDate()); //日期
  var year= date.getFullYear(); //年份
  
  var formattedDate =  year+"-"+month+"-"+day; //抓 yyyy-mm-dd 日期
  console.log(formattedDate);
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
  draw_bar();
});

function pad2(n) {
  return (n < 10 ? '0' : '') + n;
}

//一進來就會畫因爲不會再更新
function draw_bar() {
  var a,b,c,A,B,C;
    // create data set on our data
    $.ajax({
      url: '/recordChart/get-months-compare-with-incomeExpense?'+'jwt='+localStorage.getItem("JWT-token"),
      method: 'GET',
      dataType: 'json',
      success: function(data) {
          firstMonthExpense = data[0].expense;
          secondMonthExpense = data[1].expense;
          thirdMonthExpense = data[2].expense;
          firstMonthIncome = data[0].income;
          secondMonthIncome = data[1].income;
          thirdMonthIncome = data[2].income;
          console.log(thirdMonthIncome);
          var showMonth = month;
          if(showMonth == 01){
            showMonth = 13;
          }
          else if(showMonth == 02){
            showMonth = 14;
          }
          var dataSet = anychart.data.set([
            [showMonth - 2+ '月', (thirdMonthIncome/currency).toFixed(2), (thirdMonthExpense/currency).toFixed(2)], //倒數第三月
            [showMonth - 1+ '月', (secondMonthIncome/currency).toFixed(2), (secondMonthExpense/currency).toFixed(2)], //倒數二
            [month + '月', (firstMonthIncome/currency).toFixed(2), (firstMonthExpense/currency).toFixed(2)], //目前這個月
          ]);

    // map data for the first series, take x from the zero column and value from the first column of data set
    var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });

    // map data for the second series, take x from the zero column and value from the second column of data set
    var secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });

    // create column chart
    var chart = anychart.column();

    // turn on chart animation
    chart.animation(true);

    // set chart title text settings
    chart.title('三個月總收入支出比較');


    // temp variable to store series instance
    var series;

    // helper function to setup label settings for all series
    var setupSeries2 = function (series, name) {
      series.name(name);
      series.normal().fill("#FF4500", 0.7).stroke(null)
      series.selected().fill('#f48fb1 0.8').stroke('1.5 #c2185b');
    };

    var setupSeries = function (series, name) {
        series.name(name);
        series.normal().fill("#00cc99", 0.4).stroke(null)
        series.selected().fill('#f48fb1 0.8').stroke('1.5 #c2185b');
      };

    // create first series with mapped data
    series = chart.column(firstSeriesData);
    series.xPointPosition(0.6);
    setupSeries(series, "收入");

    // create second series with mapped data
    series = chart.column(secondSeriesData);
    series.xPointPosition(0.395);
    setupSeries2(series, "支出");



    // set chart padding
    chart.barsPadding(3);
    chart.barGroupsPadding(0);

   
    // format numbers in y axis label to match browser locale
    chart.yAxis().labels().format('${%Value}{groupsSeparator: }');

    // set titles for Y-axis
    chart.yAxis().title('金額');

    // turn on legend
    chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0]);

    chart.interactivity().hoverMode('single');

    chart.tooltip().format('${%Value}{groupsSeparator: }');

    // set container id for the chart
    chart.container('container');

    // initiate chart drawing
    chart.draw();
  }
});
  };