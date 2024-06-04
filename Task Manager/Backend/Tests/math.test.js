const {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add} = require('../math')

// test('calculating-tip', () => {
//     const total = calculateTip(100, .10);
//     expect(total).toBe(110)
// })

// test('calculating-tip with default value', () => {
//     const total = calculateTip(100);
//     expect(total).toBe(105)
// })

// test('should convert 32 F to 0 C', () => {
//     const result = fahrenheitToCelsius(32);
//     expect(result).toBe(0);
// })

// test('should convert 0 C to 32 F', () => {
//     const result = celsiusToFahrenheit(0);
//     expect(result).toBe(32);
// })


// test('SetTimeout', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(1);
//         done();
//     }, 2000)
// })

//done -> for async-function
// test('Add-To-Number', (done) => {
//     add(2,3).then((sum) => {             //we are handling add() like this, because it's returning a promise.
//         expect(sum).toBe(5)
//         done();
//     })
// })

//another way to handle async-function
test('Add-To-Number using Async-await', async () => {
    const sum = await add(10, 22);
    expect(sum).toBe(32);
})


