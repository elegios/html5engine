package server

import (
	stdlogging "log"
	"os"
)

const (
	debug = true
)

var (
	warnlog = stdlogging.New(os.Stdout, "WARN ", stdlogging.LstdFlags)
	stdlog  = stdlogging.New(os.Stdout, "     ", stdlogging.LstdFlags)
	dblog   = stdlogging.New(os.Stdout, "DBG  ", stdlogging.LstdFlags)
)

func wlog(v ...interface{}) {
	warnlog.Println(v...)
}

func wlogf(format string, v ...interface{}) {
	warnlog.Printf(format, v...)
}

func log(v ...interface{}) {
	stdlog.Println(v...)
}

func logf(format string, v ...interface{}) {
	stdlog.Printf(format, v...)
}

func dlog(v ...interface{}) {
	if !debug {
		return
	}
	dblog.Println(v...)
}

func dlogf(format string, v ...interface{}) {
	if !debug {
		return
	}
	dblog.Printf(format, v...)
}
