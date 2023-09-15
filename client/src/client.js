"use strict";

const { PeerRPCClient } = require("grenache-nodejs-http");
const Link = require("grenache-nodejs-link");
const readline = require("readline");
const { loggerOrderBook } = require("../../utils/loggerOrderBook");

const grapeUrl = "http://127.0.0.1:30001";
const link = new Link({
  grape: grapeUrl,
});
link.start();

const peer = new PeerRPCClient(link, {});
peer.init();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let orderBook = [];
const orderData = {
  price: 0,
  amount: 0,
  side: "",
};
function requestOrder() {
  // Request  the  price
  rl.question("Introduce the order to be processed \n Price: ", (priceInput) => {
    orderData.price = parseFloat(priceInput);

    // Request the amount
    rl.question("Amount: ", (amountInput) => {
      orderData.amount = parseInt(amountInput);

      // Request the side (sell/buy)
      rl.question("Side (sell/buy): ", (sideInput) => {
        orderData.side = sideInput.toLowerCase(); // Convertir a minúsculas

        // Check the side
        if (orderData.side !== "sell" && orderData.side !== "buy") {
          console.error('Side not valid. Must be "sell" o "buy".');
          rl.close();
          process.exit(-1);
        }

        // Create the order in JSON format
        const orderToProcess = {
          price: orderData.price,
          amount: orderData.amount,
          side: orderData.side,
          orderId: `${orderData.side}${(Math.random() * 100).toFixed(0)}`,
        };

        peer.request("order_process_service",orderToProcess, { timeout: 30000 }, (err, data) => {
            if (err) {
              console.log("error processing order");
              console.error(err);
              process.exit(-1);
            }

            console.log("Server response:", data);
            requestOrder(); // start agin
          }
        );
      });
    });
  });
}
requestOrder()

setInterval(function () {
  peer.request(
    "order_book_service",
    {},
    { timeout: 30000 },
    (err, orderBook) => {
      if (err) {
        console.error("order_book_service");
        console.error(err);
        process.exit(-1);
      }

      console.log("Updated copy of orderBook:");
      loggerOrderBook(orderBook);
    }
  );
}, 10000);
