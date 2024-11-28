FROM impsregistry.azurecr.io/baseimages/node:alpine as builder
WORKDIR /developer-assistant

COPY ./package.json /developer-assistant
RUN npm install

COPY . /developer-assistant
RUN npm run release

FROM impsregistry.azurecr.io/baseimages/nginx:stable-alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder developer-assistant/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]