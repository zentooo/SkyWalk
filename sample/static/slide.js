document.addEventListener("DOMContentLoaded", function() {

  // Copyright os0x - http://jsdo.it/os0x
  // Licensed under MIT License - http://www.opensource.org/licenses/mit-license.php

  var width = document.documentElement.clientWidth;
  var page = document.getElementById("page");

  var slides = [], current = 0;

  var SV = 'slide view', SR = 'slide right', SL = 'slide left';

  var J = 74, K = 75, N = 78, P = 80, Left = 37, Right = 39, CR = 13, BS = 8;

  var Down = -1, Up = 1;

  var touch = {};
  var rightClick = false;


  document.body.className = 'slidemode';
  document.body.style.fontSize = width / 5 + '%';

  showTime();
  initSlides();

  document.addEventListener("keydown", handleKeyEvent, false);

  initClick();
  initMouseWheel();

  if ( navigator.userAgent.search(/iPhone|Android/) !== -1 ) {
    initTouchEvent();
  }

  // for remote control
  document.addEventListener("swipeRight", prev, false);
  document.addEventListener("swipeLeft", next, false);
  document.addEventListener("tap", showNext, false);

  function showTime() {
    var time = document.getElementById("time"), start = Date.now();

    setInterval(function() {
      var now = Date.now(), h, m, s, diff;

      diff = (now + 100 - start) / 1000 | 0;
      h = String(diff / 3600 | 0);
      m = String(diff / 60 % 60 | 0);
      s = String(diff % 60);

      m = m.length === 1 ? "0" + m : m;
      s = s.length === 1 ? "0" + s : s;

      time.innerHTML = (h === "0") ? m + ":" + s : h + ":" + m + ":" + s;
    }, 1000);
  }

  function initClick() {
    document.addEventListener("click", function(e) {
      if ( ! rightClick ) {
        showNext();
      }
    }, false);
    document.addEventListener("contextmenu", function(e) {
      // Firefox emits both "click" and "contextmenu" event on mouse right button click
      // Since this kind of lock depends on timing of event bubbling, no good for product codes.

      rightClick = true;
      hidePrev();
      e.preventDefault();

      setTimeout(function() {
        rightClick = false;
      }, 300);
    }, false);
  }

  function initSlides() {
    var sections = Array.prototype.slice.call(document.getElementsByTagName('section'));

    sections.forEach(function(section) {
      section.className = SR;
      section.hi = 0;
      slides.push(section);
    });

    setTimeout(function(){
      var m = location.hash.match(/^#(\d+)$/);
      if ( m ) {
        current = +m[1];
        for (var i = 0;i < current && slides[i];i++){
          slides[i].className = SL;
        }
        slides[current].className = SV;
      } else {
        slides[0].className = SV;
      }
      page.innerHTML = current + 1;
    }, 500);
  }

  function handleKeyEvent(evt){
    var cur = slides[current],
        hidden,
        hiddens = cur.querySelectorAll(".h");

    if ( evt.keyCode === K || evt.keyCode === Left || evt.keyCode === BS ) {
      prev();
    }
    else if ( evt.keyCode === J || evt.keyCode === Right || evt.keyCode === CR ) {
      next();
    }
    else if ( evt.keyCode === N ) {
      showNext();
    }
    else if ( evt.keyCode === P ) {
      hidePrev();
    }
  }

  function showNext() {
    var cur = slides[current],
        hiddens = cur.querySelectorAll(".h"),
        hidden = hiddens[cur.hi];

    if ( cur.compareDocumentPosition(hidden) & Node.DOCUMENT_POSITION_CONTAINED_BY ) {
      hidden.style.visibility = "visible";
      cur.hi < hiddens.length && cur.hi++;
    }
  }

  function hidePrev() {
    var cur = slides[current],
        hiddens = cur.querySelectorAll(".h"),
        hidden = hiddens[cur.hi - 1];

    if ( cur.compareDocumentPosition(hidden) & Node.DOCUMENT_POSITION_CONTAINED_BY ) {
      hidden.style.visibility = "hidden";
      cur.hi && cur.hi--;
    }
  }

  function initMouseWheel() {
    if ( document.body.onmousewheel !== void(0) || window.opera ){
      document.body.addEventListener("mousewheel", mousewheel, false);
    } else {
      document.body.addEventListener('DOMMouseScroll',mousewheel,false);
    }
  }

  function initTouchEvent() {
    document.addEventListener("touchstart", function(e) {
      touch.x1 = e.touches[0].pageX;
    }, false);

    document.addEventListener("touchmove", function(e) {
      touch.x2 = e.touches[0].pageX;
    }, false);

    document.addEventListener("touchend", function(e) {
      var delta = touch.x1 - touch.x2;

      if ( touch.x2 > 0 && Math.abs(delta) > 30 ) {
        if ( delta > 0 ) {
          // swipeLeft
          next();
        }
        else {
          // swipeRight
          prev();
        }
        touch.x1 = touch.x2 = 0;
      }
      else {
        // tap
        showNext();
        touch = {};
      }
    }, false);
  }

  function mousewheel(e){
    var dir = e.wheelDelta || -e.detail;
    dir = dir < 0 ? Down : Up;
    if ( dir === Down ) {
      next();
    } else if ( dir === Up ) {
      prev();
    }
  }

  function next(){
    if ( slides[current + 1] ) {
      slides[current++].className = SL;
      slides[current].className = SV;
      location.hash = current;
      page.innerHTML = current + 1;
    }
  }

  function prev(){
    if ( slides[current - 1] ) {
      slides[current--].className = SR;
      slides[current].className = SV;
      location.hash = current;
      page.innerHTML = current + 1;
    }
  }

}, false);
