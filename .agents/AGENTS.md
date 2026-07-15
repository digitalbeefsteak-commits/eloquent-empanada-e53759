# Project Rules

## バージョン管理ルール

**Git でコードを更新するときは必ずバージョンを上げること。**

- `index.html` のサイドバーにあるバージョン表記 (`Version X.X.X`) を更新する
- `index.html` の `<script src="app.js?v=X.X.X">` のキャッシュバスターも同じバージョンに更新する
- コミットメッセージには `release: vX.X.X` または `fix: vX.X.X` 形式でバージョンを明記する
- バージョン変更後は必ず `git push origin main` でリモートにプッシュする
