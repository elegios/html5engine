package server

import (
	"strconv"
)

func (g *game) start() {
	log("Game: Full game, sending player info")
	g.sendStartInfo()
	for {
		select {
		case m := <-g.messageChan:
			switch m.mess {
			case "ready":
				g.startIfReady()

			default:
				g.sendToOthers(m)
			}

		case p := <-g.remChan:
			g.rem(p)
			if len(g.players) == 0 {
				log("Game: Empty, shutting it down")
				return
			}
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

func (g *game) sendStartInfo() {
	count := strconv.Itoa(len(g.players))
	for i, p := range g.players {
		p.id = i
		p.send("{\"mType\":\"startInfo\",\"playerCount\":" + count + ",\"playerId\":" + strconv.Itoa(p.id) + "}")
	}
}
