// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
'use strict'

let ConnectorHolder = require("./connector/holder");
let auth = require('iris-auth-util');
let emitter = require("global-queue");

class MessageHub {
	constructor() {
		this.emitter = emitter;
	}
	init(options) {
		this.connectors = new ConnectorHolder(options.default_options);
		this.connectors.addMulti(options.connectors);
		this.connectors.listen();
		this.connectors.on_login(({
			username: user,
			password_hash: pass,
			origin: origin
		}) => {
			console.log("USERPASS", user, pass, origin);
			//@TODO: check auth here: userpass
			return auth.authorize({
					user: user,
					password_hash: pass,
					address: origin
				})
				.catch((err) => {
					console.warn('AUTH failed for:', user, pass, origin);
					console.error(err);
					if ('undefined' !== typeof err.stack) {
						console.error(err.stack);
					}
					return {
						value: false,
						reason: "Internal error."
					}
				});
		});
		this.connectors.on_message((data) => {
			console.log("DATA", data);
			//check auth here: data.token
			//then route
			let token = data.token;
			return auth.check({
					token: token
				})
				.then((result) => {
					if(result.value == true) {
						//result.data is user session
						//@TODO: check permissions here
						return this.emitter.addTask(data.destination, data.data);
					} else {
						console.warn('AUTH check failed for token:', token);
						return result;
					}
				})
				.catch((err) => {
					console.warn('AUTH check failed for:', token);
					console.error(err);
					if ('undefined' !== typeof err.stack) {
						console.error(err.stack);
					}
					return {
						value: false,
						reason: "Internal error."
					}
				});
		});
	}
}

module.exports = MessageHub;