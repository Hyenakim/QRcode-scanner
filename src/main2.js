window.onload = function () {
    /* Ask for "environnement" (rear) camera if available (mobile), will fallback to only available otherwise (desktop).
     * User will be prompted if (s)he allows camera to be started */
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }).then(function (stream) {
        var video = document.getElementById("video-preview");
        video.setAttribute("playsinline", true); /* otherwise iOS safari starts fullscreen */
        video.srcObject = stream;
        video.play();
        setTimeout(tick, 100); /* We launch the tick function 100ms later (see next step) */
    })
    .catch(function (err) {
        console.log(err); /* User probably refused to grant access*/
    });
};
var album;
var next;
var reader;
var image = new Image();
function setAlbum() {
    album = true;
    clearTimeout(next); //tick 멈추기
}
function previewFile(input) {
    var img = document.getElementById("#image_section");
    var video = document.getElementById("video-preview");
    var qrCanvasElement = document.getElementById("qr-canvas");
    var qrCanvas = qrCanvasElement.getContext("2d");
    var width, height;

    /*파일 읽기*/
    var file = document.querySelector('#ex_file');
    var fileList = file.files;
    reader = new FileReader();
    reader.readAsDataURL(fileList[0]);
       
    setTimeout(function () {
        document.querySelector('#image_section').src = reader.result;
        image.src = reader.result;
    }, 1000);
        
    //console.log($('#image_section').width());
}
image.onload = function () { 
    /*캔버스에 이미지 띄우기*/ 
    var qrCanvasElement = document.getElementById("qr-canvas");
    var qrCanvas = qrCanvasElement.getContext("2d");
    qrCanvasElement.width = image.width;
    qrCanvasElement.height = image.height;
    qrCanvas.drawImage(image, 0, 0, image.width, image.height);

    /*이미지 확인*/
    var canvas_qr = document.getElementById("qr-canvas");
    var imgData = canvas_qr.toDataURL("image/png");
    console.log(imgData);

    var result = qrcode.decode();
    /*qr 주소결과 확인*/
    console.log(result);
    var check = confirm(result + "로 이동하겠습니까?");
    if (check)
        window.open(result, '_self');
    else {
        document.getElementById('#image_section').style.display = "none";
    }
    album = false;
    setTimeout(tick, 100);
};
function tick() {
    
    var video = document.getElementById("video-preview");
    var qrCanvasElement = document.getElementById("qr-canvas");
    var qrCanvas = qrCanvasElement.getContext("2d");
    
    var width, height;
    
    if (video.readyState === video.HAVE_ENOUGH_DATA && !album) {
        qrCanvasElement.height = video.videoHeight;
        qrCanvasElement.width = video.videoWidth;
        qrCanvas.drawImage(video, 0, 0, qrCanvasElement.width, qrCanvasElement.height);
        try {
              var result = qrcode.decode(); //qr코드 인식
              console.log(result);
            /* Video can now be stopped */
            //video.pause();
            //video.src = "";
            //video.srcObject.getVideoTracks().forEach(track => track.stop());

            /* Display Canvas and hide video stream */
            //qrCanvasElement.classList.remove("hidden");
            //video.classList.add("hidden");

            //알림창
            var check = confirm(result + "로 이동하겠습니까?");
            if (check)
                window.open(result, '_self');
                //window.open(result, '_blank');
                //openTab(result);
        } catch (e) {
            /* No Op */
        }
    } 
    /* If no QR could be decoded from image copied in canvas */
    if (!video.classList.contains("hidden") && !album)
        next = setTimeout(tick, 100);
}

function openTab(url) { //새로운 탭 열기
    // Create link in memory
    var a = window.document.createElement("a");
    a.target = '_blank';
    a.href = url;

    // Dispatch fake click
    var e = window.document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
};

