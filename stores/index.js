import AccountStore from "./accountStore";
import SwapStore from './swapStore'

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

const accountStore = new AccountStore(dispatcher, emitter)
const swapStore = new SwapStore(dispatcher, emitter)

export default {
  accountStore: accountStore,
  swapStore: swapStore,
  dispatcher: dispatcher,
  emitter: emitter
};
