# Build
FROM node:26.5.1-alpine@sha256:233761595746769ebfdb6090f44fc7cdf818ae0ce62d2b37e0367723b9823e36 AS builder

ARG VERSION
ARG COMMIT

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV VITE_COMMIT_ID=$COMMIT
ENV VITE_VERSION=$VERSION

WORKDIR /app

# hadolint ignore=DL3018
RUN apk add --no-cache yarn

COPY package.json yarn.lock .yarnrc.yml vite.config.ts tsconfig*.json index.html ./
COPY src/ src/
COPY public/ public/
COPY .yarn/ .yarn/

RUN yarn install --immutable
# hadolint ignore=DL3059
RUN yarn build

# Serve
FROM nginx:1.31.3-alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
