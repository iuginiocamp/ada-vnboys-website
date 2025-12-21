var metas = document.getElementsByTagName('meta');
var i;
if (navigator.userAgent.match(/iPhone/i)) {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
    }
  }
  document.addEventListener("gesturestart", gestureStart, false);
}
function gestureStart() {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
    }
  }
}


var currentIndex = 1;
displaySlides(currentIndex);

function displaySlides(num) {
    var x;
    var slides = document.getElementsByClassName("imageSlides");
    if (num > slides.length) { currentIndex = 1 }
    if (num < 1) { currentIndex = slides.length }
    for (x = 0; x < slides.length; x++) {
        slides[x].style.display = "none";
    }
    slides[currentIndex - 1].style.display = "block";
}

function setSlides(num) {
    displaySlides(currentIndex += num);
}
//===========================================================================
var currentIndexgr1 = 1;
displaySlidesgr1(currentIndexgr1);

function displaySlidesgr1(num) {
    var x;
    var slidesgr1 = document.getElementsByClassName("imageSlides-gr1");
    if (num > slidesgr1.length) { currentIndexgr1 = 1 }
    if (num < 1) { currentIndexgr1 = slidesgr1.length }
    for (x = 0; x < slidesgr1.length; x++) {
        slidesgr1[x].style.display = "none";
    }
    slidesgr1[currentIndexgr1 - 1].style.display = "block";
}

function setSlidesgr1(num) {
    displaySlidesgr1(currentIndexgr1 += num);
}

//===========================================================================

var currentIndexgr2 = 1;
displaySlidesgr2(currentIndexgr2);

function displaySlidesgr2(num) {
    var x;
    var slidesgr2 = document.getElementsByClassName("imageSlides-gr2");
    if (num > slidesgr2.length) { currentIndexgr2 = 1 }
    if (num < 1) { currentIndexgr2 = slidesgr2.length }
    for (x = 0; x < slidesgr2.length; x++) {
        slidesgr2[x].style.display = "none";
    }
    slidesgr2[currentIndexgr2 - 1].style.display = "block";
}

function setSlidesgr2(num) {
    displaySlidesgr2(currentIndexgr2 += num);
}

//===========================================================================


//===========================================================================

var currentIndexgr3 = 1;
displaySlidesgr3(currentIndexgr3);

function displaySlidesgr3(num) {
    var x;
    var slidesgr3 = document.getElementsByClassName("imageSlides-gr3");
    if (num > slidesgr3.length) { currentIndexgr3 = 1 }
    if (num < 1) { currentIndexgr3 = slidesgr3.length }
    for (x = 0; x < slidesgr3.length; x++) {
        slidesgr3[x].style.display = "none";
    }
    slidesgr3[currentIndexgr3 - 1].style.display = "block";
}

function setSlidesgr3(num) {
    displaySlidesgr3(currentIndexgr3 += num);
}

//===========================================================================

//===========================================================================

var currentIndexpv1 = 1;
displaySlidespv1(currentIndexpv1);

function displaySlidespv1(num) {
    var x;
    var slidespv1 = document.getElementsByClassName("imageSlides-pv1");
    if (num > slidespv1.length) { currentIndexpv1 = 1 }
    if (num < 1) { currentIndexpv1 = slidespv1.length }
    for (x = 0; x < slidespv1.length; x++) {
        slidespv1[x].style.display = "none";
    }
    slidespv1[currentIndexpv1 - 1].style.display = "block";
}

function setSlidespv1(num) {
    displaySlidespv1(currentIndexpv1 += num);
}

//===========================================================================


var currentIndexpv2 = 1;
displaySlidespv2(currentIndexpv2);

function displaySlidespv2(num) {
    var x;
    var slidespv2 = document.getElementsByClassName("imageSlides-pv2");
    if (num > slidespv2.length) { currentIndexpv2 = 1 }
    if (num < 1) { currentIndexpv2 = slidespv2.length }
    for (x = 0; x < slidespv2.length; x++) {
        slidespv2[x].style.display = "none";
    }
    slidespv2[currentIndexpv2 - 1].style.display = "block";
}

function setSlidespv2(num) {
    displaySlidespv2(currentIndexpv2 += num);
}

//===========================================================================


//===========================================================================

var currentIndexpv3 = 1;
displaySlidespv3(currentIndexpv3);

function displaySlidespv3(num) {
    var x;
    var slidespv3 = document.getElementsByClassName("imageSlides-pv3");
    if (num > slidespv3.length) { currentIndexpv3 = 1 }
    if (num < 1) { currentIndexpv3 = slidespv3.length }
    for (x = 0; x < slidespv3.length; x++) {
        slidespv3[x].style.display = "none";
    }
    slidespv3[currentIndexpv3 - 1].style.display = "block";
}

function setSlidespv3(num) {
    displaySlidespv3(currentIndexpv3 += num);
}

//===========================================================================


