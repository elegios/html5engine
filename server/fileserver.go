package server

import (
	"net/http"
)

func SetupFileServer(clientDir string) {
	http.Handle("/", http.FileServer(http.Dir(clientDir)))
}
