const chatId = '-1001179654183';
const botId = '1692130736:AAH7R4-8rUIfSo6MrX1ltfi1ZkGfXadM42o';
const telegramEndpoint = `https://api.telegram.org/bot${botId}`;
const krakenEndpoint = 'https://api.kraken.com/0/public/';
const ticker = krakenEndpoint + 'Ticker?pair=XBTEUR';
let myApp;
let lastPrice = 0;
let currentPrice;
const diffPrice = 50;

const priceText = document.getElementById('price-text');
const template = document.getElementById('container-template');
const templateHTML = template.innerHTML;
const timeContainer = document.getElementById('last-refresh-text');
const priceArticlesContainer = document.getElementsByClassName('price-articles')[0];

let seconds = 0;

let interval;

const regex = /"(.*?)"/;

const webSocketUrl = "wss://ws.kraken.com/";
var globalIsWebSocketOpen = false;

// Array of Prices - Check Price every minute and compare

function openWebSocket() {

  socket = new WebSocket(webSocketUrl);
  socket.onopen = function () {
    globalIsWebSocketOpen = true;
    sendWebSocketMessage();
  };

  socket.onclose = function () {
    globalIsWebSocketOpen = false;
  };

  socket.onmessage = function (message) {

    const data = message.data.match(regex);
    const price = Number(data[1]);
    if (!Number.isNaN(price)) {
      currentPrice = price;
      setPrice();
    }
    // TODO CheckPrice [337,[["52790.10000","0.01594846","1618413792.734278","b","l",""]],"trade","XBT/EUR"]
  };
}

function sendWebSocketMessage() {

  if (globalIsWebSocketOpen) {
    var message =
      '{"event":"subscribe", "subscription":{"name":"trade"}, "pair":["XBT/EUR"]}';

    if (message !== "") {
      socket.send(message);
    }
    else {
      alert("An error occured");
    }
  }
  else {
    alert("Start service first");
  }
}

async function startProcess() {

  openWebSocket();

  // TODO Show difference price

}

async function displayInfo(price) {

  clearInterval(interval);
  seconds = 0;
  interval = setInterval(setTime, 1000);
  setTime();

  priceArticlesContainer.innerHTML = generateHTML(price);
}

async function setPrice() {

  let diff = currentPrice - lastPrice;
  if (Math.abs(diff) >= diffPrice) {
    lastPrice = currentPrice;
    displayInfo((1 / currentPrice).toFixed(10));
  }

}

function generateHTML(price) {

  let map = {
    0: {
      'name': 'Bitcoin (BTC)',
      'btcPrice': price,
    }
  }

  let sections = '<section class="price-articles-section">';

  sections += createArticle(map[0]);
  section = '</section>';

  return sections;
}

function createArticle(currencyObject) {
  let article = templateHTML
    .replace(/{{name}}/g, currencyObject.name)
    .replace(/{{btcPrice}}/g, formatCurrency(currencyObject.btcPrice));
    console.log('here')
  return article;
}

function formatCurrency(number) {
  number = Number(number).toFixed(10);
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'EUR'
  });
}

function setTime() {
  let minutes = parseInt(seconds / 60);
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  let displaySeconds = seconds;
  displaySeconds %= 60;
  if (displaySeconds < 10) {
    displaySeconds = '0' + displaySeconds;
  }
  timeContainer.innerHTML = `${minutes}:${displaySeconds}`;
  seconds++;
}

startProcess();