href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var d = new Date();

var firstMonthIncome, firstMonthExpense, secondMonthIncome, secondMonthExpense, thirdMonthIncome, thirdMonthExpense; //目前沒設預設值所以沒有圖

var month;
$(document).ready(function () {
  var date = new Date();
  month = pad2(date.getMonth()+1); //月份
  var day = pad2(date.getDate()); //日期
  var year= date.getFullYear(); //年份
  
  var formattedDate =  year+"-"+month+"-"+day; //抓 yyyy-mm-dd 日期
  console.log(formattedDate);
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
      url: 'http://172.20.10.3:9000/recordChart/get-months-compare-with-incomeExpense?userID=user002',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
          console.log(data);
          firstMonthExpense = data[0].expense;
          console.log(firstMonthExpense);
          secondMonthExpense = data[1].expense;
          console.log(secondMonthExpense);
          thirdMonthExpense = data[2].expense;
          console.log(thirdMonthExpense);
          firstMonthIncome = data[0].income;
          console.log(firstMonthIncome);
          secondMonthIncome = data[1].income;
          console.log(secondMonthIncome);
          thirdMonthIncome = data[2].income;
          console.log(thirdMonthIncome);
    var dataSet = anychart.data.set([
      [month - 2+ '月', thirdMonthIncome, thirdMonthExpense], //倒數第三月
      [month - 1+ '月', secondMonthIncome, secondMonthExpense], //倒數二
      [month + '月', firstMonthIncome, firstMonthExpense], //目前這個月
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
    var setupSeries = function (series, name) {
      series.name(name);
      series.normal().fill("#FF4500", 0.7).stroke(null)
      series.selected().fill('#f48fb1 0.8').stroke('1.5 #c2185b');
    };

    var setupSeries2 = function (series, name) {
        series.name(name);
        series.normal().fill("#00cc99", 0.4).stroke(null)
        series.selected().fill('#f48fb1 0.8').stroke('1.5 #c2185b');
      };

    // create first series with mapped data
    series = chart.column(firstSeriesData);
    series.xPointPosition(0.6);
    setupSeries(series, "支出");

    // create second series with mapped data
    series = chart.column(secondSeriesData);
    series.xPointPosition(0.395);
    setupSeries2(series, "收入");



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