# node-es6-server-starter
Get started with Express, ES6 and Jest
---

### เริ่มสร้างโปรเจค
อันดัยแรก เริ่มสร้างโฟลเดอร์
```shell
$ mkdir express-app
```
สร้างไฟล์ package.json
```shell
$ cd express-app
$ npm init
```
ติดตั้ง babel-cli ในลิสต์ devDependencies
```shell
$ npm install --save-dev babel-cli
```
ติดคั้ง [presets](http://babeljs.io/docs/plugins/#presets) สำหรับ babel เพื่อใช้ในการแปลงโค้ด ในลิสต์ devDependencies
```shell
$ npm install --save-dev babel-preset-es2015 babel-preset-stage-2
```
ติดตั้ง [express](https://expressjs.com/) ในลิสต์ dependencies
```shell
$ npm install --save express
```
จากนั้นสร้างไฟล์สำหรับสร้าง server
```shell
$ mkdir src`
`$ touch src/index.js
```
โดยในไฟล์ `index.js` ให้ใส่โค้ดต่อไปนี้เข้าไป
```js
import express from 'express';
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
```
เพิ่มคำสั่ง `npm start` ในไฟล์ `package.json`
```diff
"script": {
+  "start": "babel-node src/index.js --presets es2015,stage-2"
}
```
เริ่ม server โดยพิมพ์คำสั่ง
```shell
$ npm start
```
ถ้าใน console จะแสดงว่า `Example app listening on port 3000!`
จากนั้นทดลองเข้า `http://localhost:3000/` ใน browser จะเห็นคำว่า `Hello World!`

### ใช้ nodemon สำหรับ watching file ที่เปลื่ยนแปลง
เพิ่มประสิทธิภาพ `npm start` โดยใช้ [nodemon](http://nodemon.io/)
ทำการติดตั้ง [nodemon](http://nodemon.io/)
```shell
$ npm install --save-dev nodemon
```
แก้ไขคำสั่ง `npm start` ในไฟล์ `package.json`
```diff
"script": {
-  "start": "babel-node src/index.js --presets es2015,stage-2"
+  "start": "nodemon src/index.js --exec babel-node --presets es2015,stage-2"
}
```
เริ่ม server อีกครั้ง โดยพิมพ์คำสั่ง
```shell
$ npm start
```
ทดลองเข้า `http://localhost:3000/` ใน browser
โดย server จะถูก restart ทุกครั้งที่ไฟล์มีการเปลื่ยนแปลง

### ทำ app ให้สามารถใช้ใน production ได้
ตอนนีั้เราใช้ `babel-node` สำหรับรัน server มันคงไม่ดีแน่ถ้าเราใช้คำสั่งนี้บน production เราควรจะแปลงไฟล์ไว้ที่ไหนสักแห่งก่อนเพื่อให้เครื่อง production รัน app โดยไม่ต้อง แปลงโค้ดอีกครั้ง
เพิ่มคำสั่ง `npm run build` และ `npm run serve` ในไฟล์ `package.json`
```diff
"script": {
  "start": "nodemon src/index.js --exec babel-node --presets es2015,stage-2",
+ "build": "babel src -d build --presets es2015,stage-2",
+ "serve": "node build/index.js"
}
```
คำสั่ง `npm run build` ทำการแปลงโค้ดจากโฟลเดอร์ `src/` ไปยังโฟลเดอร์ `build/` โดยก่อนจะแปลงโค้ดเราก็ควรจะลบโฟลเดอร์ `build/` ก่อนโดยอาจจะใช้คำสั่ง `rm -rf build` แต่ในโปรเจคนี้จะใช้ [rimraf](https://github.com/isaacs/rimraf) เหตุที่ใช้ `rimraf` เพราะคำสั่ง `rm -rf` ใช้ไม่ได้ในทุก OS (กรณีต้องการ develop ใน Windows)
ติดตั้ง `rimraf` ในลิสต์ devDependencies และแก้ไขคำสั่งในไฟล์ `package.json`
```shell
$ npm install --save-dev rimraf
```
```diff
"script": {
  "start": "nodemon src/index.js --exec babel-node --presets es2015,stage-2",
- "build": "babel src -d build --presets es2015,stage-2",
+ "build": "rimraf build && babel src -d build --presets es2015,stage-2",
  "serve": "node build/index.js"
}
```
ต่อไปก็อย่าลืมที่จะเพิ่ม `build` เข้าไปในไฟล์ `.gitignore` เพื่อป้องกันการ `commit` ไฟล์ในโฟล์เดอร์ `build` โดยบังเอิญ
```shell
$ touch .gitignore
$ echo "build" >> .gitignore
```
จากนั้นสร้าง `Procfile` โดยพิมพ์คำสั่งต่อไปนี้
```shell
$ touch Procfile
$ echo "web: npm run serve" >> Procfile
```
การสร้าง Procfile จะทำให้คำสั่ง `npm run serve` รันทุกครั้งที่ deploy
การ deploy ขึ้น production นั้นเครื่อง production จะดึงโค้ดจาก git repository ไป แล้วคำสั่ง `node build/index.js` เป็นคำสั่งที่เรียกใช้ไฟล์ในโฟลเดอร์ `build` แต่โฟลเดอร์ `build` ไม่ได้ถูกเพิ่มเข้าไปใน git repository ดังนั้นควร เพิ่มคำสั่ง `postinstall` ในไฟล์ `package.json` เพื่อทำการ build โฟลเดอร์ `build` บนเครื่อง production ก่อนที่จะเรียกใช้คำสั่ง `npm run serve` บนเครื่อง production
```diff
"script": {
  "start": "nodemon src/index.js --exec babel-node --presets es2015,stage-2",
  "build": "rimraf build && babel src -d build --presets es2015,stage-2",
  "serve": "node build/index.js",
+ "postinstall": "npm run build"
}
```
แก้ไฟล์ `src/index.js` เพื่อให้สามารถรันได้บนเครื่อง production
```js
import express from 'express';

const app = express()
const port = (process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
```
ทำการ deploy ไปยัง [heroku](http://www.herokuapp.com/) ติดตั้งและล็อกอินก่อนพิมพ์คำสั่งต่อไปนี้
```shell
$ heroku create
$ heroku config:set NPM_CONFIG_PRODUCTION=false
$ git push heroku master
```
คำสั่ง `heroku config:set NPM_CONFIG_PRODUCTION=false` เป็นการเซ็ตให้เครื่อง production ติดตั้ง package ต่าง ๆ ใน devDependencies ด้วย
ทดลองเปิด app โดยพิมพ์ต่อไปนี้
```shell
$ heroku open
```
จะเห็นคำว่า `Hello World!` แสดงใน browser
