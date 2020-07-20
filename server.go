// This server is for local development, since at the moment
// all the assets are static I just use nginx.
package main

import (
	"log"
	"net/http"
	"strings"
	"text/template"
	"flag"
	"bytes"
	"fmt"
	"io/ioutil"
	"os"
	"path"
)

var pages = make(map[string]string)

var generate = flag.Bool("generate", false, "Generate templates")

// Initialize page contents from layout template
func init() {
	flag.Parse()
	layoutBytes, err := ioutil.ReadFile("./layout.html")
	if err != nil {
		log.Fatal(err)
	}
	layout := template.New("layout")
	layout = template.Must(layout.Parse(string(layoutBytes)))
	if err != nil {
		log.Fatal(err)
	}
	var buf bytes.Buffer
	fileInfos, err := ioutil.ReadDir("./templates")
	if err != nil {
		log.Fatal(err)
	}
	for _, fileInfo := range fileInfos {
		filePath := path.Join("./templates", fileInfo.Name())
		fileContents, err := ioutil.ReadFile(filePath)
		if err != nil {
			log.Fatal(err)
		}
		layout.Execute(&buf, string(fileContents))
		pageName := strings.TrimSuffix(fileInfo.Name(), ".html")
		pages[pageName] = buf.String()
		buf.Reset()
	}
}

func handle404(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, pages["404"])
	} else {
		fmt.Fprintf(w, pages["index"])
	}
}

func serve() {
	generateTemplates()
	css_fs := http.FileServer(http.Dir("./css/"))
	js_fs := http.FileServer(http.Dir("./js/"))
	favicon_fs := http.FileServer(http.Dir("./favicon/"))
	http.Handle("/css/", http.StripPrefix("/css/", css_fs))
	http.Handle("/js/", http.StripPrefix("/js/", js_fs))
	http.Handle("/favicon/", http.StripPrefix("/favicon/", favicon_fs))
	for page, _ := range pages {
		http.HandleFunc("/"+page, func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, path.Join("pages", page))
		})
	}
	http.HandleFunc("/", handle404)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func generateTemplates() {
	dirname := "pages"
	os.Mkdir(dirname, 0755)
	for page, contents := range pages {
		filename := path.Join(dirname, page) + ".html"
		fmt.Println(filename)
		ioutil.WriteFile(filename, []byte(contents), 0655)
	}
}

func main() {
	fmt.Println(*generate)
	if (*generate) {
		generateTemplates()
	} else {
		serve()
	}
}
