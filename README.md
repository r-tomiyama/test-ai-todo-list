# TODOアプリ

## 開発

```sh
npm ci

docker compose up -d
npm run migrate

npm run dev
```

## デプロイ

```sh
# 事前準備

brew install supabase/tap/supabase
supabase login
supabase link --project-ref $PROJECT_REF

# 実行

npm run deploy

```
