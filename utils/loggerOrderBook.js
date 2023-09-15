function loggerOrderBook(orderBook) {
   orderBook.buyOrders.sort((a, b) => b.price - a.price);
   orderBook.sellOrders.sort((a, b) => a.price - b.price);
    const r = orderBook
    console.log(`-------------------------|------------------------`);
    console.log(`    BIDS (buyOrders)      |   ASK(sellOrders) `);
    console.log(`-------------------------|------------------------`);
    console.log(`   PRICE     AMOUNT      |    PRICE     AMOUNT `);
    console.log(`-------------------------|------------------------`);
    for (let index = 0; index < 10; index++) {
      const buyAmount = parseFloat(r.buyOrders[index]?.amount)
      const sellAmount = parseFloat(r.sellOrders[index]?.amount);
      console.log(
        ` ${
          r.buyOrders[index]?.price === undefined
            ? '         '
            : r.buyOrders[index]?.price.toFixed(5)
        } - ${isNaN(buyAmount) ? '         ' : buyAmount.toFixed(5)}   |  ${
          r.sellOrders[index]?.price == undefined
            ? '         '
            : r.sellOrders[index]?.price.toFixed(5)
        } - ${isNaN(sellAmount) ? '     ' : sellAmount.toFixed(5)}`,
      );
    }
    console.log(
      `**************************************************************`,
    );
}

module.exports.loggerOrderBook = loggerOrderBook;
