import currency from 'currency.js'


export default class Money {
    constructor() {}

    static toCent(amount) {
        
        amount = currency(amount).multiply(100).value
        amount = parseInt(`${amount}`)

        return amount
    }

    static toDollar(amount) {
        
        amount = currency(amount, { fromCents: true}).value
        amount = parseFloat(`${amount}`)

        return amount
    }

    static multiply(a, b) {
        
        let total = currency(a).multiply(b).value
        total = parseFloat(`${total}`)

        return total
    }

    static divide(a, b) {
        
        let total = currency(a).divide(b).value
        total = parseFloat(`${total}`)

        return total
    }

    static format(amount, symbol = '$') {

        return currency(amount, { symbol: symbol, separator: ",", decimal: "." }).format()
    }
}