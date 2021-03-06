"use strict";

var TIMELINE_NUM_STATES = 1 << 9 // about 8.5 seconds at 60fps

function Timeline() {
	this.states = []
	this.events = [[]]
	this.time = 0
	this.dirtyTime = 0
}

(function(){

Timeline.prototype.connect = function(send) {
	this.send = send
}

Timeline.prototype.setInitState = function(initState) {
	if (this.currentState) {
		console.warn("Attempted to set the initial state of the timeline multiple times")
		return
	}
	console.log("Set the initial state")
	this.states[0] = initState
	this.currentState = initState
}

Timeline.prototype.tick = function(tickF) {
	this.time++
	for (; this.dirtyTime < this.time; this.dirtyTime++) {
		let i = index(this.dirtyTime)
		let nextI = index(this.dirtyTime+1)

		this.states[nextI] = deepcopy(this.states[i])
		tickF(this.dirtyTime+1, this.events[i], this.states[nextI], this.send)
	}

	let i = index(this.time)
	if (this.futureEvents[this.time]) {
		this.events[i] = this.futureEvents[this.time]
		delete this.futureEvents[this.time]
	} else {
		this.events[i] = []
	}
	this.currentState = this.states[i]
}

Timeline.prototype.onAddedEvent = function(event) {
	if (event.time <= this.time - TIMELINE_NUM_STATES) {
		throw "Got an event that was too old"
	} else if (event.time > this.time) {
		if (!this.futureEvents[event.time])
			this.futureEvents[event.time] = []

		this.futureEvents[event.time].push(event)
		return
	}

	this.events[index(event.time)].push(event)
	this.dirtyTime = event.time
}

function index(time) { return time & (TIMELINE_NUM_STATES-1) }

})()
