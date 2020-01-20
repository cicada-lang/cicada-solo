#!/usr/bin/env bash

git submodule init
git submodule sync --recursive
git submodule update --remote
