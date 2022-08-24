FROM debian:bullseye AS debs

WORKDIR /tmp

SHELL ["/bin/bash", "-c"]
RUN apt update && \
    apt install -y curl gnupg2 ca-certificates lsb-release debian-archive-keyring && \
    curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null && \
    mkdir /root/.gnupg &&\
    gpg --dry-run --quiet --import /usr/share/keyrings/nginx-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/debian `lsb_release -cs` nginx" \
    | tee /etc/apt/sources.list.d/nginx.list && \
    echo "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
    | tee /etc/apt/preferences.d/99nginx

RUN apt update && \
    apt install -y apt-rdepends && \
    apt-rdepends --show=DEPENDS nginx | grep -v -e '^ ' | sed s/^debconf-2.0$/debconf/ | xargs apt download && \
    mkdir /dpkg && \
    mkdir -p /dpkg/var/lib/dpkg/status.d && \
    for deb in *.deb; do \
    package_name=$(dpkg-deb -I ${deb} | awk '/^ Package: .*$/ {print $2}'); \
    dpkg --ctrl-tarfile $deb | tar -Oxvf - ./control > /dpkg/var/lib/dpkg/status.d/${package_name}; \
    dpkg --extract $deb /dpkg || exit 10; \
    done

RUN mkdir -p /dpkg/etc && \
    echo nginx:x:1001:1001:nginx:/usr/share/nginx:/usr/sbin/nologin > /dpkg/etc/passwd && \
    mkdir -p /nginx/usr/share/nginx /nginx/var/cache/nginx

FROM gcr.io/distroless/base-debian11:debug AS run
COPY --from=debs /dpkg /
COPY --from=debs --chown=nginx:nginx /nginx /
COPY nginx.conf /etc/nginx/

USER nginx
WORKDIR /
ENTRYPOINT ["/usr/sbin/nginx", "-e", "/dev/stderr"]
EXPOSE 1234
