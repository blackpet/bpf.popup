# bpf.videojs
customize videojs



@author blackpet

@date 2020.5.4



# Summary

Bpf.Videojs 는 [videojs](https://videojs.com)를 Customizing 하여 개발한 플레이어 입니다.


<br><br>


# Usage
### 1. bpf.video.js 파일을 페이지 내에 삽입

```
<script src="/static/common/bpf.video.js"></script>
```


### 2. video tag 작성
실행 시 video Tag의 id를 매개변수로 사용하기 때문에 **id attribute 는 필수**입니다.


```
<video id="my-video" class="video-js vjs-theme-fantasy">
    <source src="https://www.radiantmediaplayer.com/media/bbb-360p.mp4" type="video/mp4">
</video>
```


```
<video id="my-video2" class="video-js vjs-theme-fantasy">
    <source src="https://www.youtube.com/watch?v=ahaosybofjs" type="video/youtube">
</video>
```


`class="video-js vjs-theme-fantasy"` attribute 는 videojs 의 기본 style과 fantasy 테마 style 이므로 그대로 입력해 주시면 됩니다.



#### full-version
```
<script>

  // [optional] bpf.videojs Options
  var bpfOption = {
    debug: true, // debugging log 사용 유무
    callback: function (timer, param) {
      // 진도체크용 callback function
      // TODO 진도체크 등... 
      console.log('mp4 callback!!!', timer, param);
    },
    callbackParam: {key1: 1, key2: 2}, // callback() 시 2번째 argument [param] 으로 전달할 parameters
    callbackInterval: 10, // callback 이 호출될 시간 간격 (초) [default: 5]
    ready: function () {
      // video loading 이후 실행될 script
      // TODO ...
      $('#debuggingMp4Btn, #debuggingMp4Btn2, #debuggingMp4Btn3').prop('disabled', false);
      $('#debuggingMp4Btn').click(mp4.debugging);
      $('#debuggingMp4Btn2').click( function() {mp4.debugging(true);} );
      $('#debuggingMp4Btn3').click( function() {mp4.debugging(false);} );
    }
  };
  
  // [optional] original videojs Options
  var videoOption = {
    width: 400, height: 400
  }

  var mp4 = bpf.videojs('my-video', bpfOption, videoOption);
  
</script>
```


#### simple-version (진도체크 없이 기본옵션으로 단순 재생만 할 경우)
```
<script>

  var video = bpf.videojs('my-video');
  
</script>
```



<br><br>


# API

## source type

### mp4

```
<source src="https://www.radiantmediaplayer.com/media/bbb-360p.mp4" type="video/mp4">
```

MP4 파일은 `type="video/mp4"` 를 지정합니다.


### youtube

```
<source src="https://www.youtube.com/watch?v=ahaosybofjs" type="video/youtube">
```

Youtube 의 경우 `type="video/youtube"` 를 지정합니다.


<br><br>

## Options

### bpfOption

bpf.videojs 의 Customizing 한 옵션입니다.


> bpfOption = {debug, callback, callbackParam, callbackInterval}



#### debug

* **default: false**

debugging log 를 활성화/비활성화 하는 옵션입니다.


> debug: true / false



#### callback

진도체크 등과 같은 재생 중 재생시간을 추적할 수 있는 callback function 입니다.


> callback: function(timer, param)


* timer: {played, opened}
    * played: 플레이어를 재생한 시간, 배속 적용 시 배속도 반영된 재생 시간 (초)
    * opened: 플레이어 초기화 후 경과된 물리 시간 (초)

* param: 생성시 전달한 **callbackParam** 을 그대로 전달해 줍니다. (ex. 진도체크 시 과정/차수/컨텐츠 ID 등)


#### callbackParam

callback()의 2번째 arguments 로 전달받을 파라메터


#### callbackInterval

callback()이 실행될 실행 주기 (초)




### videoOption

videojs 원본 option 입니다. 
기본적으로 {width, height} 등을 사용할 수 있습니다.




<br><br>

## return value

```
<script>

  var video = bpf.videojs('my-video');
  
</script>
```



bpf.videojs 로 video 생성 시 반환되는 자료형


> {video, bpfOption, videoOption, debugging}


### video

videojs Object


### bpfOption / videoOption

생성 시 전달한 option 정보와 default option을 합한 option 정보


### debugging(bool)

debugging log를 활성화/비활성화 할 수 있는 function

argument를 전달하지 않으면 상태가 toggle 됩니다.








