#!/bin/bash
# Jimi Notes 日次自動生成（launchd から起動）。
# 在庫の次の3テーマを記事化 → build → Cloudflare deploy → git push。
set -u
REPO="/Users/otsu_naoya/Desktop/projects/jimi-notes"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
export HOME="/Users/otsu_naoya"

cd "$REPO" || exit 1
mkdir -p logs
TS="$(date +%Y%m%d-%H%M%S)"
LOG="logs/daily-$TS.log"

{
  echo "=== Jimi Notes daily run: $TS ==="
  command -v claude  >/dev/null || { echo "claude not found in PATH"; exit 1; }
  git pull --quiet origin main 2>/dev/null || true
  # headless Claude が /daily-articles コマンドの手順を実行（pick→workflow→assemble→build→deploy→push）
  claude -p "/daily-articles" --dangerously-skip-permissions
  echo "=== done: $(date +%H:%M:%S) ==="
} >> "$LOG" 2>&1

# 直近ログへのシンボリックリンク（確認しやすく）
ln -sf "$LOG" logs/latest.log
