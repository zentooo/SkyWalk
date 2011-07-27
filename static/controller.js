(function() {
    var socket = io.connect();
    var touch = { x1: 0, x2: 0, y1: 0, y2: 0 };

    document.addEventListener("DOMContentLoaded", function() {
        socket.on('connect', function() {
            document.body.addEventListener("touchstart", touchStart, false);
            document.body.addEventListener("touchmove", touchMove, false);
            document.body.addEventListener("touchend", touchEnd, false);
        });
    }, false);

    function touchStart(e) {
        touch.x1 = e.touches[0].pageX;
        touch.y1 = e.touches[0].pageY;
    }

    function touchMove(e) {
        touch.x2 = e.touches[0].pageX;
        touch.y2 = e.touches[0].pageY;
    }

    function touchEnd(e) {
        var dx = touch.x1 - touch.x2;
        var dy = touch.y1 - touch.y2;

        if ( touch.x1 && touch.x2 && Math.abs(dx) > 100 ) {
            if ( dx > 0 ) {
                socket.send( JSON.stringify( { name: "swipeLeft", delta: dx } ) );
            }
            else {
                socket.send( JSON.stringify( { name: "swipeRight", delta: dx } ) );
            }
        }
        else if ( touch.y1 && touch.y2 && Math.abs(dy) > 100 ) {
            if ( dy > 0 ) {
                socket.send( JSON.stringify( { name: "swipeUp", delta: dy } ) );
            }
            else {
                socket.send( JSON.stringify( { name: "swipeDown", delta: dy } ) );
            }
        }
        else {
            socket.send( JSON.stringify( { name: "tap", touch: touch } ) );
        }

        touch.x1 = touch.x2 = touch.y1 = touch.y2 = 0;
    }
})();
