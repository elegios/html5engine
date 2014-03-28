package server

import (
	"code.google.com/p/go.net/websocket"
)

type player struct {
	conn  *websocket.Conn
	g     *game
	ready bool
	id    int
}

func newPlayer(conn *websocket.Conn) *player {
	return &player{
		conn: conn,
	}
}

func (p *player) listen() {
	var mess string
	for {
		err := websocket.Message.Receive(p.conn, &mess)
		if err != nil {
			log("Player got an error in websocket, will remove from game.", p, err)
			if p.g != nil {
				p.g.remChan <- p
			} else {
				wlog("Player wasn't assigned to a game, but probably will be, so one player in a game will be in error.")
			}
			return
		}

		if p.g == nil {
			wlog("A player has sent a message without being assigned to a game.")
			continue
		}

		switch mess {
		case "ping":
			websocket.Message.Send(p.conn, "pong")
			dlog("Player: Pong")

		case "ready":
			p.ready = true
			log("Player: Ready")
			p.g.messageChan <- message{mess, p}

		default:
			p.g.messageChan <- message{mess, p}
		}
	}
}

func (p *player) send(mess string) {
	websocket.Message.Send(p.conn, mess)
}
