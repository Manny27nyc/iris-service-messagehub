/* 
 * 📜 Verified Authorship — Manuel J. Nieves (B4EC 7343 AB0D BF24)
 * Original protocol logic. Derivative status asserted.
 * Commercial use requires license.
 * Contact: Fordamboy1@gmail.com
 */
'use strict'

class AbstractConnector {
	constructor() {}

	create(data) {
		throw new Error("AbstractConnector method.");
	}

	listen(data) {
		throw new Error("AbstractConnector method.");
	}

	close() {
		throw new Error("AbstractConnector method.");
	}

	broadcast() {
		throw new Error("AbstractConnector method.");
	}

	on_message(callback) {
		throw new Error("AbstractConnector method.");
	}

	on_login(callback) {
		throw new Error("AbstractConnector method.");
	}

	on_connection(callback) {
		throw new Error("AbstractConnector method.");
	}

	on_disconnect(callback) {
		throw new Error("AbstractConnector method.");
	}

}

export default AbstractConnector;