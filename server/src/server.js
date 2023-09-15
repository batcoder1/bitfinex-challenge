'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const { BrainExchange } = require('./brainExchange')
const grapeUrl = process.env.GRAPE_URL || 'http://127.0.0.1:30001';
const timeout = process.env.TIMEOUT || 30000

// Initialization of the order book with some initial buy offers and sell offers
const { orderBook } = require('../../orderBook');
const { loggerOrderBook } = require('../../utils/loggerOrderBook');

// be sure that the buyOrder array is sorted by price descending and sellOrder is sorted by price ascending
orderBook.buyOrders.sort((a, b) => b.price - a.price);
orderBook.sellOrders.sort((a, b) => a.price - b.price);


const link = new Link({
  grape: grapeUrl
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout
})
peer.init();

loggerOrderBook(orderBook)
const orderExchange = new BrainExchange(orderBook);


const port = 1024 + Math.floor(Math.random() * 1000)
const processOrderService = peer.transport('orderProcessService')
processOrderService.listen(port)
console.log(`Service listening on port ${port}` )

setInterval(function () {
  link.announce('order_process_service', processOrderService.port, {})
}, 1000)

processOrderService.on('request', (rid, key, payload, handler) => {

  console.log(`new order:`, payload);
  const trades = orderExchange.process(payload);

  console.log(`Operation processed:`, trades);

  // Respond with the operations processed.
  handler.reply(null, trades)
  orderBook.buyOrders.sort((a, b) => b.price - a.price);
  orderBook.sellOrders.sort((a, b) => a.price - b.price);
  loggerOrderBook(orderBook)
});


// orderBookService to distribute the orderBook
const orderBookService = peer.transport('order_book_service');
const orderBookServicePort = 1024 + Math.floor(Math.random() * 1000)
orderBookService.listen(orderBookServicePort); // Puerto para el servicio de orderBook

// announce the service
setInterval(function () {
 link.announce('order_book_service', orderBookService.port, {});
}, 1000)

// handle orderBook requests
orderBookService.on('request', (rid, key, payload, handler) => {
  handler.reply(null, orderBook);
});


