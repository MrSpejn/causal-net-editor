#!/usr/bin/env zsh
# yarn run tsc experiments/runLayeringAlgorithm.ts -t ES5 --esModuleInterop && node experiments/runLayeringAlgorithm.js
yarn run tsc experiments/runBindingAlgorithm.ts -t ES5 --esModuleInterop && node experiments/runBindingAlgorithm.js

rm -r experiments/**/*.js
rm -r src/**/*.js