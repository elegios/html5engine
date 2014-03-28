package server

import (
	"code.google.com/p/go.net/websocket"
	"net/http"
)

type sockServer struct {
	addChan chan *player
}

func SetupSocketServer() {
	s := newSockServer()
	spawnNewGame(s.addChan)

	http.Handle("/ws", websocket.Handler(s.handler))
}

func (s *sockServer) handler(conn *websocket.Conn) {
	p := newPlayer(conn)
	s.addChan <- p
	p.listen()
}

func newSockServer() *sockServer {
	return &sockServer{
		addChan: make(chan *player),
	}
}
