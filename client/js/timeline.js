"use strict";

var TIMELINE_NUM_STATES = 1 << 9 // about 8.5 seconds at 60fps

function Timeline() {
	this.states = []
	this.events = [[]]
	this.time = 0
	this.dirtyTime = 0
}

(function(){

Timeline.prototype.connect = function(initState, send) {
	this.states[0] = initState
	this.currentState = initState
	this.send = send
}

Timeline.prototype.tick = function(tickF) {
	this.time++
	for (; this.dirtyTime < this.time; this.dirtyTime++) {
		let i = index(this.dirtyTime)
		let nextI = index(this.dirtyTime+1)

		this.states[nextI] = deepcopy(this.states[i])
		tickF(this.dirtyTime+1, this.events[i], this.states[nextI], send)
	}

	this.events[index(this.time)] = []
	this.currentState = this.states[i]
}

Timeline.prototype.onAddedEvent = function(event) {
	if (event.time <= this.time - TIMELINE_NUM_STATES) {
		throw "Got an event that was too old"
	} else if (event.time > this.time) {
		console.warn("Got an event from the future, it won't be added", event)
	}

	this.events[index(event.time)].push(event)
	this.dirtyTime = event.time
}

function index(time) { return time & (TIMELINE_NUM_STATES-1) }

})()
