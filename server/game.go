package server

import (
	"encoding/json"
)

type game struct {
	players     []*player
	messageChan chan message
	remChan     chan *player
}

type message struct {
	mess   string
	origin *player
}

func (g *game) add(p *player) {
	g.players = append(g.players, p)
	p.g = g // Potential datarace, probably not important
}

func (g *game) rem(p *player) {
	for i, other := range g.players {
		if other == p {
			if len(g.players) > 1 {
				g.players[i] = g.players[len(g.players)-1]
			}
			g.players = g.players[:len(g.players)-1]
			return
		}
	}
}

func (g *game) isFull() bool {
	return len(g.players) >= 2
}

func (g *game) gatherPlayers(pChan chan *player) {
	for {
		select {
		case p := <-pChan:
			g.add(p)
			if g.isFull() {
				spawnNewGame(pChan)
				g.start()
			}

		case p := <-g.remChan:
			g.rem(p)
		}
	}
}

type identification struct {
	Id int `json:"id"`
}

func (g *game) sendToOthers(m message) {
	var data identification
	json.Unmarshal([]byte(m.mess), &data)
	if data.Id != m.origin.id {
		wlogf("Player %d has tried to send a message as player %d, but the message was dropped.", m.origin.id, data.Id)
		return
	}
	for _, p := range g.players {
		if p == m.origin {
			continue
		}
		p.send(m.mess)
	}
}

func newGame() *game {
	return &game{
		messageChan: make(chan message),
		remChan:     make(chan *player, 1),
	}
}

func spawnNewGame(newPlayerChan chan *player) {
	go newGame().gatherPlayers(newPlayerChan)
}
