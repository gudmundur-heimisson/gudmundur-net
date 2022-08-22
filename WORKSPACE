load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# go rules
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "16e9fca53ed6bd4ff4ad76facc9b7b651a89db1689a2877d6fd7b82aa824e366",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.34.0/rules_go-v0.34.0.zip",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.34.0/rules_go-v0.34.0.zip",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains(version = "1.19")

# docker rules
# http_archive(
#     name = "io_bazel_rules_docker",
#     sha256 = "b1e80761a8a8243d03ebca8845e9cc1ba6c82ce7c5179ce2b295cd36f7e394bf",
#     urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.25.0/rules_docker-v0.25.0.tar.gz"],
# )
# local_repository(
#     name = "io_bazel_rules_docker",
#     path = "../rules_docker",
# )

load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

git_repository(
    name = "io_bazel_rules_docker",
    branch = "fix-docker-executable-quoting",
    remote = "https://github.com/gudmundur-heimisson/rules_docker.git",
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load("@io_bazel_rules_docker//container:pull.bzl", "container_pull")

container_pull(
    name = "distroless_base_debian11",
    digest = "sha256:d4d57ef52d993ae3d11722ef9d5544980068309085df4c16ae9a0077ab36e218",
    registry = "gcr.io",
    repository = "distroless/base-debian11",
    # tag field is ignored since digest is set
    tag = "latest",
)

container_pull(
    name = "distroless_base_debian11_debug",
    digest = "sha256:d784a700916c91d0dceb6979e0ddea65ad943d3e6d28a9aed9a5c0eb3fed72b8",
    registry = "gcr.io",
    repository = "distroless/base-debian11",
    # tag field is ignored since digest is set
    tag = "debug",
)

container_pull(
    name = "debian11_slim",
    digest = "sha256:139a42fa3bde3e5bad6ae912aaaf2103565558a7a73afe6ce6ceed6e46a6e519",
    registry = "docker.io",
    repository = "debian",
    # tag field is ignored since digest is set
    tag = "11-slim",
)
