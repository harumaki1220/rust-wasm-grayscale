# Vite + TypeScript + React Starter 🚀

[![CI/CD](https://github.com/harumaki1220/vite-react-starter/actions/workflows/cicd.yml/badge.svg)](https://github.com/harumaki1220/vite-react-starter/actions/workflows/cicd.yml)

Vite + TypeScript + Reactで作られた、モダンなフロントエンド開発のスターターテンプレートです。
開発をすぐに始められるように、以下の基本的な設定が完了しています。

## ✨ 主な特徴 (Features)

- **開発環境**: Vite, React, TypeScript
- **コード品質**: ESLint, Prettier
- **CI/CD**: GitHub Actionsによるテスト・ビルド・デプロイの自動化 (GitHub Pages)
- **スタイリング**: Tailwind CSS, CSS Modules

## 🚀 プロジェクトの始め方 (Getting Started)

1.  このリポジトリのページで緑色の **"Use this template"** ボタンをクリックし、新しいリポジトリを作成します。
2.  作成したリポジトリをローカルにクローンします。
    ```bash
    git clone [https://github.com/](https://github.com/)<your-username>/<your-repo-name>.git
    ```
3.  ターミナルで `npm install` を実行して、必要なパッケージをインストールします。
4.  `npm run dev` で開発を開始しましょう！

**（注意）**
このテンプレートはGitHub Pagesへの自動デプロイ設定が含まれています。デプロイ設定は `vite.config.ts` によって自動的に行われるため、手動での変更は不要です。

## 🛠️ 利用可能なスクリプト (Available Scripts)

- `npm run dev`: 開発サーバーを起動します。
- `npm run build`: プロダクション用にプロジェクトをビルドします。
- `npm run lint`: ESLintでコードの静的解析を実行します。
- `npm run typecheck`: TypeScriptで型チェックのみを実行します。
- `npm run format`: Prettierを使ってプロジェクト全体のファイルを整形します。
- `npm run format:check`: 整形が必要なファイルがないかチェックします（CIで使用）。
