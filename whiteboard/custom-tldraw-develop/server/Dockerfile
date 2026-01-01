FROM node:22-slim AS builder

USER root

WORKDIR /app

COPY package.json ./

# RUN yarn install --frozen-lockfile
RUN yarn install

COPY . .

FROM node:22-slim

USER root

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 5858

ENV VITE_APP_SERVER_PORT=5858
ENV VITE_HOST='0.0.0.0'

CMD ["yarn", "dev-server-node"]
