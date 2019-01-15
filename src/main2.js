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
function setAlbum() {
    album = true;
    clearTimeout(next);
}
function previewFile(input) {
    album = true;

    var img = document.getElementById("#image_section");
    var video = document.getElementById("video-preview");
    var qrCanvasElement = document.getElementById("qr-canvas");
    var qrCanvas = qrCanvasElement.getContext("2d");
    var width, height;

    //video.pause();
    //video.src = "";
    //video.srcObject.getVideoTracks().forEach(track => track.stop());
    //reader.readAsDataURL(input.files[0]);
    //var image = new Image();
    //if (input.files && input.files[0]) {
    //읽기
    var file = document.querySelector('#ex_file');
    var fileList = file.files;
        var reader = new FileReader();
        reader.readAsDataURL(fileList[0]);

        //로드한 후
        //reader.onload = function () {

            //$('#image_section').attr('src', e.target.result)
            //    .width(100).height(100);
            document.querySelector('#image_section').src = reader.result;
            //clearTimeout(tick);
            
            //qrCanvasElement.height = $('#image_section').height;
            //qrCanvasElement.width = $('#image_section').width;
            /* Display Canvas and hide video stream */
            //video.classList.add("hidden");
            //qrCanvasElement.classList.remove("hidden");
            //image.src = document.querySelector('#image_section').src;
            //qrCanvas.drawImage(image, 0, 0, 640, 480);
           
            //qrCanvasElement.style.display = "true";

            
            //setTimeout(simpleTick(), 1000);
            
            setTimeout(tick, 1000);
        //}
    //}
    //reader.readAsDataURL(input.files[0]);
    console.log($('#image_section').width());
}
function simpleTick() {
    var canvas_qr = document.getElementById("qr-canvas");
    var imgData = canvas_qr.toDataURL("image/png");
    
    console.log(imgData);
    var result = qrcode.decode();
    console.log(result);
    var check = confirm(result + "로 이동하겠습니까?");
    if (check)
        window.open(result, '_self');
    //if (qrcode.isUrl(imgData)) {
    //    window.location.href = imgData;
    //}
}
function tick() {
    var video = document.getElementById("video-preview");
    var qrCanvasElement = document.getElementById("qr-canvas");
    var qrCanvas = qrCanvasElement.getContext("2d");
    var image = new Image();
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
            // else
            //     ;
        } catch (e) {
            /* No Op */
        }
    } else if (album) {
        
        image.src = document.querySelector('#image_section').src;
        qrCanvas.drawImage(image, 0, 0, 640, 480);

        var canvas_qr = document.getElementById("qr-canvas");
        var imgData = canvas_qr.toDataURL("image/png");

        console.log(imgData);
        var result = qrcode.decode();
        console.log(result);
        var check = confirm(result + "로 이동하겠습니까?");
        if (check)
            window.open(result, '_self');
    }
    /* If no QR could be decoded from image copied in canvas */
    if (!video.classList.contains("hidden") && !album)
        next = setTimeout(tick, 4000);
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

