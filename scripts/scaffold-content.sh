#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATE_DIR="$ROOT_DIR/.vuepress/private/templates"
TODAY="$(date '+%Y/%m/%d')"

usage() {
  cat <<'EOF'
Usage:
  npm run scaffold -- blog <life|thoughts|sports|meta> "<title>"
  npm run scaffold -- doc <tech|sports> <group> "<title>"

Examples:
  npm run scaffold -- blog life "深圳周末徒步"
  npm run scaffold -- blog thoughts "五月复盘：输入与输出"
  npm run scaffold -- doc tech frontend "Vue 组件通信总结"
  npm run scaffold -- doc sports training "10km 训练计划（入门）"
EOF
}

ensure_template() {
  local template_file="$1"
  if [[ ! -f "$template_file" ]]; then
    echo "Template not found: $template_file" >&2
    exit 1
  fi
}

normalize_filename() {
  local raw="$1"
  local name
  name="$(printf '%s' "$raw" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g')"
  name="${name//\//-}"
  name="${name//:/-}"
  name="${name//\?/-}"
  name="${name//\*/-}"
  name="${name//\"/-}"
  name="${name//</-}"
  name="${name//>/-}"
  name="${name//|/-}"
  name="$(printf '%s' "$name" | sed -E 's/[[:space:]]+/-/g; s/-+/-/g; s/^-+|-+$//g')"
  if [[ -z "$name" ]]; then
    name="untitled"
  fi
  printf '%s' "$name"
}

replace_title_and_date() {
  local file_path="$1"
  local title="$2"
  NEW_TITLE="$title" NEW_DATE="$TODAY" perl -i -pe '
    if ($. <= 20) {
      s/^title:.*/title: $ENV{NEW_TITLE}/;
      s/^date:.*/date: $ENV{NEW_DATE}/;
    }
  ' "$file_path"
}

next_blog_filename() {
  local dir="$1"
  local mmdd="$2"
  local i
  for i in $(seq -w 1 99); do
    local candidate="$dir/${mmdd}${i}.md"
    if [[ ! -e "$candidate" ]]; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  return 1
}

next_unique_doc_filename() {
  local dir="$1"
  local base_name="$2"
  local candidate="$dir/${base_name}.md"
  local index=2

  if [[ ! -e "$candidate" ]]; then
    printf '%s' "$candidate"
    return 0
  fi

  while true; do
    candidate="$dir/${base_name}-${index}.md"
    if [[ ! -e "$candidate" ]]; then
      printf '%s' "$candidate"
      return 0
    fi
    index=$((index + 1))
  done
}

create_blog() {
  local category="${1:-}"
  local title="${2:-}"
  local year mmdd target_dir template_file target_file

  if [[ -z "$category" || -z "$title" ]]; then
    usage
    exit 1
  fi

  case "$category" in
    life|thoughts|sports|meta) ;;
    *)
      echo "Invalid blog category: $category" >&2
      echo "Allowed: life | thoughts | sports | meta" >&2
      exit 1
      ;;
  esac

  year="$(date '+%Y')"
  mmdd="$(date '+%m%d')"
  target_dir="$ROOT_DIR/blogs/$category/$year"
  template_file="$TEMPLATE_DIR/blog-${category}.md"
  ensure_template "$template_file"

  mkdir -p "$target_dir"
  target_file="$(next_blog_filename "$target_dir" "$mmdd")"
  cp "$template_file" "$target_file"
  replace_title_and_date "$target_file" "$title"

  echo "Created blog file:"
  echo "  $target_file"
  echo "Next:"
  echo "  1. Edit body content"
  echo "  2. Adjust tags if needed"
}

create_doc() {
  local domain="${1:-}"
  local group="${2:-}"
  local title="${3:-}"
  local target_dir template_file base_name target_file

  if [[ -z "$domain" || -z "$group" || -z "$title" ]]; then
    usage
    exit 1
  fi

  case "$domain" in
    tech|sports) ;;
    *)
      echo "Invalid doc domain: $domain" >&2
      echo "Allowed: tech | sports" >&2
      exit 1
      ;;
  esac

  template_file="$TEMPLATE_DIR/doc-${domain}.md"
  ensure_template "$template_file"

  target_dir="$ROOT_DIR/docs/$domain/$group"
  mkdir -p "$target_dir"

  base_name="$(normalize_filename "$title")"
  target_file="$(next_unique_doc_filename "$target_dir" "$base_name")"
  cp "$template_file" "$target_file"
  replace_title_and_date "$target_file" "$title"

  echo "Created doc file:"
  echo "  $target_file"
  echo "Next:"
  echo "  1. Edit body content"
  echo "  2. Adjust tags if needed"
}

main() {
  local mode="${1:-}"
  if [[ -z "$mode" ]]; then
    usage
    exit 1
  fi

  case "$mode" in
    blog)
      create_blog "${2:-}" "${3:-}"
      ;;
    doc)
      create_doc "${2:-}" "${3:-}" "${4:-}"
      ;;
    -h|--help|help)
      usage
      ;;
    *)
      echo "Unknown mode: $mode" >&2
      usage
      exit 1
      ;;
  esac
}

main "$@"
