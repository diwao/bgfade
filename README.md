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
   list-style: none;
   width: 300px;
 }

 #target li {
   background-color: royalblue;
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
import bgfade from 'bgfade';
const bg = Bgfade('target');
```

## Parameters
bgfade use some parameters.

```
Bgfade(id, {speed: value, duration: value});
```

| parameter | description |
| ---- | ---- |
| id(String) | id name of target ul. must. |
| speed(Number) | the time of fade out. default `3`.|
| duration(Number) | duration of fade out to fade out. default `4`.|
