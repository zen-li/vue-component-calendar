### 引用方式
<script type="text/javascript" src="http://awp-assets.meituan.net/assets/vue/1.0.12/vue.min.js"></script>
<script src="../dist/build.js"></script>


```
<!-- 资源引用 -->
<script type="text/javascript" src="http://awp-assets.meituan.net/assets/vue/1.0.12/vue.min.js"></script>
<script src="../dist/build.js"></script>

<!-- DOM -->
<div class="hfe-alert">
    <button @click.prevent="showDialog=true">Alert</button>
    <alert :show-dialog.sync="showDialog" :title="title" :content="content"></alert>
</div>

<!-- js代码 -->
<script>
var a = new Vue({
    el: '.hfe-alert',
    data: {
        "showDialog": false,
        "title": "xxxx",
        "content": "xxxxxxxx"
    },
    components: {
        'alert': hfe.alert
    }
});
</script>
```


### demo

<div class="hfe-alert">
    <button @click.prevent="showDialog=true">Alert</button>
    <alert :show-dialog.sync="showDialog" :title="title" :content="content"></alert>
</div>
<script>
var a = new Vue({
    el: '.hfe-alert',
    data: {
        "showDialog": false,
        "title": "xxxx",
        "content": "xxxxxxxx"
    },
    components: {
        'alert': hfe.alert
    }
});
</script>
<style type="text/css">

button {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
    border-radius: 3px;
    background: #337ab7;
    text-transform: none;
    color: #fff;
    background-color: #337ab7;
    border-color: #2e6da4;
    margin: 20px;
}
</style>
