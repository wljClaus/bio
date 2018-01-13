function $(selector) {
    return selector ? document.querySelector(selector) : null
}
$('header .login').addEventListener('click', function (e) {
    e.stopPropagation();
    $('.layer-pop').style.display = "block";
}, false)
//  弹出层页面翻转效果
$('.layer-pop').addEventListener('click', function (e) {
    e.stopPropagation();
    if (e.target.classList.contains('enter-btn')) {
        $('.layer-pop').classList.remove('register');
        $('.layer-pop').classList.add('enter');

    }
    if (e.target.classList.contains('register-btn')) {
        $('.layer-pop').classList.remove('enter');
        $('.layer-pop').classList.add('register');
    }

    // 关闭按钮绑定事件
    if (e.target.classList.contains('close')) {
        $('.layer-pop').style.display = 'none';

    }

    // 点击submit事件，弹出报错。

}, false)
window.addEventListener('click', function (e) {
    e.stopPropagation();
    $('.layer-pop').style.display = "none";

})




















