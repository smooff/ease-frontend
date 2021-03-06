# build environment
fROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
RUN yarn install --ignore-engines
COPY . ./
RUN yarn run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./ease.crt /etc/ssl/certs/
COPY ./ease.key /etc/ssl/private/
EXPOSE 80
EXPOSE 433
CMD ["nginx", "-g", "daemon off;"]
