
var helper = {
    isToEnd: function (container, content) {
        return container.height() + container.scrollTop() + 10 > content.height()
    },
    createNode: function (movie) {
        var tpl = '<div class="item">\n' +
            '                <a href="">\n' +
            '                    <div class="cover">\n' +
            '                        <img src="" alt="">\n' +
            '                    </div>\n' +
            '                    <div class="detail">\n' +
            '                        <h2></h2>\n' +
            '                        <div class="details-list"><span class="score"></span>分 / <span class="collect"></span>收藏</div>\n' +
            '                        <div class="details-list"><span class="year"></span> / <span class="type"></span></div>\n' +
            '                        <div class="details-list">导演：<span class="director"></span></div>\n' +
            '                        <div class="details-list">主演：<span class="actor"></span></div>\n' +
            '                    </div>\n' +
            '                </a>\n' +
            '            </div>'
        var $node = $(tpl)
        $node.find('a').attr('src', movie.alt)
        $node.find('.cover img').attr('src', movie.images.medium)
        $node.find('.detail h2').text(movie.title)
        $node.find('.score').text(movie.rating.average)
        $node.find('.collect').text(movie.collect_count)
        $node.find('.year').text(movie.year)
        $node.find('.type').text(movie.genres.join(' / '))
        $node.find('.director').text(function () {
            var directors = []
            movie.directors.forEach(function (item) {
                directors.push(item.name)
            })
            return directors.join('、')
        })
        $node.find('.actor').text(function () {
            var actorArr = []
            movie.casts.forEach(function (item) {
                actorArr.push(item.name)
            })
            return actorArr.join('、')
        })
        return $node
    }
}

var Top250 = {
    init : function () {
        this.$container = $('#top250')
        this.$content = this.$container.find('.container')
        this.index = 0
        this.isFinish = false
        this.isLoading = false
        this.bind()
        this.start()
    },
    bind : function () {
        var _this = this
        this.$container.scroll(function () {
            if (!_this.isFinish && helper.isToEnd(_this.$container,_this.$content)){
                _this.start()
            }
        })
    },
    start : function () {
        var _this = this
        this.getData(function (data) {
            _this.render(data)
        })
    },
    getData : function (callback) {
        var _this = this
        if (_this.isLoading) return;
        _this.isLoading = true
        _this.$container.find('.loading').show()
        $.ajax({
            url: 'http://api.douban.com/v2/movie/top250',
            data: {
                start : _this.index || 0,
                count : 20
            },
            dataType : 'jsonp'
        }).done(function (ret) {
            // console.log(ret)
            _this.index += 20
            if (_this.index >= ret.total) {
                _this.isFinish = true
            }
            callback && callback(ret)
        }).fail(function () {
            console.log('error...')
        }).always(function () {
            _this.isLoading = false
            _this.$container.find('.loading').hide()
        })
    },
    render : function (data) {
        var _this = this
        data.subjects.forEach(function (mv) {
            _this.$content.append(helper.createNode(mv))
        })
    }
}

var western = {
    init : function () {
        this.$container = $('#western')
        this.$content = this.$container.find('.container')
        this.start()
    },
    start : function () {
        var _this = this
        this.getData(function (data) {
            _this.render(data)
        })
    },
    getData : function (callback) {
        var _this = this
        _this.$container.find('.loading').show()
        $.ajax({
            url: 'http://api.douban.com/v2/movie/us_box',
            dataType: 'jsonp'
        }).done(function (ret) {
            callback&&callback(ret)
        }).fail(function () {
            console.log('error...')
        }).always(function () {
            _this.$container.find('.loading').hide()
        })
    },
    render : function (data) {
        var _this = this
        // console.log(data)
        data.subjects.forEach(function (item) {
            console.log(item)
            _this.$content.append(helper.createNode(item.subject))
        })
    }
}

var search = {
    init : function () {
        this.$container = $('#search')
        this.$input = this.$container.find('input')
        this.$btn = this.$container.find('.btn')
        this.$content = this.$container.find('.search-result')
        this.bind()
    },
    bind : function () {
        var _this = this
        this.$btn.on('click',function () {
            _this.getData(_this.$input.val(),function (data) {
                _this.render(data)
            })
        })
    },
    getData : function (keyword,callback) {
        var _this = this
        _this.$container.find('.loading').show()
        $.ajax({
            url: 'http://api.douban.com/v2/movie/search',
            data: {
                q:keyword
            },
            dataType : 'jsonp'
        }).done(function (ret) {
            callback&&callback(ret)
        }).fail(function () {
            console.log('error')
        }).always(function () {
            _this.$container.find('.loading').hide()
        })
    },
    render : function (data) {
        var _this = this
        data.subjects.forEach(function (item) {
            _this.$content.append(helper.createNode(item))
        })
    }
}

var App = {
    init : function () {
        this.bind()
        Top250.init()
        western.init()
        search.init()
    },
    bind : function () {
        $('footer > div').on('click', function () {
            $(this).addClass('active').siblings().removeClass('active')
            $('section').hide().eq($(this).index()).fadeIn()
        })
    }
}
App.init()
