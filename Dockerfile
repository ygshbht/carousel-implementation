FROM node:lts-alpine3.14 AS build-stage
WORKDIR /app/
COPY package*.json /app/
RUN npm install
COPY . .
RUN npm run build

#Step 2: Producion
FROM nginx:1.12-alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

