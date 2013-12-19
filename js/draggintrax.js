const SPACER_WIDTH = 5;
const COL_WIDTH = 1;
    
var colors = [
	      '#0000FF', // blue1
	      '#6495ED', // blue2
	      '#08088A', // blue3
	      '#2E2EFE', // blue4
	      ];

//var canvas = document.getElementById('canvas');
var DragginTrax = function(canvas) {

    var self = this;

    var canvasHeight = canvas.height;
    var canvasWidth = canvas.width;
    var ctx = canvas.getContext('2d');
    var context = new (window.AudioContext || window.webkitAudioContext)();
    var source;
    var analyser;
    var animId;
    
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
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
	for (var i = 0; i < freqByteData.length; ++i) {
	    
	    var magnitude = freqByteData[i];
	    var lingrad = ctx.createLinearGradient(1, canvasHeight, 0, canvasHeight - magnitude);
	    
	    lingrad.addColorStop(0, colors[i % colors.length]);
	    lingrad.addColorStop(1, colors[i % colors.length]);
	    ctx.fillStyle = lingrad;
	    
	    ctx.fillRect(i * SPACER_WIDTH, canvasHeight, COL_WIDTH, -magnitude);
	}
    }
    
    /*
     * dropped file event listener
     */
    function dropEvent(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	
	var droppedFiles = evt.dataTransfer.files;
	var reader = new FileReader();
	
	reader.onload = function(fileEvent) {
	    var data = fileEvent.target.result;
	    initAudio(data);
	}
	
	reader.readAsArrayBuffer(droppedFiles[0]);
    }
    
    function dragOver(evt) {
	evt.target.style['background-color'] = 'green';
	evt.stopPropagation();
	evt.preventDefault();
	return false;
    }
    
    canvas.addEventListener('drop', dropEvent);
    canvas.addEventListener('dragover', dragOver);

}; //end DragginTrax


var c1 = document.getElementById("canvas");
var c2 = document.getElementById("canvas2");

var dt = new DragginTrax(c1);
var dt = new DragginTrax(c2);
