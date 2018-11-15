#!/usr/bin/env bash

rm -rf public/build/css
rm -rf public/build/img
rm -rf public/build/js

yarn run build-client

NODE_ENV=development concurrently \
"./node_modules/.bin/supervisor --watch build build/backend.js" \
"./node_modules/.bin/webpack --watch --config webpackConfigs/webpack.config.js" \
"./node_modules/.bin/webpack --watch --config webpackConfigs/webpack.server.config.js"
