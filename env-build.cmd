rem *** npm package.json ***
if not exist package.json call npm init -y
call npm install

rem *** typescript ***
call npm i -g typescript
call :npm-i-D typescript
if not exist tsconfig.json call tsc --init

rem *** webpack ***
call npm i -g webpack
call :npm-i-D webpack
rem webpack.config.js
call npm i -g webpack-dev-server
call :npm-i-D webpack-dev-server

rem *** react ***
call :npm-i-D react-dom
call :npm-i-D react

rem *** webpack loader ***
rem call :npm-i-D json-loader

call :npm-i-D babel-core
call :npm-i-D babel-loader

call :npm-i-D ts-loader

call :npm-i-D copy-webpack-plugin

rem *** typings ***
call npm i -g typings
call :npm-i-D typings
call typings install

call npm i -D @types/node

if not exist typings.json call typings init
call typings install -D react
call typings install -D react-dom

call :npm-i-D babel-preset-react
call :npm-i-D babel-preset-es2015

call :npm-i-D react-bootstrap
call :npm-i-D bootstrap

call :npm-i-D light-request

pause

goto end
:npm-i-D
if not exist node_modules\%1 call npm i -D %1

:end
