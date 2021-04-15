const chatId = '-1001179654183';
const botId = '1692130736:AAH7R4-8rUIfSo6MrX1ltfi1ZkGfXadM42o';
const telegramEndpoint = `https://api.telegram.org/bot${botId}`;
const krakenEndpoint = 'https://api.kraken.com/0/public/';
const ticker = krakenEndpoint + 'Ticker?pair=XBTEUR';
let myApp;
let lastPrice = 0;
let currentPrice;
const diffPrice = 50;

const regex = /"(.*?)"/;

const webSocketUrl = "wss://ws.kraken.com/";
var globalIsWebSocketOpen = false;

// Array of Prices - Check Price every minute and compare

function openWebSocket() {
  
    socket = new WebSocket(webSocketUrl);
    socket.onopen = function () {
      outputConsoleMessage("Service started! :)")
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
        outputConsoleMessage('Subscribing to Kraken...');
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

async function setPrice() {

    let diff = currentPrice - lastPrice;
    console.log(diff);
    if (Math.abs(diff) >= diffPrice) {
        outputConsoleMessage((1 / currentPrice).toFixed(10));
        let percentageDiff = ((currentPrice / lastPrice) * 100) - 100;
        let message = `Price difference: €${diff.toFixed(2)}`;
        message += `    Percentage: ${percentageDiff.toFixed(2)}`;
        message += `    From €${lastPrice} to €${currentPrice}`;
        lastPrice = currentPrice;
    }

}

function outputConsoleMessage(message) {
    var consoleOutput = document.getElementById("outputConsole");
  
    var d = new Date();
  
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
  
  
    var msg = h + ":" + m + ":" + s + " " + message;
  
    consoleOutput.innerHTML += msg + "<br/>";
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }