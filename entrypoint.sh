#!/bin/sh

if [ -f '/vault/secrets/config' ]; then
    source '/vault/secrets/config'
fi

node src/index.js 