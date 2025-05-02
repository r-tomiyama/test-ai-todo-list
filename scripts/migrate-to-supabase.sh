#!/bin/bash

# スクリプトの説明
# Prismaのマイグレーションファイルを取得してSupabaseのフォーマットに変換する
# Prisma: prisma/migrations/<timestamp>_<name>/migration.sql
# Supabase: supabase/migrations/<timestamp>_<name>.sql

# Supabaseのマイグレーションディレクトリが存在することを確認
mkdir -p supabase/migrations

# 変数初期化
copied_count=0
skipped_count=0

# 各Prismaマイグレーションディレクトリをループ処理
for dir in prisma/migrations/*/; do
  # ディレクトリが実際に存在することを確認
  if [ -d "$dir" ]; then
    # ディレクトリ名を取得 (timestamp_name)
    name=$(basename "$dir")

    # コピー先のファイルパス
    target_file="supabase/migrations/${name}.sql"

    # migration.sqlファイルが存在することを確認
    if [ -f "${dir}migration.sql" ]; then
      # 既にコピー先にファイルが存在するか確認
      if [ -f "$target_file" ]; then
        echo "Skipping: $name (already exists)"
        skipped_count=$((skipped_count + 1))
      else
        echo "Converting: $name"
        # 対象のSQLファイルをコピー
        cp "${dir}migration.sql" "$target_file"
        copied_count=$((copied_count + 1))
      fi
    else
      echo "Warning: No migration.sql found in $dir"
    fi
  fi
done

echo "Migration files copied to supabase/migrations/ ($copied_count copied, $skipped_count skipped)"
