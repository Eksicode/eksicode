#!/bin/sh
# Healthcheck script for admin panel

# Check if the server responds on port 3001
wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

exit 0
