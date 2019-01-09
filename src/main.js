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
            var result = qrcode.decode();
            console.log(result);
            /* Video can now be stopped */
            //video.pause();
            //video.src = "";
            //video.srcObject.getVideoTracks().forEach(track => track.stop());

            /* Display Canvas and hide video stream */
            //qrCanvasElement.classList.remove("hidden");
            //video.classList.add("hidden");

            document.getElementsByTagName("p")[1].innerHTML = "이동";
            var url = document.getElementsByTagName('p')[2];
            //p 내용 지우기
            while (url.firstChild) {
                url.removeChild(url.firstChild);
            }
            console.log(url);
            var link = document.createElement('a');
            link.href = result;
            var text = document.createTextNode(result);
            url.appendChild(link).appendChild(text);
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

    /* If no QR could be decoded from image copied in canvas */
    if (!video.classList.contains("hidden"))
        setTimeout(tick, 100);
}

function openTab(url) {
    // Create link in memory
    var a = window.document.createElement("a");
    a.target = '_blank';
    a.href = url;

    // Dispatch fake click
    var e = window.document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
};
