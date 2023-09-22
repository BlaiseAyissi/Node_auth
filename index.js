const logEvent = require('./middleware/logEvent');

const eventEmitter = require('events');

class MyEmitter extends eventEmitter {};

const myEmitter = new MyEmitter();

myEmitter.on('log', (msg) => logEvent(msg));

setTimeout(()=>{
    myEmitter.emit('log', 'Log event emitted')
},2000);