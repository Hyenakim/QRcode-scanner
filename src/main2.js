window.onload = function () {
    /* Ask for "environnement" (rear) camera if available (mobile), will fallback to only available otherwise (desktop).
     * User will be prompted if (s)he allows camera to be started */
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }).then(function (stream) {
        var video = document.getElementById("video-preview");
        video.setAttribute("playsinline", true); /* otherwise iOS safari starts fullscreen */
        video.srcObject = stream;
        video.play();
        var album;
        //setTimeout(tick, 100); /* We launch the tick function 100ms later (see next step) */
    })
    .catch(function (err) {
        console.log(err); /* User probably refused to grant access*/
    });
};
function readURL(intput) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#image_section').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
//$("#ex_file").change(function () {
//        readURL(this);
//    });
function previewFile(input) {
    album = true;
    var img = document.getElementById("#image_section");
    var video = document.getElementById("video-preview");
    var qrCanvasElement = document.getElementById("qr-canvas");
    var qrCanvas = qrCanvasElement.getContext("2d");
    var width, height;
    var image = new Image();
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#image_section').attr('src', e.target.result)
                .width(100).height(100);

            //qrCanvasElement.height = img.height;
            //qrCanvasElement.width = img.width;
            /* Display Canvas and hide video stream */
            video.classList.add("hidden");
            qrCanvasElement.classList.remove("hidden");
            image.src = e.target.result;
            qrCanvas.drawImage(image, 0, 0);
        }
    }
    reader.readAsDataURL(input.files[0]);
    console.log($('#image_section').width());
    try {
        var result = qrcode.decode(image); //qr코드 인식
        console.log(result);
        //알림창
        var check = confirm(result + "로 이동하겠습니까?");
        if (check)
            //window.open(result, '_blank');
            openTab(result);
        // else
        //     ;
    } catch (e) {
        /* No Op */
    }
    //setTimeout(simpleTick, 1000);
    
}
function simpleTick() {
    try {
        var result = qrcode.decode(); //qr코드 인식
        console.log(result);
        //알림창
        var check = confirm(result + "로 이동하겠습니까?");
        if (check)
            //window.open(result, '_blank');
            openTab(result);
        // else
        //     ;
    } catch (e) {
        /* No Op */
    }
}
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
            // else
            //     ;
        } catch (e) {
            /* No Op */
        }
    }
    /* If no QR could be decoded from image copied in canvas */
    if (!video.classList.contains("hidden"))
        setTimeout(tick, 100);
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

