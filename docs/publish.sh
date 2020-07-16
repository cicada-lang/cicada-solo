#!/usr/bin/env bash

echo "[publish]" &&
    npx plaintext toc note -o note/toc &&
    cat README note/toc > note/index &&
    npx plaintext dir note -o out &&
    true
