# kyosai-crm-mobile

共済代理店向けCRMのスマホアプリ(Expo + React Native + TypeScript)。App Store / Google Playへの配信を前提にしたネイティブアプリです。

## セットアップ

```bash
npm install
cp .env.example .env   # EXPO_PUBLIC_API_URL を接続先バックエンドに合わせて編集
npm start
```

- Android実機/エミュレータ: `a` キー、またはExpo Goでスキャン
- iOS実機/シミュレータ: `i` キー(要macOS)、またはExpo Goでスキャン

先に `../server` のAPIを起動しておいてください。

## 実機(スマホ)でExpo Goを使ってテストする手順

⚠️ この開発サーバーとバックエンドAPIは、あなたのPC上で動かす必要があります(このセッションが動いているクラウド環境からは、あなたのスマホは直接アクセスできません)。GitHubのブランチ `claude/kyosai-agent-version-uo6e0y`(または main へのマージ後)を、あなたのPCに `git pull` してから以下を行ってください。

1. **スマホにExpo Goをインストール**: App Store / Google Playで「Expo Go」を検索してインストール
2. **PCとスマホを同じWi-Fiに接続する**
3. **バックエンドAPIを起動**(要Node.js, PostgreSQL)
   ```bash
   cd server
   npm install
   cp .env.example .env
   npx prisma migrate dev --name init
   npx tsx prisma/seed.ts   # サンプルログイン: admin@example.com / password123
   npm run dev              # http://localhost:4000 で起動
   ```
4. **PCのLAN IPアドレスを確認**
   - Mac: `ipconfig getifaddr en0`
   - Windows: `ipconfig` で「IPv4アドレス」を確認(例: 192.168.1.10)
5. **モバイルアプリを起動**
   ```bash
   cd mobile
   npm install
   cp .env.example .env
   # .env の EXPO_PUBLIC_API_URL を手順4のIPに書き換える
   # 例: EXPO_PUBLIC_API_URL=http://192.168.1.10:4000
   npm start
   ```
6. ターミナルに表示されるQRコードを、スマホのExpo Goアプリ(またはカメラアプリ)で読み取る
7. アプリが起動したら `admin@example.com` / `password123` でログイン、または「新しく代理店を登録する」から自分のアカウントを作成

※ Wi-Fiでうまく繋がらない場合は `npx expo start --tunnel` を試すと、別ネットワーク越しでも接続できます(やや低速)。

## 画面構成

- ログイン / 代理店新規登録
- ホーム: 30日以内に更新期日が来る契約のアラート一覧
- 顧客: 一覧(検索)・詳細(契約/対応履歴)・追加/編集/削除
- 契約: 一覧(ステータス絞り込み)、顧客詳細から追加/編集
- メンバー: 代理店に所属するスタッフの一覧、管理者のみ追加/削除可能

## 本番ビルド(将来のストア配信時)

[EAS Build](https://docs.expo.dev/build/introduction/) を使う想定です。

```bash
npx eas-cli build --platform android
npx eas-cli build --platform ios
```
