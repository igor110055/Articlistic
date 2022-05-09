#!/bin/bash
fuser -k 3000/tcp || true
nohup node src/api/index.js &