#!/usr/bin/env bash
# Cloudflare Pages build: copy only the public site into dist/ (keeps server code and docs off the web).
set -e
rm -rf dist && mkdir dist
for f in *; do
  case "$f" in dist|functions|netlify|node_modules|build.sh|wrangler.toml|netlify.toml|README.md|package.json|package-lock.json) ;;
  *) cp -R "$f" dist/ ;;
  esac
done
echo "built $(find dist -type f | wc -l) files"
