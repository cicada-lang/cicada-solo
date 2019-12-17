#!/usr/bin/env bash

cpp="clang++"
# cpp="g++"
warn="-Wall -Wextra -Wno-infinite-recursion -Wno-unused-parameter"
std="-std=c++17"
# std="-std=c++2a"
# lib="-lstdc++fs"
opt="-foptimize-sibling-calls -Ofast"
debug="-g"
compile="$cpp $std $lib $warn"

function build {
    for file in $(ls | grep "\.cpp$")
    do
        echo "[build] $file"
        if ! $compile -c $file
        then
            exit 1
        fi
    done
}

function build_test {
    code_objs=$(ls | grep "\.o$" | grep -v "_test\.o$")
    for file in $(ls | grep "_test\.o$")
    do
        echo "[build_test] $file"
        if ! $compile $code_objs $file -o $(echo $file | cut -f 1 -d '.')
        then
            exit 1
        fi
    done
}

function run_test {
    for file in $(find | grep "_test$")
    do
        echo "[run_test] $file"
        if ! $file
        then
            exit 1
        fi
    done
}

function t {
    build && \
        build_test && \
        run_test
}

function main {
    for TASK in $@
    do
        $TASK
    done
}

main $@
