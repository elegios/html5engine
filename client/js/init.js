"use strict";

var MS_PER_FRAME = 1000/60 // /

var canvas

var init
(function(){

	var ctx

	var message
	var renderer
	var timeline
	var network
	var input
	var socket

	var prevTime
	var untickedTime

	init = function() {
		canvas = document.getElementById("view")
		ctx = canvas.getContext("2d")
		resize();
		window.addEventListener("resize", resize)

		socket = new WebSocket("ws://"+location.host+"/ws")

		message = new SendMessage()
		renderer = new Renderer()
		timeline = new Timeline()
		network = new Network()
		input = new Input()

		let send = message.send.bind(message)

		message.connect(timeline)
		renderer.connect(ctx)
		timeline.connect(send)
		network.connect(socket, start)
		input.connect(timeline, timeline, send)

		network.addListener("event", function(e) { send(-1, "onAddedEvent", e) })
		network.addListener("startInfo", input.setStartInfo.bind(input))
		network.addListener("startInfo", function(e) { timeline.setInitState(makeInitState(e)) })
		network.addListener("startInfo", network.sendPing.bind(network))
		network.addListener("startInfo", renderer.setStartInfo.bind(renderer))

		message.simpleAddListener("onAddedEvent", timeline)
		message.simpleAddListener("onAddedLocalEvent", network)

		window.addEventListener("keydown", input.keydown.bind(input))
		window.addEventListener("keyup", input.keyup.bind(input))
	}

	function start(time) {
		untickedTime = time
		prevTime = performance.now()
		update()
	}

	function update() {
		let now = performance.now()
		untickedTime += now - prevTime
		prevTime = now

		while (untickedTime >= MS_PER_FRAME) {
			timeline.tick(tick)
			untickedTime -= MS_PER_FRAME
		}

		renderer.render(timeline.currentState)
		window.requestAnimationFrame(update)
	}
})()

function resize() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}
