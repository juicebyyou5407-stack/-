# kyosai-crm-server

共済代理店向けCRMのバックエンドAPI(Express + TypeScript + Prisma + PostgreSQL)。

## セットアップ

```bash
npm install
cp .env.example .env   # DATABASE_URL / JWT_SECRET を必要に応じて編集
npx prisma migrate dev --name init
npx tsx prisma/seed.ts # サンプルデータ投入(admin@example.com / password123)
npm run dev
```

デフォルトで `http://localhost:4000` で起動します。

## 主なエンドポイント

- `POST /auth/register` — 代理店(組織)と最初の管理者を新規作成
- `POST /auth/login` — ログイン、JWTを返す
- `GET/POST/PUT/DELETE /customers` — 顧客管理(自組織のデータのみ)
- `GET/POST/PUT/DELETE /contracts` — 契約管理
- `GET /contracts/renewals/upcoming?days=30` — 更新期日が近い契約一覧
- `POST /activities` — 対応履歴の記録
- `GET/POST/DELETE /members` — 組織メンバー管理(追加・削除は管理者のみ)

全エンドポイント(auth以外)は `Authorization: Bearer <token>` が必要で、常にログインユーザーの組織IDでデータを絞り込みます(マルチテナント)。
