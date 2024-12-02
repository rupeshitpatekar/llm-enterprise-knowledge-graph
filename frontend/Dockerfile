FROM impsregistry.azurecr.io/baseimages/node:alpine as builder
WORKDIR /neural-quartet

COPY ./package.json /neural-quartet
RUN npm install

COPY . /neural-quartet
RUN npm run release

FROM impsregistry.azurecr.io/baseimages/nginx:stable-alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder neural-quartet/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]