import { TabulatorFull as Tabulator } from "tabulator-tables";
import '../scss/index.scss';

let currency = "USD";

function loadData() {
  $('#cryptoTable2').hide();
  $('#loadingIndicator').show();
  console.log("Load data...");
  fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h,24h,7d`).then((response) => {
    response.json().then((jsonData) => {
      console.log("Done loading data...");
      $('#refresh').removeClass('fa-spin');
      var table = new Tabulator("#cryptoTable2", {
        pagination: 'local',
        paginationSize: 100,
        height: '100%',
        data: jsonData,
        columnDefaults:{
          vertAlign: 'middle', //set the width on all columns to 200px
        },
        columns: [
          {title: '#', field: 'market_cap_rank', width:50 },
          {title: '', field: 'image', width:40, formatter: function(cell, formatterParams, onRendered){
            return "<img style='width: 30px; height: 30px' src=" + cell.getValue() +">";
          }},
          {title: 'Name', field: 'name', width:200, formatter:boldTextFormatter },
          {title: 'Symbol', field: 'symbol', width:100, formatter:toUpper },
          {title: 'Price', field: 'current_price', width:150, hozAlign: 'right', formatter: 'money', formatterParams:{
            symbol: getCurrencySymbol(),
            precision:false,
         }},
         {title: '1h', field: 'price_change_percentage_1h_in_currency', width:100, formatter: function(cell, formatterParams, onRendered){
          return getColor(cell);
        }},
        {title: '24h', field: 'price_change_percentage_24h_in_currency', width:100, formatter: function(cell, formatterParams, onRendered){
          return getColor(cell);
        }},
        {title: '7d', field: 'price_change_percentage_7d_in_currency', width:100, formatter: function(cell, formatterParams, onRendered){
          return getColor(cell);
        }},
        {title: '24h Volume', field: 'total_volume', width:200, formatter: 'money', formatterParams:{
          symbol: getCurrencySymbol(),
          precision: 0
        }},
        {title: 'Market Cap', field: 'market_cap', width:200, formatter: 'money', formatterParams:{
          symbol: getCurrencySymbol(),
          precision: 0
        }},
        {title: 'Last 7 days', field: 'sparkline_in_7d.price', width:200, formatter:sparklineFormatter},
        ]
      });

      $('#loadingIndicator').hide();
      $('#cryptoTable2').show();
    })
  })
  
  
}

function getCurrencySymbol() {
  switch(currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "BTC":
      return "₿";
    case "ETH":
      return "Ξ";
    default:
      return "";
  }
}

var toUpper = function(cell, formatterParams, onRendered){
  return "<span>" + cell.getValue().toUpperCase() + "</span>";
};

var boldTextFormatter = function(cell, formatterParams, onRendered){
  return "<span style='font-weight: bold'>" + cell.getValue() + "</span>";
};

var sparklineFormatter = function(cell, formatterParams, onRendered){
  onRendered(function(){
    let values = cell.getValue();
    let color = "black";
    if (values[values.length-1] > values[0])
      color = "green";
    else if (values[values.length-1] < values[0])
      color = "red";
    $(cell.getElement()).sparkline(values, {width:"100%", type:"line", lineWidth:2, lineColor: color, height:'50px'});
  });
};

function getColor(cell) {
  if (cell.getValue() === null) {
    return "<span>N/A</span>"
  }
  let color = "black";
  if (cell.getValue() > 0) {
    color = "green";
  } else if (cell.getValue() < 0) {
    color = "red";
  }
  return "<span style='color:" + color + ";'>" + cell.getValue().toFixed(2) + '%' + "</span>";
}

$('.dropdown-menu a').click(function (event) {           
  console.log(event.currentTarget);
  currency = event.currentTarget.childNodes[0].data;
  loadData();
  $('#currencyDropdownMenuButton').text(currency);
});

$('#refresh').click(function () {           
  $('#refresh').addClass('fa-spin');
  loadData();
});

loadData();


 