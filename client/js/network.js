"strict mode";

var LATENCY_MEMORY = (1 << 3) - 1

function Network() {
	this.listeners = []

  this.latencyMemory = []
  this.latencyIndex = 0

}

Network.prototype.connect = function(websocket, startFunction) {
	if (!websocket)
		return

	this.queue = []
	this.startFunction = startFunction
	this.websocket = websocket

  websocket.onmessage = function(mess) {
    switch (mess.data) {
      case "pong":
        this.latencyMemory[this.latencyIndex & LATENCY_MEMORY] = performance.now() - this.lastTime
        this.latencyIndex++
        if (this.latencyIndex > LATENCY_MEMORY) {
          websocket.send("ready")
        } else {
          this.sendPing()
        }
        return

      case "start":
        this.startFunction(this.latencyMemory.reduce(function(a, b) { return a + b }) / this.latencyMemory.length) // /
        return

      default:
        this.onReceivedData(JSON.parse(mess.data))
    }
  }.bind(this)
}

Network.prototype.addListener = function(mType, func) {
	if (!this.listeners[mType])
		this.listeners[mType] = []

	this.listeners[mType].push(func)
}

Network.prototype.send = function(data, sendPlain) {
  if (sendPlain) {
    this.websocket.send(data)
  } else {
    this.websocket.send(JSON.stringify(data))
  }
}

Network.prototype.sendPing = function() {
  if (!this.queue)
    return

  this.lastTime = performance.now()
  this.websocket.send("ping")
}

Network.prototype.send = function(data) {
	this.websocket.send(JSON.stringify(data))
}

Network.prototype.onAddedLocalEvent = function(event) {
  if (!this.queue)
    return

	event.mType = "event"
  this.queue.push(event)

  console.warn("You should set the events that should queue up in network.js")
  if (this.queue.length < MAX_QUEUE_LENGTH && event.type === "mousemove")
    return

  this.flush()
}

Network.prototype.flush = function() {
  this.websocket.send(JSON.stringify(this.queue))
  this.queue.length = 0
}

Network.prototype.onReceivedData = function(data) {
	let net = this
	function receive(d) {
		let t = d.mType
		delete d.mType
		if (net.listeners[t]) {
			net.listeners[t].forEach(function(f) { f(d) })
		} else {
			console.warn("Got data with no receiver", d)
		}
	}

	if (data.length) {
		data.forEach(receive)
	} else {
		receive(data)
	}
}
