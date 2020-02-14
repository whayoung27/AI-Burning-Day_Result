FROM node:13.6.0-alpine AS node
WORKDIR /front
ADD ./front/package.json .
RUN npm install
ADD ./front .
RUN npm run build

FROM golang:1.13-alpine AS go
WORKDIR /
ADD . .
RUN go mod download
RUN go mod verify
RUN go build -ldflags="-w -s" -v github.com/deep-whale/web/cmd/web/


FROM alpine
COPY --from=go /web /web
COPY --from=node /build /react
EXPOSE 80
ENTRYPOINT ["/web"]
