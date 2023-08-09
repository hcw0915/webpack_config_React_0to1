# 手把手帶你搞懂如何 webpack 配置 React 專案

Reference: https://driedfishlin.medium.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%B6%E4%BD%A0%E6%90%9E%E6%87%82%E5%A6%82%E4%BD%95%E7%94%A8-webpack-%E5%BB%BA%E7%BD%AE-react-%E9%96%8B%E7%99%BC%E7%92%B0%E5%A2%83-9ada14ccb2eb

---

### 一、建立專案 & package.json

```json
mkdir webpack_practice  /** 建立資料夾 */
cd webpack_practice     /** 進入資料夾 */
npm init -y             /** 安裝 package.json 模板 */
```

`-y` 表示跳過所有專案設定並採用預設值。

```json
// package.json
{
  "name": "webpack",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

---

### 二、安裝 webpack & webpack-cli 工具

```json
npm i webpack -D      /** 安裝 webpack 至 devDeps */
npm i webpack-cli -D  /** 安裝 webpack-cli 至 devDeps */
```

```json
// package.json
{
  ...
  "devDependencies": {
    "webpack": "^5.88.2",
    "webpack-cli": "^5.1.4"
  }
  ...
}
```

---

### 三、建立 `src/index.js`, `webpack.config.js`,

使用 `CommonJS (CJS)` 的原因主要是再 Node.js 中應用到模組的場合主要還是 ES5 的語法，常看到的 `import `

```javascript
// webpack.config.js
const path = require('path') // 定義相對路徑

module.exports = {
  mode: 'development', // production | development
  entry: './src/index.js', // 確認檔案進入點
  output: {
    path: path.resolve(__dirname, './build'), // 相對路徑 => 絕對路徑
    filename: 'bundle.js', // 打包後檔案名稱
  },
}
```

加入 `build` 指令，後可執行 `npm run build` or `npx webpack build`，都可以執行打包作業。(有加入 `scripts` 就可以使用 `npm run build`)

```json
// package.json
{
  ...
  "scripts": {
    "build": "webpack build"
  },
  ...
}
```

---

### 四、建立 `public/index.html`

建立後打開 `html` ，就可以看到 `console.log` 的文字 `Hello World`。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Create React app with Webpack</title>
    <script defer src="../build/bundle.js"></script>
    <!-- 引入打包的檔案位置 -->
  </head>
  <body></body>
</html>
```

目前專案目錄結構如下~

```bash
├── build
│   └─ bundle.js
├── node_modules
│   └─ (modules...)
├── public
│   └─ index.html
├── src
│   └─ index.js
├── package-lock.json
├── package.json
└── webpack.config.js
```

---

### 五、加入 React & babel 套件

```json
npm i react react-dom    /** 安裝 React 對應套件 */
```

後續因為 `React` 是 `JSX` 語法，所以要在 `webpack` 裡面加入 `babel-loader`，在打包過程可以把 看不懂的 `JSX` 語法經過 `babel` 轉成 看得懂的東西。

```json
npm i babel-loader -D         /** webpack 所需的 babel loader */
npm i @babel/core -D          /** babel 核心 */
npm i @babel/preset-env -D    /** babel 轉譯 ES6+ */
npm i @babel/preset-react -D  /** babel 轉換 React */
```

```json
// package.json
{
  ...
  "devDependencies": {
    "@babel/core": "^7.22.10",
    "@babel/preset-env": "^7.22.10",
    "@babel/preset-react": "^7.22.5",
    "babel-loader": "^9.1.3",
    "webpack": "^5.88.2",
    "webpack-cli": "^5.1.4"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

---

### 六、新增 React 入口

此處為 `React 18` 修改後的入口(直接把`App`當作入口)，並在`html`裡面建立 `root` 提供 `React` 建立 結點位置。

```javascript
// index.html
<div id="root"></div>
```

```javascript
// App.jsx
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

export const App = () => {
  return <div>App</div>
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

---

### 七、修改 webpack.config.js 檔案

調整完 `webpack.config.js` 之後，執行 `npm run build`，就可以看到結果了。

```javascript
module: {
    rules: [
      {
        test: /\.(js|jsx)$/,      // 只要 .js .jsx 都要編譯
        exclude: /node_modules/,  // 不需要的檔案
        use: {
          loader: 'babel-loader', // 指派要使用的加載器
          options: { // 編譯前要執行的東西 => 讓 webpack 具備解讀 JSX, ES6+ 能力
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
    ],
  },
```

---

### 八、打包 HTML、CSS

#### 打包 HTML

```json
npm i html-webpack-plugin -D   /** 打包後的 .js 會被自動加入到 <head> 裡面，並且將HTML 做最小化處理 */
```

我們新增了 `plugins` 的設定，並且建立一個 `html-webpack-plugin` 實體。

- `template` 為要編譯的檔案來源，指定 `public` 中的 `index.html` 檔案。
- `filename` 為編譯後的檔案名稱。
- `inject` 是 `Webpack` 會幫我們把 `JS` 檔案的路徑幫我們自動嵌入 `HTML` 的設定值，所以要記得先去打開 `index.html` 檔把原來引入的 `<script>` 標籤刪掉，否則編譯出來會有兩行`<script>` 程式碼。
- `minfy` 則是最小化編譯檔案的設定值。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
  new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html',
    inject: true,
    minify: true,
  }),
],
```

#### CSS 建立與打包

```json
npm i css-loader -D                /** webpack 所需的 css loader */
npm i mini-css-extract-plugin -D   /** webpack 所需的 babel loader */
```

- `style-loader`、`mini-css-extract-plugin` 套件差異:
  `style-loader` 在 `Webpack` 解析 `CSS` 檔案後會將樣式嵌入 `HTML` 的 `<style>` 標籤中；而 `mini-css-extract-plugin` 則是可以在各個 `js` 中提取被匯入的 `CSS` 檔案，組合打包成同一支檔案匯出後再將路徑放入 `HTML` 檔案的 `<link>` 中

> 彙整後打包(`mini-css-extract-plugin`) / 個別打包後(`style-loader`) 丟進去的差別。

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module: {
  rules: [
    ...
    {
      test: /\.css$/,
      // 順序是由後往前執行順序的。
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
  ],
},
plugins: [
  ...
  // CSS plugins
  new MiniCssExtractPlugin({
    filename: './css/index.css',
  }),
],
```

此時的檔案結構，可以執行 `build` 裡面的 `index.html`，看到 `CSS` 效果。

```bash
├─ build
│   ├─ css
│   │  └─ index.css
│   ├─ js
│   │  └─ bundle.js
│   └─ index.html
│
├─ node_modules
│   └─ (modules...)
│
├─ public
│   ├─ index.css
│   └─ index.html
│
├─ src
│   ├─ App.jsx
│   └─ index.js
│
├─ package-lock.json
├─ package.json
└─ webpack.config.js
```

---

### 九、 Hot Reload 設定

- `Hot Reload`:
  透過檔案改變與儲存，可針對部分修改做更新，而並非全部重新打包。

```json
npm i webpack-dev-server -D
```

可指定 `port` 決定 `start` 的時候`server` 開啟的位置。

```javascript
// webpack.config.js
module.exports = {
  ...
  devServer: {
    port: 3000,
  },
}
```

```json
// package.json
"scripts": {
  "build": "webpack build",
  "start": "webpack serve --open",
},
```

---

### 十、每次打包前自動刪除 build or dist 裡面舊的

```json
npm i rimraf -D
```

```json
// package.json
"scripts": {
  "start": "webpack serve --open",
  "clean-build-folder": "rimraf ./build/*",
  "build": "npm run clean-build-folder && webpack build"
},
```
