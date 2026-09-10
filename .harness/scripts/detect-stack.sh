#!/bin/sh
set -eu

usage() { echo "Usage: $0 --target PATH"; }
target=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --target) [ "$#" -ge 2 ] || { usage >&2; exit 2; }; target=$2; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done
[ -n "$target" ] || { usage >&2; exit 2; }
[ -d "$target" ] || { echo "Target is not a directory: $target" >&2; exit 2; }

emit_file() {
  if [ -f "$target/$1" ]; then
    printf '  - %s\n' "$1"
  fi
}

echo "stack_evidence:"
for file in package.json pnpm-lock.yaml yarn.lock package-lock.json bun.lockb deno.json \
  pyproject.toml requirements.txt poetry.lock uv.lock go.mod Cargo.toml Gemfile \
  composer.json pom.xml build.gradle settings.gradle Dockerfile docker-compose.yml \
  compose.yaml supabase/config.toml prisma/schema.prisma drizzle.config.ts \
  next.config.js next.config.mjs next.config.ts vite.config.js vite.config.ts \
  svelte.config.js astro.config.mjs nuxt.config.ts tsconfig.json; do
  emit_file "$file"
done

echo "guidance:"
emit_file AGENTS.md
emit_file AGENTS.override.md
emit_file README.md

echo "environment_files:"
for file in .env.example .env.sample .env.template; do emit_file "$file"; done
