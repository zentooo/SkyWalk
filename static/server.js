document.addEventListener("DOMContentLoaded", function() {
  var socket = io.connect();

  socket.on('connect', function() {
      socket.on("message", function(data) {
          trigger(data.name, data);
      });
  });

  function trigger(event, data) {
      var e = document.createEvent("Event");
      e.initEvent(event, true, true);
      document.dispatchEvent(e);
  }
}, false);
