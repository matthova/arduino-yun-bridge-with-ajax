$(document).ready(function(){

  var prehex = 0;

  function updateLEDs(){
    ping("http://192.168.0.12/arduino/" + prehex);
  }

  function ping(url) {
    var img = new Image();
    img.src = url;
    // $.ajax(){
    //   url:url;
    // }
  }

  var pointer = document.getElementById("pointer");
  var color_result = document.getElementById("color_result");
  var clicked = new Boolean(false);

  drawWheel();
  handleWheel();

  var current_character = 0;
  var hex;

  function drawWheel() {
    // set up some squares
    var example = document.getElementById('example');
    var context = example.getContext('2d');

    var CX = example.width / 2,
    CY = example.height / 2,
    sx = CX,
    sy = CY;

    for (var i = 0; i < 360; i += 0.1) {
      var rad = i * (2 * Math.PI) / 360;
      var grad = context.createLinearGradient(CX, CY, CX + sx * Math.cos(rad), CY + sy * Math.sin(rad));
      grad.addColorStop(0, 'hsla(0,100%,100%,1.0)'); //white
      grad.addColorStop(.25, 'hsla(0,100%,100%,1.0)'); //white
      grad.addColorStop(.5, 'hsla(0,100%,0%,1.0)'); //black
      grad.addColorStop(.8, 'hsla(' + i + ',100%,50%,1.0)'); //the color
      grad.addColorStop(.9, 'hsla(0,100%,100%,1.0)'); //white
      grad.addColorStop(1, 'hsla(0,100%,100%,1.0)'); //white
      context.strokeStyle = grad;
      context.beginPath();
      context.moveTo(CX, CY);
      context.lineTo(CX + sx * Math.cos(rad), CY + sy * Math.sin(rad));
      context.stroke();
    }
  }

  function handleWheel() {


    function findPos(obj) {
      var curleft = 0,
      curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {
          x: curleft,
          y: curtop
        };
      }
      return undefined;
    }

    function rgbToHex(r, g, b) {
      if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
      return ((r << 16) | (g << 8) | b).toString(16);
    }

    function update_color_picker(e, that){
      var pos = findPos(that);
      var x = e.pageX - pos.x;
      var y = e.pageY - pos.y;
      var c = that.getContext('2d');
      var p = c.getImageData(x, y, 1, 1).data;
      prehex = ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
      var hex = "#" + prehex;
      color_result.style.background = hex;
      pointer.style.left = (x - 10) + "px";
      pointer.style.top = (y - 10) +  "px";
    }

    $('#example').mousemove(function (e) {
      if (clicked) {
        var that = this;
        update_color_picker(e, that);
      }
    });

    $('#pointer').mousemove(function (e) {
      if (clicked) {
        var that = $('#example')[0];
        update_color_picker(e, that);
      }
    });

    $('#example').mousedown(function (e) {
      clicked = true;
      var that = this;
      update_color_picker(e, that);
    });

    $('#example').mouseup(function (e) {
      clicked = false;
    });

    $('#pointer').mousedown(function (e) {
      clicked = true;
    });

    $('#pointer').mouseup(function (e) {
      clicked = false;
    });

    $('#color_result').click(function(){
      updateLEDs();
      clicked = true;
    });
  }
});
