#!/bin/sh

# routeファイルのパス
ROUTE_FILE="app/api/trpc/[trpc]/route.ts"

# ビルド前に'export const runtime = 'edge';'を追加
printf "\nexport const runtime = \"edge\";" >> $ROUTE_FILE

# Prisma生成とビルド
prisma generate --no-engine
npx @cloudflare/next-on-pages

# ビルド後に追加した'export const runtime = "edge";'を削除
sed -i '' '/export const runtime = "edge";/d' $ROUTE_FILE
sed -i '' -e :a -e '/^\n*$/{$d;N;ba' -e '}' $ROUTE_FILE

# package.jsonから"vercel-build": "next build"を削除
# vercelのコマンドは、デプロイの時以外には使わないため
sed -i '' '/"vercel-build": "next build",/d' package.json

echo "Build process completed"
