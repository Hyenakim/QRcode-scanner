var video;
window.onload = function () {
    /* Ask for "environnement" (rear) camera if available (mobile), will fallback to only available otherwise (desktop).
     * User will be prompted if (s)he allows camera to be started */
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }).then(function (stream) {
        video = document.getElementById("video-preview");
        video.setAttribute("playsinline", true); /* otherwise iOS safari starts fullscreen */
        video.srcObject = stream;
        video.play();
        const track = stream.getVideoTracks()[0];
        var os = getMobileOperatingSystem()
        var lightFlag = true
        if (os === "iOS" || os === "unknown") {
        } else {
            document.querySelector("#lightBtn").style.display = "inline-block";
        }
        onCapabilitiesReady(track.getCapabilities())
        // track.applyConstraints({
        //     advanced:[{torch:true}]
        // })
        function setLight() {
            console.log("손전등 onClick");
            clearTimeout(next); //tick 멈추기
            var light = document.querySelector("#lightBtn")
                
                    if (lightFlag === true) {
                        lightFlag = false
                        track.applyConstraints({
                            advanced: [{ torch: false }]
                        })
                        light.value = "손전등 켜기"
                    } else {
                        lightFlag = true
                        track.applyConstraints({
                            advanced: [{ torch: true }]
                        })
                        light.value = "손전등 끄기"
                    }
                    setTimeout(tick, 100);
        }
        
        setTimeout(tick, 100); /* We launch the tick function 100ms later (see next step) */
        //console.log("windlow onload");
        

    })
    .catch(function (err) {
        console.log(err); /* User probably refused to grant access*/
    });
};

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
function onCapabilitiesReady(capabilities) {
    console.log("capabilities!!")
    console.log(capabilities);
    if (capabilities.torch) {
        document.querySelector("#lightBtn").style.display = "inline-block";
        track.applyConstraints({
            advanced: [{ torch: true }]
        })
        .catch(e => console.log(e));
    }
    else {
        console.log("no torch")
    }
}

var next;
var image = new Image();
function setAlbum() {
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
    var reader = new FileReader();
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
    try{
        var result = qrcode.decode();
        /*qr 주소결과 확인*/
        console.log(result);
        var check = confirm(result + "로 이동하겠습니까?");
        if (check)
            window.open(result, '_self');
        else {
            window.location.reload();
            //document.getElementById('#image_section').style.display = "none";
        }
    }catch(e){
        alert("인식되지 않았습니다. 다시 시도해주세요.");
        window.location.reload();
    }
};
function tick() {
    //console.log("tick");
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
        } catch (e) {
            /* No Op */
        }
    } 
    /* If no QR could be decoded from image copied in canvas */
    if (!video.classList.contains("hidden"))
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

