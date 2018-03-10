window.onload = function() {
	//获得外层以及每一个盒子
	var container = document.getElementById('wrap')
	var boxes = container.getElementsByTagName('div')
    //运行瀑布流主函数
    waterfall(container, boxes);

    //模拟数据
    var data = [{
        "src": "1.png",
        "title": "第一怪 竹筒当烟袋"
    }, {
        "src": "2.png",
        "title": "第二怪 草帽当锅盖"
    }, {
        "src": "3.png",
        "title": "第三怪 这边下雨那边晒"
    }, {
        "src": "4.png",
        "title": "第四怪 四季服装同穿戴"
    }, {
        "src": "5.png",
        "title": "第五怪 火车没有汽车快"
    }, {
        "src": "6.png",
        "title": "第六怪 火车不通国内通国外"
    }, {
        "src": "7.png",
        "title": "第七怪 老奶爬山比猴快"
    }, {
        "src": "8.png",
        "title": "第八怪 鞋子后面多一块"
    }, {
        "src": "9.png",
        "title": "第九怪 脚趾四季露在外"
    }, {
        "src": "10.png",
        "title": "第十怪 鸡蛋拴着卖"
    }, {
        "src": "11.png",
        "title": "第十一怪 粑粑叫饵块"
    }, {
        "src": "12.png",
        "title": "第十二怪 花生蚕豆数着卖"
    }, {
        "src": "13.png",
        "title": "第十三怪 三个蚊子一盘菜"
    }, {
        "src": "14.png",
        "title": "第十四怪 四个老鼠一麻袋"
    }, {
        "src": "15.png",
        "title": "第十五怪 树上松毛扭着卖"
    }, {
        "src": "16.png",
        "title": "第十六怪 姑娘叫老太"
    }, {
        "src": "17.png",
        "title": "第十七怪 小和尚可以谈恋爱"
    }, {
        "src": "18.png",
        "title": "第十八怪 背着娃娃谈恋爱"
    }];

    //设置滚动加载
    window.onscroll = function() {
        //校验数据请求
        if (getCheck()) {
            var wrap = container;
            for (i in data) {
                //创建figure
                var figure = document.createElement('div');
                wrap.appendChild(figure);
                //创建img
                var img = document.createElement('img');
                img.src = 'images/' + data[i].src;
                img.style.height = 'auto';
                figure.appendChild(img);
                //创建a标记
                var a = document.createElement('a');
                a.href = "https://xiedaimala.com";
                a.target = "_blank";
                a.innerHTML = data[i].title;
                figure.appendChild(a);
            };
            waterfall(container, boxes);
        };
    };
};

// 瀑布流主函数
function waterfall(wrap, figures) {
    //	获得屏幕可显示的列数
    var figureW = figures[0].offsetWidth + 20;  // 单个盒子的宽度
    var colsNum = Math.floor(document.documentElement.clientWidth / figureW);   // 一排可以放多少个盒子
    wrap.style.width = figureW * colsNum + 'px'; // 根据盒子的宽度和每一行可以放的个数 为父元素赋值
    //	循环出所有的figure并按照瀑布流排列
    var everyH = []; //定义一个数组存储每一列的高度
    for (var i = 0; i < figures.length; i++) {
        if (i < colsNum) {
            everyH[i] = figures[i].offsetHeight + 20;
        } else {
            var minH = Math.min.apply(null, everyH); //获得最小的列的高度
            var minIndex = getIndex(minH, everyH); //获得最小列的索引
            getStyle(figures[i], minH, figures[minIndex].offsetLeft - 10, i);
            everyH[minIndex] += figures[i].offsetHeight + 20; //更新最小列的高度
        };
        figures[i].onmouseover = function() {
            this.style.opacity = "0.5";
        };
        figures[i].onmouseout = function() {
            this.style.opacity = "1";
        };
    };
};

// 获取最小列的索引
function getIndex(minH, everyH) {
    for (index in everyH) {
        if (everyH[index] == minH) return index;
    };
};

// 数据请求检验
function getCheck() {
    var documentH = document.documentElement.clientHeight;
    var scrollH = document.documentElement.scrollTop || document.body.scrollTop;
    return documentH + scrollH >= getLastH() ? true : false;
};

// 获得最后一个figure所在列的高度
function getLastH() {
    var wrap = document.getElementById('wrap');
    var figures = document.getElementsByTagName('div');
    return figures[figures.length - 1].offsetTop + figures[figures.length - 1].offsetHeight;
};

// 设置加载样式
var getStartNum = 0; //设置请求加载的条数的位置
function getStyle(figure, top, left, index) {
    if (getStartNum >= index) return;
    $(figure).css({
        'position': 'absolute',
        'top': top,
        "left": left,
        "opacity": "0"
    });
    $(figure).stop().animate({
        "opacity": "1"
    }, 999);
    getStartNum = index; //更新请求数据的条数位置
};
