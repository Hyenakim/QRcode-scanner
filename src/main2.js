﻿/*전역변수*/
var lightFlag   //손전등 on/off
var stop;       //setTimeout 반환값 (clearTimeout 호출시 사용)

/*창 로드시 실행*/
window.onload = function () {
    /* Ask for "environnement" (rear) camera if available (mobile), will fallback to only available otherwise (desktop).
     * User will be prompted if (s)he allows camera to be started */
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }).then(function (stream) {
        var video = document.getElementById("video-preview");
        video.setAttribute("playsinline", true); /* otherwise iOS safari starts fullscreen */
        video.srcObject = stream;
        video.play();
        const track = stream.getVideoTracks()[0];
        var os = getMobileOperatingSystem()
        /*os 구별 및 손전등 사용 가능여부 판단*/
        if (os === "iOS" || os === "unknown") {
        } else {
            document.querySelector("#lightBtn").style.display = "inline-block";
        }
        setTimeout(findQR, 100); /* We launch the tick function 100ms later (see next step) */
    })
    .catch(function (err) {
        console.log(err); /* User probably refused to grant access*/
    });
};

/*손전등 버튼 선택시 실행*/
function setLight() {
    var os = getMobileOperatingSystem()
    /*Android, Windows Phone에서만 실행*/
    if (os === "Android" || os === "Windows Phone") {
        var video = document.getElementById("video-preview");
        const track = video.srcObject.getVideoTracks()[0];
        var flash = document.querySelector("#flash");
        var flashoff = document.querySelector("#flashoff");

        if (lightFlag === true) {
            lightFlag = false
            track.applyConstraints({
                advanced: [{ torch: false }]
            })
            flashoff.style.display = "none";
            flash.style.display = "inline-block";
        } else {
            lightFlag = true
            track.applyConstraints({
                advanced: [{ torch: true }]
            })
            flashoff.style.display = "inline-block";
            flash.style.display = "none";
        }
    }
}

/*앨범에서 이미지 선택 후 실행*/
// input : 호출한 input태그 전체
function previewFile(input) {
    /*멈추기*/
    clearTimeout(stop);

    /*파일 읽기*/
    var file = document.querySelector('#album_file');
    var fileList = file.files;
    var reader = new FileReader();
    reader.readAsDataURL(fileList[0]);

    /*앨범 이미지 임시저장*/
    var tmpImage = new Image();
    reader.onload = function (input) {
        tmpImage.src = reader.result;
    }

    /*이미지 임시저장 후 qrcode판단*/
    tmpImage.onload = function () {
        var qrCanvasElement = document.getElementById("qr-canvas");
        var qrCanvas = qrCanvasElement.getContext("2d");
        qrCanvasElement.width = tmpImage.width;
        qrCanvasElement.height = tmpImage.height;
        qrCanvas.drawImage(tmpImage, 0, 0, tmpImage.width, tmpImage.height);

        try {
            var result = qrcode.decode();
            var check = confirm(result + "로 이동하겠습니까?");
            if (check)
                window.open(result, '_self');
            else {
                setTimeout(findQR, 100);
            }
        } catch (e) {
            /* 인식 못한 경우 */
            alert("인식하지 못하였습니다. 다시 시도해주세요.");
            setTimeout(findQR, 100);
        }
    }
}

/*실시간 qrcode판단*/
function findQR() {
    var video = document.getElementById("video-preview");
    var qrCanvasElement = document.getElementById("qr-canvas");
    var qrCanvas = qrCanvasElement.getContext("2d");
    var width, height;
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        qrCanvasElement.height = video.videoHeight;
        qrCanvasElement.width = video.videoWidth;
        qrCanvas.drawImage(video, 0, 0, qrCanvasElement.width, qrCanvasElement.height);
        try {
            var result = qrcode.decode();
            var check = confirm(result + "로 이동하겠습니까?");
            if (check)
                window.open(result, '_self');
        } catch (e) {
            /* 인식 못한 경우 */
        }
    } 
    /* If no QR could be decoded from image copied in canvas */
    if (!video.classList.contains("hidden"))
        stop = setTimeout(findQR, 100);
}

