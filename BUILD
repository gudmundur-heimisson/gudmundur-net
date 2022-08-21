load("@io_bazel_rules_go//go:def.bzl", "go_binary")

TEMPLATES = [
    "404.html",
    "index.html",
]

go_binary(
    name = "templates_generator",
    srcs = ["templates_generator.go"],
)

filegroup(
    name = "css_files",
    srcs = glob(["css/**/*"]),
)

filegroup(
    name = "favicon_files",
    srcs = glob(["favicon/**/*"]),
)

filegroup(
    name = "js_files",
    srcs = glob(["js/**/*"]),
)

genrule(
    name = "generate_templates",
    srcs = [
        ":css_files",
        ":favicon_files",
        ":js_files",
        "layout.html",
    ] + ["templates/%s" % t for t in TEMPLATES],
    outs = ["pages/%s" % t for t in TEMPLATES],
    cmd = "$(location templates_generator) -layout '$(location layout.html)'" +
          " ".join([" -template $(location templates/%s) -out $(location pages/%s)" % (t, t) for t in TEMPLATES]),
    tools = [":templates_generator"],
)
