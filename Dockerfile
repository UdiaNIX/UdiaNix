FROM php:8.2-fpm-alpine AS php

FROM nginx:alpine
COPY --from=php /usr/local /usr/local
COPY --from=php /usr/local/bin/docker-php-ext-* /usr/local/bin/

# Copia arquivos do site
COPY . /var/www/html

# Configuração do Nginx para PHP
RUN echo 'server { \
    listen 80; \
    root /var/www/html; \
    index index.php index.html; \
    location / { \
        try_files $uri $uri/ =404; \
    } \
    location ~ \.php$ { \
        fastcgi_pass 127.0.0.1:9000; \
        fastcgi_index index.php; \
        include fastcgi_params; \
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Inicia PHP-FPM e Nginx
COPY --from=php /usr/local/sbin/php-fpm /usr/local/sbin/php-fpm
RUN apk add --no-cache supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-n"]
