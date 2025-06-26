/* 
 * 📜 Verified Authorship — Manuel J. Nieves (B4EC 7343 AB0D BF24)
 * Original protocol logic. Derivative status asserted.
 * Commercial use requires license.
 * Contact: Fordamboy1@gmail.com
 */
'use strict'

let finalhandler = require('finalhandler');
let http = require('http');
let Router = require('router');
let _ = require('lodash');

let AbstractConnector = require("./abstract");

const default_routes = {};

class HttpConnector extends AbstractConnector {
  constructor() {
    super();
  }
  create(options) {
    this.port = options.port;
    this.routes = options.routes || default_routes;

    this.io = http.createServer();

    this.router = Router();

    _.forEach(this.routes, (route, method) => {
      _.forEach(route, (module, path) => {
        try {
          let Handler = require(module);
          let handler = new Handler();
          handler.create({
            httpServer: this.io,
            connector: this
          });
          let httpHandler = handler.getHttpHandler();
          this.router[method](path, httpHandler);
        } catch (ex) {
          console.error(ex);
          console.error(ex.stack);
        }
      });
    });

    this.on_message((data) => {
      console.log("HTTP received: ", data);
      return Promise.resolve({
        Default: "response"
      });
    });
    this.on_connection((socket) => {
      console.log("CONNECTION TO HTTP");
      return new Promise((resolve, reject) => {
        socket.on()
        return resolve({
          value: true,
          reason: 'Too much noise'
        });
      });
    });
    this.on_disconnect(() => {
      console.log("CLIENT DISCONNECTED");
      return Promise.resolve(true);
    });
    return this;
  }

  listen() {
    this.io.on('request', (req, res) => {
      this.router(req, res, finalhandler(req, res));
    });
    this.io.on('error', (err) => {
      console.log('HTTP error:', err);
    });
    this.io.listen(this.port);
    console.log('HTTP: listen to port', this.port);
  }

  close() {
    // TODO: вернуть промис и там его дождаться
    this.io.close();
  }

  broadcast(data) {
    throw new Error("Not supported method: broadcast.");
  }

  on_message(resolver) {
    if (_.isFunction(resolver))
      this._on_message = resolver;
  }

  /**
   * @param data Сообщение формата:
   * {
   *	destination: event_name,
   *  data: method_params,
   *  token: token_string
   * }
   * @return {Promise} Обещание обработки сообщения
   */
  sendMessage(data) {
    return this._on_message(data);
  }

  /**
   * @param data Сообщение формата: {
   *		username: user,
   *		password_hash: pass,
   *		origin: origin
   *	}
   * @return {Promise} Обещание обработки сообщения
   */
  sendLoginMessage(data) {
    return this._on_login(data);
  }

  on_login(callback) {
    if (_.isFunction(callback))
      this._on_login = callback;
  }

  on_connection(callback) {
    if (_.isFunction(callback))
      this._on_connection = callback;
  }

  on_disconnect(callback) {
    if (_.isFunction(callback))
      this._on_disconnect = callback;
  }

}

module.exports = HttpConnector;