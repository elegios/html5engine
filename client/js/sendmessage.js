"strict mode";

var MAX_TIME_GAP = console.warn("you need to set the maximum time gap for sendmessage.js")
//heavily inspired by SendMessage in Unity, might be useful to tie graphics to things

/*
  Useful for broadcasting events. Should be used when something happens that is (or may be) of
  interest elsewhere, but the current context has no interest in what that/those other places
  do with the information.

  Generally used to inform the graphics part of the fact that something has happen, say a shot
  has been fired.

  For example
  sendmessinstance.send("onShotFired", {x: <x>, y: <y>, dist: <dist calculation>})
  or something similar
*/

function SendMessage() {
	this.receivers = {}
}

SendMessage.prototype.connect = function(timekeeper) {
	this.timekeeper = timekeeper
}

SendMessage.prototype.addListener = function(name, receiverFunc) {
	if (!this.receivers[name])
		this.receivers[name] = []

	this.receivers[name].push(receiverFunc)
}

SendMessage.prototype.simpleAddListener = function(name, receiver) {
	this.addListener(name, receiver[name].bind(receiver))
}

/*
	time - the time from which the message is sent
				 if it is negative the message is always sent
	name - the name of the function to be called
	arg	- the argument to supply to the receiver
*/
SendMessage.prototype.send = function(time, name, arg) {
	if ((time < this.timekeeper.time - MAX_TIME_GAP || time > this.timekeeper.time) && time >= 0)
		return
	if (!this.receivers[name]) {
		console.warn("No receiver for message", name, arg)
		return
	}
	this.receivers[name].forEach(function(receiver) {
		receiver(arg, time >= 0 ? this.timekeeper.time - time : -1)
	})
}
