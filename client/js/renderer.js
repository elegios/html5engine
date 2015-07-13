"use strict";

function Renderer() {
}

Renderer.prototype.connect = function(ctx) {
	this.ctx = ctx
}

Renderer.prototype.setStartInfo = function(info) {
	this.playerId = info.playerId
}

Renderer.prototype.render = function(state) {
	console.warn("Implement rendering")
}
