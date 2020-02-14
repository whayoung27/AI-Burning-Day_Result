FROM golang:1.13-alpine AS go
WORKDIR /
ADD . .
RUN go mod download
RUN go mod verify
RUN go build -ldflags="-w -s" -v github.com/deep-whale/ga/cmd/ga/


FROM alpine
COPY --from=go /ga /ga
EXPOSE 80
ENTRYPOINT ["/ga"]
