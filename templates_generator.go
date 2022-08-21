package main

import (
	"bytes"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
	"text/template"
)

type StringArrayFlag []string

func (s *StringArrayFlag) String() string {
	return strings.Join(*s, ", ")
}

func (s *StringArrayFlag) Set(value string) error {
	*s = append(*s, value)
	return nil
}

type PageInfo struct {
	contents string
	out      string
}

var pages = make(map[string]PageInfo)

func generateTemplates() {
	for _, page := range pages {
		os.WriteFile(page.out, []byte(page.contents), 0655)
		fmt.Println("written")
	}
}

func main() {
	var template_files StringArrayFlag
	var out_files StringArrayFlag
	var layout_file = flag.String("layout", "BAD", "Layout file")
	flag.Var(&template_files, "template", "Template files")
	flag.Var(&out_files, "out", "Output files")
	flag.Parse()
	fmt.Println("args")
	for _, arg := range os.Args {
		fmt.Println(arg)
	}
	fmt.Println("end args")
	// read layout
	layoutBytes, err := os.ReadFile(*layout_file)
	if err != nil {
		log.Fatal(err)
	}
	layout := template.New("layout")
	// parse layout
	layout = template.Must(layout.Parse(string(layoutBytes)))
	var buf bytes.Buffer
	// apply the layout to each template
	for idx, template_file := range template_files {
		fileInfo, err := os.Stat(template_file)
		if err != nil {
			log.Fatal(err)
		}
		fileContents, err := os.ReadFile(template_file)
		if err != nil {
			log.Fatal(err)
		}
		layout.Execute(&buf, string(fileContents))
		pageName := strings.TrimSuffix(fileInfo.Name(), ".html")
		pages[pageName] = PageInfo{
			contents: buf.String(),
			out:      out_files[idx],
		}
		buf.Reset()
	}
	generateTemplates()
}
