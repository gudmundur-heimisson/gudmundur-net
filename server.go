// This server is for local development, since at the moment
// all the assets are static I just use nginx.
package main

import (
	"log"
	"net/http"
)

func main() {
	css_fs := http.FileServer(http.Dir("./css/"))
	js_fs := http.FileServer(http.Dir("./js/"))
	static_fs := http.FileServer(http.Dir("./static/"))
	favicon_fs := http.FileServer(http.Dir("./favicon/"))
	http.Handle("/css/", http.StripPrefix("/css/", css_fs))
	http.Handle("/js/", http.StripPrefix("/js/", js_fs))
	http.Handle("/favicon/", http.StripPrefix("/favicon/", favicon_fs))
	http.Handle("/", static_fs)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
