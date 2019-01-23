/*전역변수*/
var lightFlag   //손전등 on/off
var next;       //setTimeout 반환값 (clearTimeout 호출시 사용)

/*창 로드시 실행*/
window.onload = function () {
    lightFlag = false
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
            document.querySelector("#ex_button").style.display = "inline-block";
            document.querySelector("#lightBtn").style.display = "inline-block";
        }
        setTimeout(tick, 100); /* We launch the tick function 100ms later (see next step) */
    })
    .catch(function (err) {
        console.log(err); /* User probably refused to grant access*/
    });
};

/*손전등 버튼 선택시 실행*/
function setLight() {
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

/*os종류 구분*/
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

/*앨범에서 이미지 선택 후 실행*/
// input : ex) 123.png 
function previewFile(input) {
    /*멈추기*/
    clearTimeout(next);

    /*파일 읽기*/
    var file = document.querySelector('#ex_file');
    var fileList = file.files;
    var reader = new FileReader();
    reader.readAsDataURL(fileList[0]);
    /*앨범 이미지 임시저장*/
    var tmpImage = new Image();     
    function getData() {
        return new Promise(function (resolve, reject) {
            reader.onload = function(input){
                tmpImage.src = reader.result;
                resolve(input)
            }
        });
    }
    function getData1(input) {
        return new Promise(function (resolve, reject) {
            tmpImage.onload = function () {
                var qrCanvasElement = document.getElementById("qr-canvas");
                var qrCanvas = qrCanvasElement.getContext("2d");
                qrCanvasElement.width = tmpImage.width;
                qrCanvasElement.height = tmpImage.height;
                qrCanvas.drawImage(tmpImage, 0, 0, tmpImage.width, tmpImage.height);

                try {
                    var result = qrcode.decode();
                    /*qr 주소결과 확인*/
                    console.log(result);
                    var check = confirm(result + "로 이동하겠습니까?");
                    if (check)
                        window.open(result, '_self');
                    else {
                        setTimeout(tick, 100);
                    }
                } catch (e) {
                    alert("인식하지 못하였습니다. 다시 시도해주세요.");
                    setTimeout(tick, 100);
                }
            }
        });          
    }
    getData()
    .then(getData1)
}

/*실시간 qr인식*/
function tick() {
    var video = document.getElementById("video-preview");
    var qrCanvasElement = document.getElementById("qr-canvas");
    var qrCanvas = qrCanvasElement.getContext("2d");
    var width, height;
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        qrCanvasElement.height = video.videoHeight;
        qrCanvasElement.width = video.videoWidth;
        qrCanvas.drawImage(video, 0, 0, qrCanvasElement.width, qrCanvasElement.height);
        try {
              var result = qrcode.decode(); //qr코드 인식
              console.log(result);
            //알림창
            var check = confirm(result + "로 이동하겠습니까?");
            if (check)
                window.open(result, '_self');
        } catch (e) {
            /* No Op */
        }
    } 
    /* If no QR could be decoded from image copied in canvas */
    if (!video.classList.contains("hidden"))
        next = setTimeout(tick, 100);
}

