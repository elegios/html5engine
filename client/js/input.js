"use strict";

function Input() {
}

Input.prototype.connect = function(timekeeper, statekeeper, send) {
	this.timekeeper = timekeeper
	this.statekeeper = statekeeper
	this.send = send
}

Input.prototype.setStartInfo = function(info) {
	this.playerId = info.playerId
}

Input.prototype.keydown = function(event) {
}

Input.prototype.keyup = function(event) {
}

Input.prototype.addLocalEvent = function(event) {
	event.id = this.playerId
	event.time = this.timekeeper.time
	this.send(this.timekeeper.time, "onAddedLocalEvent", event)
	this.send(this.timekeeper.time, "onAddedEvent", event)
}
