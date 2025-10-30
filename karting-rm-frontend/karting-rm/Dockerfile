FROM nginx:alpine

COPY ./dist /usr/share/nginx/html
COPY ./nginx-config/nginx-front.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]