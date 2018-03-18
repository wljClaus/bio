# 原生js实现tab简单tab组件

造不了飞机，先造个轮子吧。

> 通过学习js原型以及原型链。摒弃掉之前，重复大量的冗尘的代码。便于后期的维护修改，通过面相对象的方式实现，使现有的代码更简洁。

直接上代码。

```
// css样式如下
        ul {
            display:flex;
            list-style:none;
            margin:0;
            padding:0
        }
        ul li {
            border:1px solid;
            padding:5px;
            background:gray;
            cursor: pointer
        }
        ul li.active {
            background:#fff;

        }
        .content .panel {
            border:1px solid;
            width:300px;
            height:100px;
            background:#fff;
            display:none;
        }
        .content .panel.active {
            display:block;
        }

// html结构
<ul id=sss>
    <li class='tab active'>页面1</li>
    <li class='tab'>页面2</li>
    <li class='tab'>页面3</li>
    <li class='tab'>页面4</li>
</ul>
<div class=content>
    <div class='panel active'>页面1</div>
    <div class='panel'>页面2</div>
    <div class='panel'>页面3</div>
    <div class='panel'>页面4</div>
</div>

// js

function Tab(node) {
        this.item = node.querySelectorAll('li')
        this.init()
    }
    Tab.prototype = {
        init : function () {
            this.$btn = this.item
            this.bind()
        },
        bind : function () {
            var _this = this
            _this.$btn.forEach(function (value) {
                value.addEventListener('click',function () {
                    var idx
                    _this.$btn.forEach(function (val1,val2) {
                        val1.classList.remove('active')
                        if (value === val1) {
                            idx = val2
                        }
                    })
                    this.classList.add('active')

                    this.parentElement.nextElementSibling.querySelectorAll('.panel').forEach(function (panel) {
                        panel.classList.remove('active')
                    })
                    this.parentElement.nextElementSibling.querySelectorAll('.panel')[idx].classList.add('active')

                })
            })
        }
    }
    var tab1 = new Tab(document.querySelector('#sss'))
```
[实验室](http://js.jirengu.com/xumaxetovu/1/)

html结构保持不变，js 只需要获取html中的ul节点即可使用。