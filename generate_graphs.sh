#!/usr/bin/env zsh
# yarn run tsc experiments/testGraphGen.ts -t ES5 --esModuleInterop && node experiments/testGraphGen.js
yarn run tsc experiments/generateGraphs.ts -t ES5 --esModuleInterop && node experiments/generateGraphs.js

rm -r experiments/**/*.js
rm -r src/**/*.js