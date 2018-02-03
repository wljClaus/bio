

// 获取需要的dom
var menuBtn = $('.headerMenuBtn');
var musicpanel = $('.music-list');

var songNum = 3;
var songList = [];

var course = $('.course');
var main = $('.player-main');
var loop = $('.loop');
menuBtn.on('click', function () {
    if (menuBtn.hasClass('header-btn1')) {
        menuBtn.removeClass('header-btn1').addClass('header-btn2');
        musicpanel.css({'transform': 'translate(0px)'});
        course.css({'zIndex': '99'});
        main.animate({opacity:0},'slow')

    } else {
        menuBtn.removeClass('header-btn2').addClass('header-btn1');
        musicpanel.css({'transform': 'translate(-300px)'})
        course.css({'zIndex': '10'})
        main.animate({opacity:1},'slow')
    }
})

loop.on('click',function(){
    if ($(this).hasClass('noloop')){
        $(this).removeClass('noloop').addClass('keep');
        $('audio').attr('loop','loop');
    } else {
        $(this).removeClass('keep').addClass('noloop');
        $('audio').attr('loop','no-loop');
    }
})
$('.collect').on('click',function () {
    $(this).toggleClass('love')
})
function backmusic(song) {
    $('.btn1').on('click',function () {
        if (song.length-1 != 0){
            console.log(song)
            setMusicBySong(song[song.length-2])

        } else {
            alert('没有上一曲哟～')
        }
    })
}

//播放控制
var myAudio = $("audio")[0];
var lyricArr = [];
// 播放/暂停控制
$(".btn2").click(function(){
    if (myAudio.paused) {
        play()
    } else {
        pause()
    }
});
// 频道切换
$(".word").click(function(){
    getChannel();
});
// 播放下一曲音乐
$(".btn3").click(function(){
    getmusic();
});

// 暂停与播放按钮
function play(){
    myAudio.play();
    $('.btn2').removeClass('start').addClass('stop');
    $('.images').css({'animationPlayState':'running'})
}
function pause(){
    myAudio.pause();
    $('.btn2').removeClass('stop').addClass('start');
    $('.images').css({'animationPlayState':'paused'})
}

//获取频道信息
function getChannel(){
    $.ajax({
        url: 'http://api.jirengu.com/fm/getChannels.php',
        dataType: 'json',
        Method: 'get',
        success: function(response){
            var channels = response.channels;
            var num = Math.floor(Math.random()*channels.length);
            var channelname = channels[num].name;
            var channelId = channels[num].channel_id;
            $('.header-title').text(channelname);
            $('.header-title').attr('title',channelname);
            $('.header-title').attr('data-id',channelId);
            getmusic();
        }
    })
}
// 通过ajax获取歌曲
function getmusic(){
    var song = {};
    $.ajax({
        url: 'http://api.jirengu.com/fm/getSong.php',
        dataType: 'json',
        Method: 'get',
        // data:{
        //     'channel': $('.record').attr('data-id')
        // },
        success: function (ret) {
            var resource = ret.song[0],
                // url = resource.url,
                // bgPic = resource.picture,
                // sid = resource.sid,//
                // ssid = resource.ssid,//
                // title = resource.title,
                // author = resource.artist;
            song = resource;

            // $('#player').attr('src',url);
            // $('#player').attr('sid',sid);
            // $('#player').attr('ssid',ssid);
            // $('.music-name').text(title);
            // $('.music-name').attr('title',title)
            // $('.music-singer').text(author);
            // $('.music-singer').attr('title',author);
            setMusicBySong(song);
            songList.push(song);
            backmusic(songList);
        }
    })
};
function setMusicBySong(song) {
    play.src = song.url;
    $('.music-name').text(song.title);
    $(".images").css({
        backgroundImage: "url(" + song.picture + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition:"center",
        backgroundSize: "cover"
    });
    $(".music-img").css({
        backgroundImage: "url(" + song.picture + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition:"center",
        backgroundSize: "cover"
    });
    $('#player').attr('src',song.url);
    $('#player').attr('sid',song.sid);
    $('#player').attr('ssid',song.ssid);
    $('.music-name').text(song.title);
    $('.music-name').attr('title',song.title)
    $('.music-singer').text(song.artist);
    $('.music-singer').attr('title',song.artist);
    play();//播放
    getlyric();//获取歌词
}
//获取歌词
function getlyric(){
    var Sid = $('audio').attr('sid');
    var Ssid = $('audio').attr('ssid');
    $.post('http://api.jirengu.com/fm/getLyric.php', {ssid: Ssid, sid: Sid})
        .done(function (lyr){
            // console.log(lyr);
            var lyr = JSON.parse(lyr);;
            // console.log(lyr);
            if (!!lyr.lyric) {
                $('.music-info .lyric').empty();//清空歌词信息
                var line = lyr.lyric.split('\n');//歌词为以排数为界的数组
                var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;//时间的正则
                var result = [];
                if(line != ""){
                    for(var i in line){//遍历歌词数组
                        var time = line[i].match(timeReg);//每组匹配时间 得到时间数组
                        if(!time)continue;//如果没有 就跳过继续
                        var value = line[i].replace(timeReg,"");// 纯歌词
                        for(j in time){//遍历时间数组
                            var t = time[j].slice(1, -1).split(':');//分析时间  时间的格式是[00:00.00] 分钟和毫秒是t[0],t[1]
                            //把结果做成数组 result[0]是当前时间，result[1]是纯歌词
                            var timeArr = parseInt(t[0], 10) * 60 + parseFloat(t[1]); //计算出一个curTime s为单位
                            result.push([timeArr, value]);
                        }
                    }
                }
                //时间排序
                result.sort(function (a, b) {
                    return a[0] - b[0];
                });
                lyricArr = result;//存到lyricArr里面
                renderLyric();//渲染歌词
            }
        }).fail(function(){
        $('.music-info .lyric').html("<li>本歌曲展示没有歌词</li>");
    })
}

function renderLyric(){
    var lyrLi = "";
    for (var i = 0; i < lyricArr.length; i++) {
        lyrLi += "<li data-time='"+lyricArr[i][0]+"'>"+lyricArr[i][1]+"</li>";
    }
    $('.music-info .lyric').append(lyrLi);
    setInterval(showLyric,100);//怎么展示歌词
}
function showLyric(){
    var liH = $(".lyric li").eq(5).outerHeight()-3; //每行高度
    for(var i=0;i< lyricArr.length;i++){//遍历歌词下所有的li
        var curT = $(".lyric li").eq(i).attr("data-time");//获取当前li存入的当前一排歌词时间
        var nexT = $(".lyric li").eq(i+1).attr("data-time");
        var curTime = myAudio.currentTime;
        if ((curTime > curT) && (curT < nexT)){//当前时间在下一句时间和歌曲当前时间之间的时候 就渲染 并滚动
            $(".lyric li").removeClass("active");
            $(".lyric li").eq(i).addClass("active");
            $('.music-info .lyric').css('top', -liH*(i-1));
        }
    }
}

//进度条控制
setInterval(present,1000)
$(".progress-course").mousedown(function(event){
    var posX = event.clientX;
    var targetLeft = $(this).offset().left;
    var percentage = (posX - targetLeft)/200*100;
    myAudio.currentTime = myAudio.duration * percentage/100;
});
function present(){

    var percent = (myAudio.currentTime / myAudio.duration) * 100 + '%';
    $('.progress-time').width(percent);
    var minute = parseInt(myAudio.currentTime / 60);
    var second = parseInt(myAudio.currentTime % 60) + '';
    var musicTime = Math.floor(myAudio.duration / 60);
    var sec = Math.ceil(myAudio.duration) - musicTime * 60;
    second = second.length == 2 ? second : '0' + second;
    $('.progress-time1').text(minute + ':' + second);
    $('.progress-time2').text(musicTime + ':' + sec)
    if(myAudio.currentTime == myAudio.duration){
        getmusic()
    }
}
$(document).ready(getChannel())
