"strict mode";

var LATENCY_MEMORY = (1 << 3) - 1

function Network(websocket, startFunction, listeners) {
  if (!websocket)
    return

  this.startFunction = startFunction
  this.websocket = websocket
  this.listeners = listeners
  var latencyMemory = []
  var latencyIndex = 0

  websocket.onmessage = function(mess) {
    switch (mess.data) {
      case "pong":
        latencyMemory[latencyIndex & LATENCY_MEMORY] = performance.now() - this.lastTime
        latencyIndex++
        if (latencyIndex > LATENCY_MEMORY) {
          websocket.send("ready")
        } else {
          this.sendPing()
        }
        return

      case "start":
        this.startFunction(latencyMemory.reduce(function(a, b) { return a + b }) / latencyMemory.length)
        return

      default:
        this.onReceivedData(JSON.parse(mess.data))
    }
  }.bind(this)
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

Network.prototype.connect = function(timeline) {
  this.timeline = timeline
}

Network.prototype.onAddedLocalEvent = function(event) {
  if (!this.queue)
    return

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
  if (data.mType) {
    if (this.listeners[data.mType]) {
      this.listeners[data.mType](data)
    } else {
      console.warn("Got data with no receiver.", data)
    }

    return
  }

  this.timeline.addAndReplayEvents(data)
}