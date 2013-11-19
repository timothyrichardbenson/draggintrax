var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;
const SPACER_WIDTH = 5;
const COL_WIDTH = 1;

var context = new (window.AudioContext || window.webkitAudioContext)();
var source;
var analyser;
var xhr;

// Polyfil for animatiosn from 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function initAudio(data) {
    source = context.createBufferSource();
    
    if(context.decodeAudioData) {
        context.decodeAudioData(data, function(buffer) {
            source.buffer = buffer;
            createAudio();
        }, function(e) {
            console.log(e);
        });
    } else {
        source.buffer = context.createBuffer(data, false /*mixToMono*/);
        createAudio();
    }    
}

function createAudio() {
    analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.connect(context.destination);

    source.noteOn(0);
    setTimeout(disconnect, source.buffer.duration * 1000 +1000);
    render();
}

var animId = null;

function disconnect() {
    source.noteOff(0);
    source.disconnect(0);
    analyser.disconnect(0);
    window.cancelAnimationFrame(animId);
}

function render() {
    animId = window.requestAnimationFrame(render);
    draw();
}

function draw() {
    var freqByteData = new Uint8Array(analyser.frequencyBinCount);
        
    analyser.getByteFrequencyData(freqByteData);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    var colors = [
        '#3369E8', // blue
        '#D53225', // red
        '#EEB211', // yellow
        '#009939', // green
      ];
    
    for (var i = 0; i < freqByteData.length; ++i) {
        
        var magnitude = freqByteData[i];
        var lingrad = ctx.createLinearGradient(0, CANVAS_HEIGHT, 0, CANVAS_HEIGHT - magnitude);
        
        lingrad.addColorStop(0, colors[i % colors.length]);
        lingrad.addColorStop(1, colors[i % colors.length]);
        ctx.fillStyle = lingrad;

        ctx.fillRect(i * SPACER_WIDTH, CANVAS_HEIGHT, COL_WIDTH, -magnitude);
      }
}

function dropEvent(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    
    var droppedFiles = evt.dataTransfer.files;
    
    /*
    var formData = new FormData();
    
    for(var i = 0; i < droppedFiles.length; ++i) {
        var file = droppedFiles[i];
        
        files.append(file.name, file);
    }
    
    xhr = new XMLHttpRequest();
    xhr.open("POST", settings.url);  
    xhr.onreadystatechange = handleResult;
    xhr.send(formData);
    */
    
    var reader = new FileReader();
    
    reader.onload = function(fileEvent) {
        var data = fileEvent.target.result;
        initAudio(data);
    }
    
    reader.readAsArrayBuffer(droppedFiles[0]);
}

function handleResult() {
    if (xhr.readyState == 4 /* complete */) {
        switch(xhr.status) {
            case 200: /* Success */
                initAudio(request.response);
                break;
            default:
                break;
        }
        xhr = null;
    }      
}

function dragOver(evt) {
    evt.stopPropagation();
 
   evt.preventDefault();
    return false;
}

canvas.addEventListener('drop', dropEvent, false);
canvas.addEventListener('dragover', dragOver, false);

var canvas = document.getElementById('canvas2');
var ctx = canvas.getContext('2d');
const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;
const SPACER_WIDTH = 5;
const COL_WIDTH = 1;

var context = new (window.AudioContext || window.webkitAudioContext)();
var source;
var analyser;
var xhr;

// Polyfil for animatiosn from 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function initAudio(data) {
    source = context.createBufferSource();
    
    if(context.decodeAudioData) {
        context.decodeAudioData(data, function(buffer) {
            source.buffer = buffer;
            createAudio();
        }, function(e) {
            console.log(e);
        });
    } else {
        source.buffer = context.createBuffer(data, false /*mixToMono*/);
        createAudio();
    }    
}

function createAudio() {
    analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.connect(context.destination);

    source.noteOn(0);
    setTimeout(disconnect, source.buffer.duration * 1000 +1000);
    render();
}

var animId = null;

function disconnect() {
    source.noteOff(0);
    source.disconnect(0);
    analyser.disconnect(0);
    window.cancelAnimationFrame(animId);
}

function render() {
    animId = window.requestAnimationFrame(render);
    draw();
}

function draw() {
    var freqByteData = new Uint8Array(analyser.frequencyBinCount);
        
    analyser.getByteFrequencyData(freqByteData);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    var colors = [
        '#3369E8', // blue
        '#D53225', // red
        '#EEB211', // yellow
        '#009939', // green
      ];
    
    for (var i = 0; i < freqByteData.length; ++i) {
        
        var magnitude = freqByteData[i];
        var lingrad = ctx.createLinearGradient(0, CANVAS_HEIGHT, 0, CANVAS_HEIGHT - magnitude);
        
        lingrad.addColorStop(0, colors[i % colors.length]);
        lingrad.addColorStop(1, colors[i % colors.length]);
        ctx.fillStyle = lingrad;

        ctx.fillRect(i * SPACER_WIDTH, CANVAS_HEIGHT, COL_WIDTH, -magnitude);
      }
}

function dropEvent(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    
    var droppedFiles = evt.dataTransfer.files;
    
    /*
    var formData = new FormData();
    
    for(var i = 0; i < droppedFiles.length; ++i) {
        var file = droppedFiles[i];
        
        files.append(file.name, file);
    }
    
    xhr = new XMLHttpRequest();
    xhr.open("POST", settings.url);  
    xhr.onreadystatechange = handleResult;
    xhr.send(formData);
    */
    
    var reader = new FileReader();
    
    reader.onload = function(fileEvent) {
        var data = fileEvent.target.result;
        initAudio(data);
    }
    
    reader.readAsArrayBuffer(droppedFiles[0]);
}

function handleResult() {
    if (xhr.readyState == 4 /* complete */) {
        switch(xhr.status) {
            case 200: /* Success */
                initAudio(request.response);
                break;
            default:
                break;
        }
        xhr = null;
    }      
}

function dragOver(evt) {
    evt.stopPropagation();
 
   evt.preventDefault();
    return false;
}

canvas.addEventListener('drop', dropEvent, false);
canvas.addEventListener('dragover', dragOver, false);
