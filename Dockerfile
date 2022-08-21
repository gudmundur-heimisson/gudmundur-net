FROM debian:bullseye-slim AS debs

WORKDIR /tmp

RUN apt update && \
    apt install -y apt-rdepends && \
    apt-rdepends --show=DEPENDS nginx-light | grep -v -e '^ ' | sed s/^debconf-2.0$/debconf/ | xargs apt download && \
    mkdir /dpkg && \
    mkdir -p /dpkg/var/lib/dpkg/status.d && \
    for deb in *.deb; do \
    package_name=$(dpkg-deb -I ${deb} | awk '/^ Package: .*$/ {print $2}'); \
    dpkg --ctrl-tarfile $deb | tar -Oxvf - ./control > /dpkg/var/lib/dpkg/status.d/${package_name}; \
    dpkg --extract $deb /dpkg || exit 10; \
    done

FROM gcr.io/distroless/base-debian11:latest AS run
COPY --from=debs /dpkg /

USER nobody
WORKDIR /
ENTRYPOINT ["/usr/bin/nginx"]
