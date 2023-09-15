class BrainExchange {
    constructor(orderBook) {
        this.orderBook = orderBook;
    }

// Add an order to the order book
   addOrder(orderSide, order) {
      try {
            console.log(`Adding order:`, order);
            const orders = this.orderBook[orderSide];
            const ordersLength = orders.length;

            for (let i = 0; i < ordersLength; i++) {
                const existingOrder = orders[i];

                if (existingOrder.price === order.price) {
                // If an order exists with the same price, update the quantity
                existingOrder.amount -= order.amount;
                return;
                } else if (existingOrder.price < order.price) {
               // Inserts the new order before the existing order if it is lower in price.
                this.orderBook[orderSide].splice(i, 0, order);
                return;
                }
            }

            // If an existing order was not found or the new order is the highest priced order, add it at the end.
            this.orderBook[orderSide].push(order);
        } catch (error) {
          console.log(`Error adding order:`, error);
        }
    }

    // Delete an order from the order book
    removeOrder(orderSide, orderId) {
        try{
            console.log(`Deleting order: ${orderId}`);
            const filteredOrders = this.orderBook[orderSide].filter(order => order.orderId !== orderId);
            this.orderBook[orderSide] = filteredOrders;
        } catch (error) {
            console.logger(`Error processing the order:`, error);

        }

    }

// Process an order and return the operations performed
    process(order) {
        console.log(`Processing order:`, order);
        try {
            const trades = [];

            // Search in the corresponding order array according to the order side
            const matchingSide = order.side === 'sell' ? 'buyOrders' : 'sellOrders';

            const ordersLength = this.orderBook[matchingSide].length;

            for(let i = 0; i < ordersLength; i++) {
                const currentOrder = this.orderBook[matchingSide][i];

                if(currentOrder.price > order.price) {
                    break;
                }

                // fill all order
                if(currentOrder.amount >= order.amount) {
                    trades.push({ takerOrderId: order.orderId, makerOrderId: currentOrder.orderId, amount: order.amount, price: currentOrder.price });

                    currentOrder.amount -= order.amount;
                    if(currentOrder.amount === 0) {
                        this.removeOrder(matchingSide, currentOrder.orderId);
                    }

                    order.amount = 0;
                    break;
                }

                // Fill partial order and continue
                if(currentOrder.amount < order.amount) {
                    trades.push({ takerOrderId: order.orderId, makerOrderId: currentOrder.orderId, amount: currentOrder.amount, price: currentOrder.price });

                    order.amount -= currentOrder.amount;

                    this.removeOrder(matchingSide, currentOrder.orderId);
                }
            }

            // Add the rest of the order to the order book if necessary.
            if (order.amount > 0){
                this.addOrder(matchingSide, order);
            }

            return trades;

        } catch (error) {
            console.logger(`Error processing order:`, error);

        }

    }
}

module.exports.BrainExchange = BrainExchange;
