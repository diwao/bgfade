# bgfade
bgfade is JavaScript Library to switch display of DOM elements with fade.

## How to use

install this packege.
```
$ npm install -D bgfade
```

edit html file like below.

```
<style>
 #target {
   height: 300px;
   width: 300px;
 }

 #target li {
   font-size: 30px;
   height: 100%;
   text-align: center;
   width: 100%;
 }
</style>

<!-- must use ul with id -->
<ul id="target">
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

edit js file like below.
```
const Bgfade = require('bgfade');
const bgfade = Bgfade('target');
```

## Parameters
bgfade use some parameters.

```
Bgfade(id, speed, duration);
```

| parameter | description |
| ---- | ---- |
| id | id name of target ul. must. |
| speed | the time of fade out. default `3`|
| duration | duration of fade out to fade out. default `4`|
