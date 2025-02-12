//오디오 링크 넣기
function musicPlayAndAdd(value) {
    $(document).on("click", value, function () {
        let musicPlayTitle = $(this).closest('.musicListBox').find('.musicListTitleA').text();
        let promise = new Promise((resolve, reject) => {
            $.ajax({
                url: "/musicPlay",
                type: "POST",
                dataType: "JSON",
                data: { "musicPlayTitle": musicPlayTitle },
                success: function (json) {
                    resolve(json);
                },
                error: function (xhr, status, error) {
                    reject(error);
                }
            });
        });
        promise.then((json) => {
            let jsonLength = json.length - 1;
            $('#audioPlayer').attr("src", `${json[jsonLength].songLink}`);
            if (startBtn) {
                $('#startStopBtn').removeClass('xi-play')
                $('#startStopBtn').addClass('xi-pause');
                playAudio(jsonLength);
                startBtn = !startBtn;
            }
            playAudio(jsonLength);
            startBtn = false;
            bottomBarView(json[jsonLength].albumLink, json[jsonLength].songName, json[jsonLength].artist);
            nowView(json[jsonLength].albumLink, json[jsonLength].songName, json[jsonLength].artist);
            addList(json);

        })
            .catch((error) => {
                console.log("Ajax failed", error);
            });
    });
}

//페이지 로드시 보관함에 뿌리기
$('#storageBtn').click(() => {
    let promise = new Promise((resolve, reject) => {
        $.ajax({
            url: "/storage",
            type: "post",
            dataType: "JSON",
            success: function (json) {
                resolve(json);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
    promise.then((json) => {
        addList(json);
    })
        .catch((error) => {
            console.log('Ajax failed:', error);
        });
});


//해당 LP클릭하면 DB에 정보 가져오기
$('.LPImage').click((e) => {
    let getLPId = e.target.id;
    let promise = new Promise((resolve, reject) => {
        $.ajax({
            url: "/list",
            type: "POST",
            dataType: "JSON",
            data: { "getLPId": getLPId },
            success: function (json) {
                resolve(json);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
    promise.then((json) => {
        let musicList = "";
        for (let i = 0; i < json.length; i++) {
            musicList += "<div class='musicListBox'>";
            musicList += "<div class='musicListAlbum'>";
            musicList += `<img class='nowAlbum' src="${json[i].albumLink}" alt='album'>`;
            musicList += "</div>";
            musicList += "<div class='musicListTitle'>";
            musicList += `<p class='musicListTitleA'>${json[i].songName}</p>`;
            musicList += `<p class='musicListTitleB'>${json[i].artist}</p>`;
            musicList += "</div>";
            musicList += "<div class='musicListPlayBtn xi-play'></div>";
            musicList += "<div class='musicListAddBtn xi-plus-min'></div>";
            musicList += "</div>";
        }
        $('#albumListBoxList').html(musicList);
    })
        .catch(function (error) {
            console.log('Ajax failed:', error);
        });
});

//해당 곡 클릭시 동영상 링크 가져오기
$(document).on("click", ".musicListBox", function (event) {
    let musicListTitleA = $(this).find(".musicListTitleA").text();
    if (musicListTitleA) {
        let promise = new Promise((resolve, reject) => {
            $.ajax({
                url: "/movie",
                type: "POST",
                dataType: "JSON",
                data: { "musicListTitleA": musicListTitleA },
                success: function (json) {
                    resolve(json);
                },
                error: function (error) {
                    reject(error);
                }
            })
        });
        promise.then((json) => {
            let movieLink = json[0].movieLink
            $('.albumListBoxMovies').html(`<iframe id="youtubePlayer" width="560" height="315" src='${movieLink}' title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`)
        })
            .catch((error) => {
                console.log('Ajax failed', error);
            });
    }
});

//보관함에 추가하기
function addList(json) {
    tempJsonArray = json
    let musicListContent = '';
    for (let i = 0; i < tempJsonArray.length; i++) {
        musicListContent += `<div class="albumStorageBox" data-value='${tempJsonArray[i].num}'>`;
        musicListContent += `<div class="storageAlbum">`;
        musicListContent += `<img class="nowAlbumClick" src="${tempJsonArray[i].albumLink}" alt="nowAlbum">`;
        musicListContent += `</div>`;
        musicListContent += `<div class="albumStorageTitle">`;
        musicListContent += `<p class="musicListTitleClick">${tempJsonArray[i].songName}</p>`;
        musicListContent += `<p class="musicListTitleB">${tempJsonArray[i].artist}</p>`;
        musicListContent += `</div>`;
        musicListContent += `<div class="albumStoragePlayBtn xi-play"></div>`;
        musicListContent += `<div class="deleteListContent xi-trash-o"></div>`;
        musicListContent += `</div>`;
    }
    $('.albumStorageBoxList').html(musicListContent);
}

//목록에 항목 지우기
$(document).on('click', '.deleteListContent', function () {
    let listIndex = $(this).closest('.albumStorageBox').attr('data-value');
    $(this).closest('.albumStorageBox').remove();
    let promise = new Promise((resolve, reject) => {
        $.ajax({
            url: "/deleteListContent",
            type: "POST",
            dataType: "JSON",
            data: { "listIndex": listIndex },
            success: function (json) {
                resolve(json);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
    promise.then((json) => {
        tempJsonArray = json;
    })
        .catch((error) => {
            console.log("Ajax failed", error);
        });
});

//보관함 추가하기버튼
$(document).on('click', '.musicListAddBtn', function () {
    $('.storageAddBox').css('display', 'flex');
    $('.storageAddBox').animate({
        top: '48%',
        opacity: '1'
    }, 200)
    let musicPlayTitle = $(this).closest('.musicListBox').find('.musicListTitleA').text();
    let promise = new Promise((resolve, reject) => {
        $.ajax({
            url: "/musicPlay",
            type: "POST",
            dataType: "JSON",
            data: { "musicPlayTitle": musicPlayTitle },
            success: function (json) {
                resolve(json);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
    promise.then((json) => {
        addList(json)
    })
        .catch((error) => {
            console.log("Ajax failed", error);
        });
});

$('#storageAddBoxYes').click(() => {
    $('.storageAddBox').css('display', 'none');
    $('.storageAddBox').animate({
        top: '50%',
        opacity: '0',
    }, 200)
});

//보과함 목록 전체삭제
let tempA = [];
$(document).on('click', '#deletList', function (e) {
    $('.confirmBox').css('display', 'flex');
    $('.confirmBox').animate({
        top: '48%',
        opacity: '1'
    }, 200)
});

$('#confirmBoxYes').click(() => {
    let promise = new Promise((resolve, reject) => {
        $.ajax({
            url: "/delete",
            type: "POST",
            dataType: "JSON",
            data: {},
            success: function (json) {
                resolve(json);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
    promise.then((json) => { })
        .catch((error) => {
            console.log("Ajax failed", error);
        });

    $('.deleteListContent').parent().remove();
    $('#bottomBar').css("display", "none");
    $('#nowMusicBar').css("display", "none");
    pauseAudio();
    tempJsonArray = [];
    $('.confirmBox').css('display', 'none');
    $('.confirmBox').animate({
        top: '50%',
        opacity: '0',
    }, 200)
});

$('#confirmBoxNo').click(() => {
    $('.confirmBox').css('display', 'none');
    $('.confirmBox').animate({
        top: '50%',
        opacity: '0',
    }, 200)
});


musicPlayAndAdd('.musicListPlayBtn');
musicPlayAndAdd('.musicListTitleA');
musicPlayAndAdd('.nowAlbum');
