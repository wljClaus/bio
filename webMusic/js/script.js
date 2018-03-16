// 1.页面划分，1）footer  2）main显示区块
// footer 1.页面发送请求获取数据（分类列表）
// 2. 获取列表数据，将其拼接成html
// 3. 处理footer中的事件，前后按钮点击产生的交互效果。
// 4. footer与main的交互效果——点击footer中的任何一个歌曲的类别，main会展示相应类别的歌曲。

// 页面分为两部分，一部分是footer部分，一部分是main主要展示区块


// 简单的事件发布订阅模式
var EventCenter = {
    on: function (type, handler) {
        $(document).on(type, handler)
    },
    fire: function (type, data) {
        $(document).trigger(type, data)
    }
}

// 测试
// EventCenter.on('hello', function(e,data){
//     console.log(data)
// })
// EventCenter.fire('hello', '你好')

// footer
var Footer = {
    // 初始化
    init: function () {
        this.$footer = $('#Footer') //  获取footer
        this.$ul = this.$footer.find('ul')
        this.$box = this.$footer.find('.box')
        this.$leftBtn = this.$footer.find('.icon-left')
        this.$rightBtn = this.$footer.find('.icon-right')

        this.isToEnd = false
        this.isToStart = true
        this.isAnimate = false // 防止重复点击


        this.bind() //  调用绑定事件函数    注意bind和render调用的先后顺序，
        this.render()   // 调用页面渲染函数
    },
    // 绑定事件
    bind: function () {
        var _this = this
        this.$rightBtn.on('click', function () {
            if (_this.isAnimate) return;
            var liWidth = _this.$box.find('li').outerWidth(true)  // 获取每个li宽度
            var rowSum = Math.floor(_this.$box.width() / liWidth)   // 通过包裹li的大盒子宽度／li的宽度 得到可以完整展示li的个数

            if (!_this.isToEnd) {   // 通过if的特性，根据判断结果是否执行下列代码。在初始化过程中为其加上一个点击事件的开关。
                _this.isAnimate = true
                _this.$ul.animate({
                    //
                    // left:'-='+ _this.$box.width()    此方法页面展示太丑，会出现li只显示一半的情况。
                    left: '-=' + rowSum * liWidth    // 通过获取的盒子最多个数量 * li元素的宽度 这样就可以完美呈现
                }, 800, function () {
                    _this.isToStart = false
                    _this.isAnimate = false
                    // console.log(_this.$box.width - parseFloat(_this.$ul.css('left'),_this.$ul.width()))
                    if (_this.$box.width() - parseFloat(_this.$ul.css('left')) >= _this.$ul.width()) {
                        _this.isToEnd = true
                    }
                })
            }

        })

        this.$leftBtn.on('click', function () {
            if (_this.isAnimate) return;
            var liWidth = _this.$box.find('li').outerWidth(true)
            var rowCount = Math.floor(_this.$box.width() / liWidth)
            if (!_this.isToStart) {
                _this.isAnimate = true
                _this.$ul.animate({
                    left: '+=' + rowCount * liWidth
                }, 800, function () {
                    _this.isToEnd = false
                    _this.isAnimate = false
                    if (parseFloat(_this.$ul.css('left')) >= 0) {
                        _this.isToStart = true
                    }
                })
            }
        })


        // 由于li是最后通过js渲染的所以必须走事件代理才可以
        this.$footer.on('click', 'li', function () {
            $(this).addClass('active').siblings().removeClass('active')
            // EventCenter.fire('albumn',$(this).attr('data-channel-id'))  // 发送一个数据不够，tag标签内容也需要更换。
            EventCenter.fire('albumn', {
                channelId: $(this).attr('data-channel-id'),
                channelName: $(this).attr('data-channel-name')
            })
        })
    },
    // 页面渲染
    render: function () {
        var _this = this
        // 获取数据
        $.getJSON('//jirenguapi.applinzi.com/fm/getChannels.php')
            .done(function (ret) {
                //  console.log(ret)    // 检测是否获取到数据 获取到数据，把数据传递给渲染footer的属性。
                _this.renderFooter(ret.channels)
            }).fail(function () {
            console.log('error...')
        })
    },
    renderFooter: function (channels) {
        // console.log(channels) 检测数据是否正常
        var html = ''
        channels.forEach(function (channel) {
            html += '<li data-channel-id=' + channel.channel_id + ' data-channel-name=' + channel.name + '>'
                + '  <div class="cover" style="background-image:url(' + channel.cover_small + ')"></div>'
                + '  <h3>' + channel.name + '</h3>'
                + '</li>'
        })
        this.$ul.html(html)
    }
}


// main
var Fm = {
    init: function () {
        this.$container = $('#page-music .galleys')
        this.audio = new Audio()
        this.audio.autoplay = true


        this.bind()
    },
    bind: function () {
        var _this = this
        EventCenter.on('albumn', function (e, channelObj) {
            // console.log(channelObj)
            _this.chanelId = channelObj.channelId
            _this.chanelName = channelObj.channelName
            _this.getMusic()
        })

        _this.$container.find('.btn-play').on('click', function () {
            if ($(this).hasClass('icon-stop')) {
                $(this).removeClass('icon-stop').addClass('icon-play')
                _this.audio.pause()
            } else {
                $(this).removeClass('icon-play').addClass('icon-stop')
                _this.audio.play()
            }
        })
        _this.$container.find('.btn-heart').on('click',function () {
            $(this).toggleClass('active')
        })

        _this.$container.find('.btn-next').on('click', function () {
            _this.getMusic()
        })

        _this.audio.addEventListener('play', function () {
            console.log('play')

            _this.clock = setInterval(function () {
                _this.timeLine()
            }, 1000)
        })

        _this.audio.addEventListener('pause', function () {
            console.log('pause')
            clearInterval(_this.clock)
        })
    },
    getMusic: function () {
        var _this = this
        $.getJSON('//jirenguapi.applinzi.com/fm/getSong.php', {channel: this.chanelId})
            .done(function (ret) {
                _this.play(ret['song'][0])
            })
    },
    // 播放音乐并且设置相应的交互样式
    play: function (song) {
        this.audio.src = song.url   // 获取地址无法播放时，添加一个meta标签，referrer never  意思是发请求获取音乐时不附带当前的url，相当于来源为空。
        this.$container.find('.aside figure').css('background-image', 'url(' + song.picture + ')')
        this.$container.find('.details h1').text(song.title)
        this.$container.find('.details .singer').text(song.artist)
        this.$container.find('.details .tag').text(this.chanelName)
        $('.bg').css('background-image', 'url(' + song.picture + ')')
        this.$container.find('.btn-play').removeClass('icon-play').addClass('icon-stop')
        this.getLyric(song.sid)
    },
    timeLine: function () {
        var min = Math.floor(this.audio.currentTime / 60)
        var second = Math.floor(this.audio.currentTime % 60) + ''   // 转换成字符串，可以得到length   小技巧
        second = second.length === 1 ? '0' + second : second
        var progress = this.audio.currentTime / this.audio.duration * 100 + '%'
        this.$container.find('.progress .progress-time').text(min + ':' + second)
        this.$container.find('.bar-progress').css('width', progress)


        var line = this.lyrics['0'+min+':'+second]
        // this.$container.find('.lyrics p').text(line)    //  如果是undefined 页面不会显示歌词。
        if (line) {
            this.$container.find('.lyrics p').text(line).effects()
        }
    },
    getLyric: function (sid) {
        var _this = this
        $.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php', {sid: sid})
            .done(function (ret) {
                // console.log(ret)    // 获得歌词，然后对歌词进行切分，分为key：value的形式进行操作。
                var lyricObj = {}   // 定义一个对象，对象的属性是时间轴，值就是歌词
                ret.lyric.split('\n').forEach(function (line) {
                    var times = line.match(/\d{2}:\d{2}/g)
                    var lyrics = line.replace(/\[.+?\]/g, '')
                    // times.forEach(function (time) {
                    //     lyricObj[time] = lyrics
                    // })
                    if (Array.isArray(times)) {    // 剔除bug
                        times.forEach(function (time) {
                            lyricObj[time] = lyrics
                        })
                    }
                })
                _this.lyrics = lyricObj
            })
    }
}

// 歌词特效设置
$.fn.effects = function (type) {
    var type = type || 'zoomIn'
    this.html(function () {
        var arr = $(this).text().split('').map(function (item) {    // 把文本打散，组成数组，在利用数组的方法把每一个单独的文本，用span标签包裹，给每一个单独的span追加样式
            return '<span class="effects">' + item + '</span>'
        })
        return arr.join('')
    })

    var index = 0
    var span = $(this).find('span')
    console.log(span)   // 获取到p元素里的每一个文本span
    var clock = setInterval(function () {
        span.eq(index).addClass('animated ' + type).css('opacity','1')
        index++
        if (index >=span.length) {
            clearInterval(clock)
        }
    },300)
}

Footer.init()
Fm.init()



