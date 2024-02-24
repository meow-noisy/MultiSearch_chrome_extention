# 検索したいキーワードを複数の検索エンジンで一斉に検索できるchrome拡張機能

- 解説記事
    - [検索したいキーワードを複数の検索エンジンで一斉に検索できるchrome拡張機能を作ろう](https://meow-memow.hatenablog.com/entry/2024/01/28/151724)

参考実装の位置付けで公開しています。メンテはしない予定です。

## 使い方
パッケージとしては提供していないので、このリポジトリ自体を読み込む。

- インストール
    1. このリポジトリをcloneする
    2. chromeの拡張機能管理画面を開く
    3. デベロッパーモードのトグルをオンにする
    4. 「パッケージ化されていない拡張機能を読み込む」ボタンでこのリポジトリを読み込む
- 使用
    1. ブラウザ上で拡張機能「Multi Search」をクリックする
    2. テキストフィールドに検索したいワードを入れる
    3. 「Search」ボタンをクリックする
    4. チェックを入れている検索エンジンのタブが開く

## 自分の検索エンジンを追加したい場合

1. [popup.js](./popup.js) を開く
2. 変数 `searchEngines` のリストにURLを追加する。
3. 「パッケージ化されていない拡張機能を読み込む」で取り込んだ場合は、ファイル更新すればそのまま拡張機能が反映されているはず。
