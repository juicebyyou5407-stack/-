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
