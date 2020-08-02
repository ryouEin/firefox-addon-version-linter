# firefox-addon-version-linter

Firefoxのアドオンを作成する際に必要な `manifest.json` と `updates.json` に関して、バージョン情報に関する整合性をチェックするコマンドを提供

提供する内容は以下

+ `manifest.json` のバージョンと `updates.json` に記載の最新バージョンが一致することをチェック
+ `updates.json` の `update_link` が規定のフォーマットに従っているかチェック
+ `updates.json` に記載の最新バージョンの `update_link` が有効（GETリクエストに対し200が帰ってくる）かチェック

## インストール方法

```
npm i ryouEin/firefox-addon-version-linter
```

## コマンド

### `manifest.json` のバージョンと `updates.json` に記載の最新バージョンが一致することをチェック

```
firefox-addon-version-linter checkVersion --manifestFilePath ./manifest.json --updatesFilePath ./updates.json --addonUUID "{1234-567-89}"
```

### `updates.json` の `update_link` が規定のフォーマットに従っているかチェック

```
firefox-addon-version-linter checkUpdateLinkFormat --updatesFilePath ./updates.json --addonUUID "{1234-567-89}" --format "http://example.com/hogehoge/[version]/file"
```

上の例の場合、例えばバージョン `1.0.0` の場合、 `update_link` が `http://example.com/hogehoge/1.0.0/file` になっているかチェックをする。

### `updates.json` に記載の最新バージョンの `update_link` が有効（GETリクエストに対し200が帰ってくる）かチェック

```
firefox-addon-version-linter checkUpdateLinkValidity --updatesFilePath ./updates.json --addonUUID "{1234-567-89}"
```
