DURATION_TIME = 1500

window.onload = anime.timeline({loop: false})
    .add({
        targets: '.ml5 .line',
        opacity: [0.5, 1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        // duration: 700
        duration: DURATION_TIME
    }).add({
        targets: '.ml5 .line',
        // duration: 600,
        duration: DURATION_TIME,
        easing: "easeOutExpo",
        translateY: (el, i) => (-0.625 + 0.625 * 2 * i) + "em"
    }).add({
        targets: '.ml5 .ampersand',
        opacity: [0, 1],
        scaleY: [0.5, 1],
        easing: "easeOutExpo",
        // duration: 600,
        duration: DURATION_TIME,
        offset: '-=600'
    }).add({
        targets: '.ml5 .letters-left',
        opacity: [0, 1],
        translateX: ["0.5em", 0],
        easing: "easeOutExpo",
        // duration: 600,
        duration: DURATION_TIME,
        offset: '-=300'
    }).add({
        targets: '.ml5 .letters-right',
        opacity: [0, 1],
        translateX: ["-0.5em", 0],
        easing: "easeOutExpo",
        // duration: 600,
        duration: DURATION_TIME,
        offset: '-=600'
    });
// }).add({
//     targets: '.ml5',
//     opacity: 0,
//     duration: 1000,
//     easing: "easeOutExpo",
//     delay: 1000
// });

// Wrap every letter in a span
let textWrapper = document.querySelector('.ml2');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

window.onload = anime.timeline({loop: false})
    .add({
        targets: '.ml2 .letter',
        scale: [4, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: "easeOutExpo",
        // duration: 950,
        duration: DURATION_TIME,
        delay: (el, i) => 70 * i,
        offset: DURATION_TIME * 3 + 50
    });
// .add({
//         targets: '.ml2',
//         opacity: 0,
//         duration: 1000,
//         easing: "easeOutExpo",
//         delay: 1000
//     });