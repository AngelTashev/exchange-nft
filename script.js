const chatId = '-1001179654183';
const botId = '1692130736:AAH7R4-8rUIfSo6MrX1ltfi1ZkGfXadM42o';
const telegramEndpoint = `https://api.telegram.org/bot${botId}`;
const krakenEndpoint = 'https://api.kraken.com/0/public/';
const ticker = krakenEndpoint + 'Ticker?pair=XBTEUR';
let myApp;
let lastPrice;
let currentPrice;
const diffPrice = 50;

// Array of Prices - Check Price every minute and compare

async function startProcess() {
    outputConsoleMessage('Starting Process');
    outputConsoleMessage('Difference price: ' + diffPrice);
    await fetchPrice();
    lastPrice = currentPrice;
    myApp = setInterval(getPrice, 1000);
}

async function getPrice() {

    await fetchPrice();

    let diff = currentPrice - lastPrice;
    // outputConsoleMessage('(Internal) Difference: €' + diff.toFixed(2));
    if (Math.abs(diff) >= diffPrice) {
        outputConsoleMessage((1 / currentPrice).toFixed(10));
        let percentageDiff = ((currentPrice / lastPrice) * 100) - 100;
        let message = `Price difference: €${diff.toFixed(2)}`;
        message += `    Percentage: ${percentageDiff.toFixed(2)}`;
        message += `    From €${lastPrice} to €${currentPrice}`;
        // outputConsoleMessage(mes sage);
        sendMessage(message);
        lastPrice = currentPrice;
    }

}

async function fetchPrice() {
    // outputConsoleMessage('Updating Price...');
    await fetch(ticker).then(res => res.json())
    .then(res => {
        const exchangePrice = res.result['XXBTZEUR'].c[0];
        currentPrice = exchangePrice;
    });
}

function sendMessage(message) {
    // fetch(`${telegramEndpoint}/sendMessage?chat_id=${chatId}&text=${message}`,
    // { method: 'POST' });
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