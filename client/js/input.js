"use strict";

function Input() {
}

Input.prototype.connect = function(timekeeper, send) {
	this.timekeeper = timekeeper
	this.send = send
}

Input.prototype.setPlayerInfo = function(info) {
	this.playerId = info.id
}

Input.prototype.keydown = function(event) {
}

Input.prototype.keyup = function(event) {
}

Input.prototype.addLocalEvent = function(event) {
	event.id = this.playerId
	this.send(this.timekeeper.time, "onAddedLocalEvent", event)
	this.send(this.timekeeper.time, "onAddedEvent", event)
}
