let startBtn = true;
let totalSeconds = 0;
let audioPlayer = $('#audioPlayer')[0];
let continuousPlaybackBtn = true;
let randomPlayBtn = true;
let tempRandomPlayBtn = '';
let nowMusic = true;
let musicVolume = true;
let heartBtn = true;
let storageMusic = "";
let storageTitle = [];
let storagePicture = [];
let storageArtist = [];
let nowMusicBar = $('#nowMusicBar');
let musicSound = $('#musicVolume')[0];
let audioLoop = true;
let musicListIndex = 0;
let musicDBNum = 0;
let tempJsonArray = [];
let tempShuffleArray = [];
let youtubePlayer2;
const targetHeight = $('#musicAllBox').innerHeight() - 4 * parseFloat(getComputedStyle(document.documentElement).fontSize);

//재생바 실행중인 앨범 보이기
function bottomBarView(album, title, artist) {
    let bottomBarViewContent = '';
    bottomBarViewContent += `<div class="nowAlbumBox">`;
    bottomBarViewContent += `<img class="nowAlbum" src="${album}" alt="album">`;
    bottomBarViewContent += `</div>`;
    bottomBarViewContent += `<div class="nowAlbumText">`;
    bottomBarViewContent += `<div class="nowAlbumText1">${title}</div>`;
    bottomBarViewContent += `<div class="nowAlbumText2">${artist}</div>`;
    bottomBarViewContent += `</div>`;
    $('#titleView').html(bottomBarViewContent);
}


function bottomBarOpen(value) {
    $(document).on('click', value, () => {
        $('.nowMusicBar').css('display', 'block');
        $('.bottomBar').css('display', 'block');
    });
}


//재생중인 음악화면 보이기
function nowView(album, title, artist) {
    let nowView = '';
    nowView += `<div class="playAlbum">`;
    nowView += `<img class="nowAlbum" src="${album}" alt="nowAlbum">`;
    nowView += `</div>`;
    nowView += `<div class="playAlbumTitle">`;
    nowView += `<p class="playAlbumTitle1">${title}</p>`;
    nowView += `<p class="playAlbumTitle2">${artist}</p>`;
    nowView += `</div>`;
    $('#nowMusicAlbumBox').html(nowView);
}


//음악 실행
function playAudio(index) {
    $('#audioPlayer').on('canplaythrough', function () {
        $(this)[0].play();
        musicSecound();
        musicListIndex = index;
    })
}

//막대 길이 최대 수정
function musicMaxBar() {
    nowMusicBar.prop('max', totalSeconds);
}

//뮤직 소리 조절하기
function soundValue() {
    musicSound.addEventListener('change', function (e) {
        audioPlayer.volume = this.value / 10;
        let volume = audioPlayer.volume;
        if (volume == '0') {
            $('.soundControlBtn').removeClass('xi-volume-down');
            $('.soundControlBtn').removeClass('xi-volume-up');
            $('.soundControlBtn').addClass('xi-volume-off');
        } else if (0 < volume && volume < 0.5) {
            console.log(" 0 < V < 0.5 ");
            $('.soundControlBtn').removeClass('xi-volume-off');
            $('.soundControlBtn').removeClass('xi-volume-up');
            $('.soundControlBtn').addClass('xi-volume-down');
        } else if (0.5 < volume) {
            console.log(" 0.5 < V ");
            $('.soundControlBtn').removeClass('xi-volume-down');
            $('.soundControlBtn').removeClass('xi-volume-off');
            $('.soundControlBtn').addClass('xi-volume-up');
        } else { }
    });
}

//노래 랜덤 재생하기 위한 배열 섞기(피셔 예이츠 알고리즘)
function shuffleArray(array) {
    tempShuffleArray = array.slice();
    let tempLength = tempShuffleArray.length;
    for (let i = tempLength - 1; i >= 0; i--) {
        let tempNumber = randomNumber(0, tempLength - 1);
        let tempValue = tempShuffleArray[i];
        tempShuffleArray[i] = tempShuffleArray[tempNumber];
        tempShuffleArray[tempNumber] = tempValue;
    }
    return tempShuffleArray;
}

//랜덤 숫자 구하기
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//음악 멈춤
function pauseAudio() {
    $('#audioPlayer')[0].pause();
}

//음악 처음부터
function stopAudio() {
    $('#audioPlayer')[0].pause();
    audio.currentTime = 0;
    $('#audioPlayer').prop("currentTime", 0);
}

// 최종 재생 시간
function musicSecound() {
    totalSeconds = audioPlayer.duration;
    audioPlayer.ontimeupdate = function () { $('#timeView').html(`${musicTime()}-${formatTime(totalSeconds)}`) };
    musicBar();
    musicMaxBar();
}
// 00:00 형식으로 변환 최종시간
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // 시간 값을 두 자리 숫자로 변환
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// 00:00 형식으로 변환 실시간
function musicTime() {
    let currentTime = audioPlayer.currentTime;
    let formattedTime = formatTime(currentTime);
    return formattedTime;
}

//막대바 실시간 이동
function musicBar() {
    audioPlayer.addEventListener('timeupdate', function () {
        nowMusicBar.val(audioPlayer.currentTime);
    });

    nowMusicBar.on('input', function () {
        audioPlayer.currentTime = nowMusicBar.val();
    });
}

//musicDBNum 값 정해주기
function getMusicDBNum() {
    if (randomPlayBtn) {
        musicDBNum = tempJsonArray[musicListIndex].num;
    } else {
        musicDBNum = tempShuffleArray[musicListIndex].num;
    }
}

//보관함 플레이 리스트 플레이시 실행
function storageListPlay(value) {
    $(document).on('click', value, function () {
        let tempValue = $(this).closest('.albumStorageBox').attr("data-value");
        let tempLength = tempJsonArray.length;
        for (let i = 0; i < tempLength; i++) {
            if (tempJsonArray[i].num == tempValue) {
                musicListIndex = i;
            }
        }
        let nextSongLink = tempJsonArray[musicListIndex].songLink;
        $('#audioPlayer').attr("src", `${nextSongLink}`);
        bottomBarView(tempJsonArray[musicListIndex].albumLink, tempJsonArray[musicListIndex].songName, tempJsonArray[musicListIndex].artist);
        nowView(tempJsonArray[musicListIndex].albumLink, tempJsonArray[musicListIndex].songName, tempJsonArray[musicListIndex].artist);
        if (startBtn) {
            $('#startStopBtn').removeClass('xi-play')
            $('#startStopBtn').addClass('xi-pause');
            startBtn = !startBtn;
        }
        playAudio(musicListIndex);
        startBtn = false;
        getMusicDBNum();
    });
}

//노래 시작 멈춤
function musicPlayBtn() {
    if (startBtn) {
        $('#startStopBtn').removeClass('xi-play')
        $('#startStopBtn').addClass('xi-pause');
        playAudio(musicListIndex);
        startBtn = !startBtn;
    } else {
        $('#startStopBtn').removeClass('xi-pause');
        $('#startStopBtn').addClass('xi-play');
        pauseAudio();
        startBtn = !startBtn;
    }
}

//다음 노래 실행하기
function nextMusicPlay(array) {
    musicListIndex++;
    if (musicListIndex + 1 > array.length) {
        musicListIndex = 0;
        let nextSongLink = array[musicListIndex].songLink;
        $('#audioPlayer').attr("src", `${nextSongLink}`);
        playAudio(musicListIndex);
        bottomBarView(array[musicListIndex].albumLink, array[musicListIndex].songName,
            array[musicListIndex].artist);
        nowView(array[musicListIndex].albumLink, array[musicListIndex].songName,
            array[musicListIndex].artist);
    } else {
        let nextSongLink = array[musicListIndex].songLink;
        $('#audioPlayer').attr("src", `${nextSongLink}`);
        playAudio(musicListIndex);
        bottomBarView(array[musicListIndex].albumLink, array[musicListIndex].songName,
            array[musicListIndex].artist);
        nowView(array[musicListIndex].albumLink, array[musicListIndex].songName,
            array[musicListIndex].artist);
    }
    $('#startStopBtn').removeClass('xi-play')
    $('#startStopBtn').addClass('xi-pause');
    if (startBtn) {
        startBtn = !startBtn;
    }
}

//이전 노래 실행하기
function previousMusicPlay(array) {
    musicListIndex--;
    if (musicListIndex < 0) {
        musicListIndex = array.length - 1;
        let nextSongLink = array[musicListIndex].songLink;
        $('#audioPlayer').attr("src", `${nextSongLink}`);
        playAudio(musicListIndex);
        bottomBarView(array[musicListIndex].albumLink, array[musicListIndex].songName, array[musicListIndex].artist);
        nowView(array[musicListIndex].albumLink, array[musicListIndex].songName, array[musicListIndex].artist);
    } else {
        let nextSongLink = array[musicListIndex].songLink;
        $('#audioPlayer').attr("src", `${nextSongLink}`);
        playAudio(musicListIndex);
        bottomBarView(array[musicListIndex].albumLink, array[musicListIndex].songName, array[musicListIndex].artist);
        nowView(array[musicListIndex].albumLink, array[musicListIndex].songName, array[musicListIndex].artist);
    }
    $('#startStopBtn').removeClass('xi-play')
    $('#startStopBtn').addClass('xi-pause');
    if (startBtn) {
        startBtn = !startBtn;
    }
    $('#startStopBtn').removeClass('xi-play')
    $('#startStopBtn').addClass('xi-pause');
    if (startBtn) {
        startBtn = !startBtn;
    }
}

//다음노래 넘기기 버튼
$('#nextBtn').click(() => {
    if (randomPlayBtn) {
        nextMusicPlay(tempJsonArray)
    } else {
        nextMusicPlay(tempShuffleArray);
    }
    getMusicDBNum();
});

//이전노래 넘기기 버튼
$('#previousBtn').click(() => {
    let tempCurrentTime = audioPlayer.currentTime;
    if (tempCurrentTime > 20) {
        audioPlayer.currentTime = 0;
    } else {
        if (randomPlayBtn) {
            previousMusicPlay(tempJsonArray)
        } else {
            previousMusicPlay(tempShuffleArray);
        }
    }
    getMusicDBNum();
});

//한곡 반복 재생하기 버튼 
$('#continuousPlaybackBtn').click(() => {
    if (continuousPlaybackBtn) {
        $('#continuousPlaybackBtn').removeClass('xi-repeat');
        $('#continuousPlaybackBtn').addClass('xi-repeat-one');
        $('.xi-repeat-one').css('color', '#36E36C');
        continuousPlaybackBtn = !continuousPlaybackBtn;
    } else {
        $('#continuousPlaybackBtn').removeClass('xi-repeat-one');
        $('#continuousPlaybackBtn').addClass('xi-repeat');
        $('.xi-repeat').css('color', 'white');
        continuousPlaybackBtn = !continuousPlaybackBtn;
    }
    console.log(continuousPlaybackBtn);
});

$(document).on('click', '.albumStoragePlayBtn', () => {
    $('.nowMusicBar').css('display', 'block');
    $('.bottomBar').css('display', 'block');
});

$(document).on('click', '.musicListTitleClick', () => {
    $('.nowMusicBar').css('display', 'block');
    $('.bottomBar').css('display', 'block');
});

$(document).on('click', '.nowAlbumClick', () => {
    $('.nowMusicBar').css('display', 'block');
    $('.bottomBar').css('display', 'block');
});


//now play 창 올리고 내리기
$('#nowMusic').click(() => {
    if (nowMusic) {
        $('#nowMusic').css('transform', 'rotate(90deg)');
        //다른 창이 켜져있다면 닫고 열기
        if ($('#albumListBox').height() != 0 || $('#albumStorageBox').height() != 0) {
            $('#albumListBox').animate({ height: 0 + 'px' }, 400);
            $('#albumStorageBox').animate({ height: 0 + 'px' }, 400);
            setTimeout(() => {
                $('#nowSongBox').animate({ height: targetHeight + 'px' });
            }, 600);
        } else {
            $('#nowSongBox').animate({
                height: targetHeight + 'px'
            }, 400);
        }
        nowMusic = !nowMusic;
    } else {
        $('#nowMusic').css('transform', 'rotate(-90deg)');
        $('.nowSongBox').animate({
            height: '0'
        }, 400)
        nowMusic = !nowMusic;
    }
});

//musicVolume 음악 볼륨
$('#soundControlBtn').click(() => {
    if (musicVolume) {
        $('.volumeBox').css('display', 'flex');
        musicVolume = !musicVolume;
    } else {
        $('.volumeBox').css('display', 'none');
        musicVolume = !musicVolume;
    }
});

//reload
$('#mainLogoBtn').click(() => {
    location.reload();
});

$('#mainHomeBtn').click(() => {
    $('#albumListBox').animate({ height: 0 + 'px' }, 400);
    $('#nowSongBox').animate({ height: 0 + 'px' }, 400);
    $('#albumStorageBox').animate({ height: 0 + 'px' }, 400);
});

//albumList 창 올리기
$('.LPImage').click(() => {
    $('#albumListBox').animate({
        height: targetHeight + 'px'
    }, 400)
});

//-albumListBox 창 내리기
$('#backAlbumListBox').click(() => {
    $('#albumListBox').animate({
        height: 0 + 'px'
    }, 400);
});

//-albumStorageBox 창 올리기
$('#storageBtn').click(() => {
    //다른 창이 켜져있다면 닫고 열기
    if ($('#albumListBox').height() != 0 || $('#nowSongBox').height() != 0) {
        $('#albumListBox').animate({ height: 0 + 'px' }, 400);
        $('#nowSongBox').animate({ height: 0 + 'px' }, 400);
        $('#nowMusic').css('transform', 'rotate(-90deg)');
        setTimeout(() => {
            $('#albumStorageBox').animate({ height: targetHeight + 'px' });
        }, 600);
    } else {
        $('#albumStorageBox').animate({
            height: targetHeight + 'px'
        }, 400);
    }
});
//-albumStorageBox back 창 내리기
$('#backStorageBox').click(() => {
    $('#albumStorageBox').animate({
        height: 0 + 'px'
    }, 400);
});

//-albumListBoxAlbumSrc
$('.LPImage').click((e) => {
    switch (e.target.id) {
        case 'LP1':
            $('#albumListBoxNowAlbum').attr('src', './img/Beatles.webp');
            break;
        case 'LP2':
            $('#albumListBoxNowAlbum').attr('src', './img/proof.jpg');
            break;
        case 'LP3':
            $('#albumListBoxNowAlbum').attr('src', './img/Remind Me.jpg');
            break;
        case 'LP4':
            $('#albumListBoxNowAlbum').attr('src', './img/Arctic Monkeys.jpg');
            break;
        default: ;
            break;
    }
});

//random play 랜덤 재생
$('#randomPlayBtn').click(() => {
    if (randomPlayBtn) {
        shuffleArray(tempJsonArray);
        let tempLength = tempShuffleArray.length;
        for (let i = 0; i < tempLength; i++) {
            if (tempShuffleArray[i].num == musicDBNum) {
                musicListIndex = i;
            }
        }
        $('.xi-shuffle').css('color', '#36E36C');
    } else {
        let tempLength = tempJsonArray.length;
        for (let i = 0; i < tempLength; i++) {
            if (tempJsonArray[i].num == musicDBNum) {
                musicListIndex = i;
            }
        }
        $('.xi-shuffle').css('color', 'white');
    }
    randomPlayBtn = !randomPlayBtn;
    console.log($('.randomPlayBtn').css('color'));
});

//음악 종료시
audioPlayer.onended = function () {
    let audioPlayerDuration = parseInt(audioPlayer.duration);
    let audioPlayerCurrentTime = parseInt(audioPlayer.currentTime);
    if (continuousPlaybackBtn) {
        if (randomPlayBtn && tempJsonArray != '') {
            nextMusicPlay(tempJsonArray);
        } else if (randomPlayBtn = 'false' && tempJsonArray != '') {
            nextMusicPlay(tempShuffleArray);
        } else if (tempJsonArray == '') {
            $('#bottomBar').css("display", "none");
            $('#nowMusicBar').css("display", "none");
            if (audioPlayerDuration == audioPlayerCurrentTime) {
                $('#startStopBtn').removeClass('xi-pause');
                $('#startStopBtn').addClass('xi-play');
                startBtn = !startBtn;
            }
        }
        if ($('.randomPlayBtn').css('color') == 'rgb(54, 227, 108)') {
            randomPlayBtn = false;
        } else if ($('.randomPlayBtn').css('color') == 'rgb(255, 255, 255)') {
            randomPlayBtn = true;
        };
    } else {
        audioPlayer.currentTime = 0;
    }
}

//start stop 시작 멈춤 버튼
$('#startStopBtn').click(() => {
    if ($('#audioPlayer').attr('src') == "") {
        startBtn = false;
    };
    musicPlayBtn();
});


soundValue();
bottomBarOpen('.musicListPlayBtn');
bottomBarOpen('.musicListTitleA');
bottomBarOpen('.nowAlbum');
storageListPlay('.albumStoragePlayBtn');
storageListPlay('.musicListTitleClick');
storageListPlay('.nowAlbumClick');