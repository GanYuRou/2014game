## 2048Game

### 1.主要实现

通过ES6的class语法糖的实现游戏类封装，故可以在创建实例时传递一个参数来指定生成多少行。因此我实现了两个模式。一个是简单的4x4的简单模式；还有一个是6x6的较困难模式。

### 2.最高分数存储

使用localStorage本地存储，将每局的最高分存入本地浏览器中，这样就不会出现重新打开页面时，最高分丢失的情况