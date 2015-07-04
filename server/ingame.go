package server

import (
	"strconv"
)

func (g *game) start() {
	log("Game: Full game, sending player info")
	g.sendPlayerInfo()
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
	g.sendToAll("start")
}

func (g *game) sendPlayerInfo() {
	count := strconv.Itoa(len(g.players))
	for i, p := range g.players {
		p.id = i
		p.send("{\"mType\":\"playerInfo\",\"playerCount\":" + count + ",\"playerId\":" + strconv.Itoa(p.id) + "}")
	}
}
