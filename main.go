package main

import (
	server "./server" // Not very pretty
	"log"
	"net/http"
)

func main() {
	server.SetupSocketServer()
	server.SetupFileServer("./client")
	log.Println("Done setting up, listening...")
	log.Fatal(http.ListenAndServe(":9000", nil))
}
