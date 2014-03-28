package server

import (
	"strconv"
)

func (g *game) start() {
	g.sendStartInfo()
	for m := range g.messageChan {
		switch m.mess {
		case "ready":
			g.startIfReady()

		default:
			g.sendToOthers(m)
		}
	}
}

func (g *game) startIfReady() {
	log("Game: Checking if everyone is ready")
	for _, p := range g.players {
		if !p.ready {
			return
		}
	}
	log("Game: Everyone ready, starting")
	for i, p := range g.players {
		p.id = i
		p.send("start")
	}
}

func (g *game) sendStartInfo() {
	count := strconv.Itoa(len(g.players))
	for _, p := range g.players {
		p.send("{\"playerCount\":" + count + ",\"playerId\":" + strconv.Itoa(p.id) + "}")
	}
}
