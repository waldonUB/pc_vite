#!/bin/bash
echo "$1";
cd ./src/components;
mkdir $1;
cd $1;
touch README.md;
touch index.vue;
code index.vue;
