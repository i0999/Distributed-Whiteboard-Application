FROM node:22-slim AS builder

WORKDIR /app

COPY package.json ./

# RUN yarn install --frozen-lockfile
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

# FROM node:22-slim

# USER root

# WORKDIR /app

# COPY --from=builder /app ./

# EXPOSE 5757

# ENV VITE_APP_UI_PORT=5757

# CMD ["yarn", "dev-client", "--host"]

FROM nginx:alpine

# Copy the custom NGINX configuration file (see configuration note below)
# This configures NGINX to listen on your desired port (5757)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static assets from the builder stage's 'dist' folder
# Change 'dist' if your build output directory is different
COPY --from=builder /app/dist /usr/share/nginx/html 
RUN chmod -R a+r /usr/share/nginx/html

# Expose the container port (This should match your Service targetPort: 5757)
EXPOSE 5757

# NGINX starts automatically
CMD ["nginx", "-g", "daemon off;"]
