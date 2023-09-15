

const buyOrders = [
    {
        orderId: 'b03',
        price: 22,
        amount: 283,
        side: 'buy',
    },
    {
        orderId: 'b00',
        price: 25,
        amount: 100,
        side: 'buy',
    },
    {
        orderId: 'b01',
        price: 24,
        amount: 215,
        side: 'buy',
    },
    {
        orderId: 'b02',
        price: 23,
        amount: 131,
        side: 'buy',
    },
    {
        orderId: 'b04',
        price: 21,
        amount: 283,
        side: 'buy',
    }
]

const sellOrders = [
    {
        orderId: 's00',
        price: 26,
        amount: 100,
        side: 'sell',
    },
    {
        orderId: 's03',
        price: 29,
        amount: 237,
        side: 'sell'
    },
    {
        orderId: 's01',
        price: 27,
        amount: 2365,
        side: 'sell',

    },
    {
        orderId: 's02',
        price: 28,
        amount: 3442,
        side: 'sell',
    },

]

const orderBook = {
    buyOrders,
    sellOrders,
}

module.exports.orderBook = orderBook;