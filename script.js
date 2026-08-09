window.addEventListener("load", function () {

    const loader = document.getElementById("weddingLoader");

    setTimeout(function () {
        loader.classList.add("loader-open");
    }, 1500);

    setTimeout(function () {
        loader.classList.add("loader-finish");
    }, 4300);

});


    function openInvite() {

        if (opened) return;

        opened = true;

        /* OPEN ENVELOPE */
        envelope.classList.add("open");


        /* Wait for envelope animation */
        setTimeout(function () {

            loader.classList.add("hide");

            document.body.classList.remove("locked");

            if (typeof initReveals === "function") {
                initReveals();
            }

            if (typeof startCountdown === "function") {
                startCountdown();
            }

        }, 3000);

    }


    




/* =========================================================
   INTERACTIVE SCRATCH CARD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("scratchCanvas");
    const card = document.getElementById("scratchCard");

    if (!canvas || !card) return;

    const ctx = canvas.getContext("2d");

    let isScratching = false;
    let scratched = false;

    function setupCanvas() {

        const rect = card.getBoundingClientRect();

        const ratio = window.devicePixelRatio || 1;

        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;

        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";

        ctx.scale(ratio, ratio);

        drawFoil(rect.width, rect.height);
    }


    function drawFoil(width, height) {

        const gradient = ctx.createLinearGradient(
            0,
            0,
            width,
            height
        );

        gradient.addColorStop(0, "#b99a55");
        gradient.addColorStop(0.25, "#f0dda7");
        gradient.addColorStop(0.5, "#c8aa65");
        gradient.addColorStop(0.75, "#f3e4b9");
        gradient.addColorStop(1, "#a9853f");

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* Foil texture */

        for (let i = 0; i < 1800; i++) {

            const x = Math.random() * width;
            const y = Math.random() * height;

            const size = Math.random() * 2;

            ctx.fillStyle =
                Math.random() > 0.5
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(80,60,20,0.08)";

            ctx.fillRect(
                x,
                y,
                size,
                size
            );
        }
    }


    function getPosition(event) {

        const rect =
            canvas.getBoundingClientRect();

        let x;
        let y;

        if (event.touches && event.touches.length) {

            x = event.touches[0].clientX - rect.left;
            y = event.touches[0].clientY - rect.top;

        } else {

            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }

        return {
            x: x,
            y: y
        };
    }


    function scratch(event) {

        if (!isScratching || scratched) return;

        event.preventDefault();

        const position = getPosition(event);

        ctx.globalCompositeOperation =
            "destination-out";

        ctx.beginPath();

        ctx.arc(
            position.x,
            position.y,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();

        checkScratchPercentage();
    }


    function checkScratchPercentage() {

        const width = canvas.width;
        const height = canvas.height;

        const imageData =
            ctx.getImageData(
                0,
                0,
                width,
                height
            );

        let transparentPixels = 0;

        for (
            let i = 3;
            i < imageData.data.length;
            i += 4
        ) {

            if (imageData.data[i] < 100) {
                transparentPixels++;
            }
        }

        const percentage =
            transparentPixels /
            (imageData.data.length / 4) *
            100;


        /* Reveal after 55% scratching */

        if (percentage >= 12) {

            scratched = true;

            card.classList.add("scratched");

            revealDate();
        }
    }


    function revealDate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        createPetals();
        startCountdown();
    }


    function createPetals() {

        for (let i = 0; i < 35; i++) {

            const petal =
                document.createElement("span");

            petal.className =
                "celebration-petal";

            petal.style.left =
                Math.random() * 100 + "%";

            petal.style.animationDelay =
                Math.random() * 2 + "s";

            petal.style.animationDuration =
                3 + Math.random() * 3 + "s";

            document.body.appendChild(petal);

            setTimeout(function () {
                petal.remove();
            }, 6000);
        }
    }


    canvas.addEventListener(
        "mousedown",
        function () {
            isScratching = true;
        }
    );


    canvas.addEventListener(
        "mousemove",
        scratch
    );


    window.addEventListener(
        "mouseup",
        function () {
            isScratching = false;
        }
    );


    canvas.addEventListener(
        "touchstart",
        function (event) {

            isScratching = true;

            scratch(event);
        },
        { passive: false }
    );


    canvas.addEventListener(
        "touchmove",
        scratch,
        { passive: false }
    );


    window.addEventListener(
        "touchend",
        function () {
            isScratching = false;
        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (!scratched) {
                setupCanvas();
            }

        }
    );


    setupCanvas();

});




function revealCard() {

    if (revealed) {
        return;
    }

    revealed = true;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    card.classList.add("scratched");

    createPetals();
    startCountdown();
}


/* =========================================================
   COUNTDOWN
========================================================= */

function startCountdown() {

    const countdownSection =
        document.querySelector(".countdown-section");

    const countdownNumbers =
        document.querySelectorAll(".countdown-number");


    countdownSection.classList.add(
        "countdown-visible"
    );


    const weddingDate =
        new Date("December 20, 2026 00:00:00").getTime();


    function updateCountdown() {

        const now =
            new Date().getTime();

        const difference =
            weddingDate - now;


        if (difference <= 0) {

            countdownNumbers[0].textContent = "00";
            countdownNumbers[1].textContent = "00";
            countdownNumbers[2].textContent = "00";
            countdownNumbers[3].textContent = "00";

            return;
        }


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (difference %
                (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );


        const minutes =
            Math.floor(
                (difference %
                (1000 * 60 * 60)) /
                (1000 * 60)
            );


        const seconds =
            Math.floor(
                (difference %
                (1000 * 60)) /
                1000
            );


        countdownNumbers[0].textContent =
            String(days).padStart(2, "0");

        countdownNumbers[1].textContent =
            String(hours).padStart(2, "0");

        countdownNumbers[2].textContent =
            String(minutes).padStart(2, "0");

        countdownNumbers[3].textContent =
            String(seconds).padStart(2, "0");
    }


    updateCountdown();

    setInterval(
        updateCountdown,
        1000
    );
}


/* =========================================================
   WHATSAPP WISHES
========================================================= */

const whatsappForm =
    document.getElementById("whatsappForm");

if (whatsappForm) {

    whatsappForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById("guestName").value.trim();

            const message =
                document.getElementById("guestMessage").value.trim();


            if (!name || !message) {
                return;
            }


            const phoneNumber =
                "919328361164";


            const whatsappMessage =
                `Wedding Wishes 💚

Name: ${name}

Message:
${message}`;


            const whatsappURL =
                "https://wa.me/" +
                phoneNumber +
                "?text=" +
                encodeURIComponent(whatsappMessage);


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}
