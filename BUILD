load("@io_bazel_rules_go//go:def.bzl", "go_binary")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("@io_bazel_rules_docker//docker/package_managers:download_pkgs.bzl", "download_pkgs")
load("@io_bazel_rules_docker//docker/package_managers:install_pkgs.bzl", "install_pkgs")

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
    srcs = ["layout.html"] + ["templates/%s" % t for t in TEMPLATES],
    outs = ["pages/%s" % t for t in TEMPLATES],
    cmd = "$(location templates_generator) -layout '$(location layout.html)'" +
          " ".join([" -template $(location templates/%s) -out $(location pages/%s)" % (t, t) for t in TEMPLATES]),
    tools = [":templates_generator"],
)

download_pkgs(
    name = "python_pkgs",
    image_tar = "@debian11_slim//image",
    packages = [
        "python3",
        "python3-dev",
    ],
)

install_pkgs(
    name = "python_pkgs_image",
    image_tar = "@distroless_base_debian11_debug//image",
    installables_tar = ":python_pkgs.tar",
    # installation_cleanup_commands = "rm -rf /var/lib/apt/lists/*",
    output_image_name = "python_pkgs_image",
)

container_image(
    name = "python_bazel_wrapper",
    base = ":python_pkgs_image.tar",
    cmd = ["python"],
)
