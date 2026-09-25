# Build
FROM node:26.9.0-alpine@sha256:dbaa92e5758cbbcf85d65d5403fdb530fe3442cbe8c6dbfb7ef23365450d5070 AS builder

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
FROM nginx:1.31.6-alpine@sha256:d10753d9289b8e3f884386351f73554ce72b631378949deddd75e83ee296c427

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
