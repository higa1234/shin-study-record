# サービス名

シン・学習記録アプリ（shin-study-record）

# サービスの説明

シン・学習記録アプリ（shin-study-record）は、学習した内容と時間を記録・管理できるシンプルな学習記録アプリです。
ユーザーは学習内容と学習時間を入力して保存できます。また登録した内容と時間は編集・削除できます。
自己学習管理や、日々の成長記録に活用できます。

URL：shin-study-record.web.app/

# 使用技術

- 言語：TypeScript
- フロントエンド: React + Vite + Chakra UI(v2)
- データベース: Supabase
- ホスティング: Firebase Hosting
- テスト：Jest

# 環境設定

1. このリポジトリをクローン

```
git clone https://github.com/higa1234/shin-study-record.git
cd shin-study-record
```

2. .envファイルを作成し、以下を記述

```
VITE_SUPABASE_URL=あなたのSupabaseプロジェクトURL
VITE_SUPABASE_ANON_KEY=あなたのSupabase公開APIキー
```

※.envファイルはプロジェクトルートに配置します。

3. 必要なパッケージのインストール

```
npm install
```

4. 起動

```
npm run dev
```

# テスト

```
npm run test
```

# バージョン

npm ：9.6.4
node：v20.0.0

# 更新日

2025/05/22
