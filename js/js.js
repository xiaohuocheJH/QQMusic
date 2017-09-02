
var header=document.getElementsByClassName('header')[0];
var main=document.getElementsByClassName('main')[0];
var footer=document.getElementsByClassName('footer')[0];
;(function () {
    var winh=document.documentElement.clientHeight||document.body.clientHeight;
    var val=winh-header.offsetHeight-footer.offsetHeight-0.8*htmlFontSize;
    main.style.height=val+'px';
})();
var music=(function () {
    var data=null;
    var lyric=document.getElementsByClassName('lyric')[0];
    var audio=document.getElementsByClassName('audio')[0];
    var play=document.getElementsByClassName('play')[0];
    var pause=document.getElementsByClassName('pause')[0];
    var currentTime=document.getElementsByClassName('currentTime')[0];
    var totalTime=document.getElementsByClassName('totalTime')[0];
    var progressBarSpan=document.getElementsByClassName('progressBar')[0].getElementsByTagName('span')[0];
    var lyricPs=lyric.getElementsByTagName('p');
    var collectionA=document.getElementsByClassName('collection')[0].getElementsByTagName('a')[0];
    function getData() {
        var xhr=new XMLHttpRequest();
        xhr.open('get','./lyric.json?_='+Math.random(),false);
        xhr.onreadystatechange=function () {
          if(xhr.readyState==4&&/^2\d\d$/.test(xhr.status)){
              data=JSON.parse(xhr.responseText);
              // console.log(data)
          }
        };
        xhr.send(null);
    }
    function bindData() {
        if(data&&data.lyric){
            data=data.lyric;
            var str='';
            for(var i=0;i<data.length;i++){
                var curData=data[i];
                str+='<p id="'+curData.id+'" data-min="'+curData.minute+'" data-sec="'+curData.second+'">'+curData.content+'</p>'
            }
            lyric.innerHTML=str;
        }
    }
    function autoPlay() {
        audio.play();
        audio.oncanplay=function () {
            totalTime.innerHTML=formatTime(audio.duration);
            play.style.display='none';
            pause.style.display='block';
        };
    }
    function btnEvent() {
        play.onclick=pause.onclick=function () {
            if(audio.paused){
                audio.play();
                play.style.display='none';
                pause.style.display='block';
            }else{
                audio.pause();
                pause.style.display='none';
                play.style.display='block';
            }
        }
    }
    function formatTime(s) {
        var min=Math.floor(s/60);
        var sec=Math.floor(s-min*60);
        min<10?min='0'+min:void 0;
        sec<10?sec='0'+sec:void 0;
        return min+':'+sec;
    }
    function playStatus() {
        var timer=window.setInterval(function () {
            if(audio.currentTime>=audio.duration){
                window.clearInterval(timer);
                return;
            }
            currentTime.innerHTML=formatTime(audio.currentTime);
            progressBarSpan.style.width=audio.currentTime/audio.duration*100+'%';
            var min=formatTime(audio.currentTime).split(':')[0];
            var sec=formatTime(audio.currentTime).split(':')[1];
            for(var i=0;i<lyricPs.length;i++){
                var curP=lyricPs[i];
                if(curP.getAttribute('data-min')==min&&curP.getAttribute('data-sec')==sec){
                    for(var j=0;j<lyricPs.length;j++){
                        lyricPs[j].className=i==j?'bg':'';
                    }
                    if(curP.id>=4){
                        lyric.style.top=-(curP.id-3)*0.84*htmlFontSize+'px';
                    }
                    break;
                }
            }

        },1000)
    }
    function Collection() {
        var flag=false;
        collectionA.onclick=function () {
            if(flag){collectionA.style.background='url(img/sprite_play.png) no-repeat 0 0/0.8rem 7rem';flag=false;}
                else{  collectionA.style.background='url(img/sprite_play.png) no-repeat 0 '+(-0.6*htmlFontSize)+'px/0.8rem 7rem';flag=true;}
        }
    }
    return {
        init:function () {
            getData();
            bindData();
            autoPlay();
            btnEvent();
            playStatus();
            Collection();
        }
    }
})();
music.init();