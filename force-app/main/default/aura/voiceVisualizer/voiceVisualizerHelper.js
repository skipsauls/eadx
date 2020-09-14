({
    setup: function(component) {
    	var self = this;
        
        self.setupVisualizer(component);
    },
    
    toggleAwake: function(component, awakeVal) {
        //console.warn('voiceVisualizerHelper.toggleAwake: ', awakeVal);
        var self = this;
        var awake = component.get('v.awake');
        if (awakeVal !== null && typeof awakeVal !== 'undefined') {
            awake = awakeVal;
        } else {
	        awake = !awake;
        }

        if (awake === true) {
	        component.set('v.awake', true);
	        component.set('v.interimResults', false);
	        self.startVisualization(component);
        } else {
	        component.set('v.awake', false);
	        component.set('v.interimResults', true);
	        self.stopVisualization(component);
        }
    },
    
    handleResize: function(component) {
        //console.warn('handleRezize');
        var self = this;
        var visualizer = component.find('visualizer').getElement();
        var visualizerContainer = visualizer.parentElement;
        //console.warn('visualizerContainer.clientWidth: ', visualizerContainer.clientWidth);
        visualizer.width = visualizerContainer.clientWidth;
        //console.warn('visualizer.width: ', visualizer.width);
    },
    
    setupVisualizer: function(component) {
        var self = this;
        var visualizer = component.find('visualizer').getElement();
        var visualizerContainer = visualizer.parentElement;
        
        function handleResize() {
           	//console.warn('----------------------------------------------------------------------------------- handleResize');
            //console.warn('visualizerContainer.clientWidth: ', visualizerContainer.clientWidth);
            /*
            console.warn('visualizerContainer.clientHeight: ', visualizerContainer.clientHeight);
            console.warn('visualizerContainer.offsetWidth: ', visualizerContainer.offsetWidth);
            console.warn('visualizerContainer.offsetHeight: ', visualizerContainer.offsetHeight);
            */
            visualizer.width = visualizerContainer.clientWidth;
            //visualizer.height = visualizerContainer.clientHeight;            
        }
        
        window.onresize = function(e) {
			handleResize();
        };

        handleResize();
    },    
    
    getByteTimeDomainData: function(component, config, callback) {
        //console.warn('getByteTimeDomainData');
		var voiceAnalysisProxy = component.find('voiceAnalysisProxy');
        //console.warn('voiceAnalysisProxy: ', voiceAnalysisProxy);
        var self = this;
        var uid = 'Einstein_Assistant_Voice_Analyzer';
        voiceAnalysisProxy.getByteTimeDomainData(config.visualSetting, uid, function(response) {
            //console.warn('voiceAnalysisProxy.getByteTimeDomainData returned: ', response);
            //console.warn('response.config.uid: ', response.config.uid);
            //console.warn('uid: ', uid);
            //console.warn('callback: ', typeof callback);
            if (response.config.uid === uid && typeof callback === 'function') {
                //console.warn('calling callback');
                callback(response.dataArray, response.bufferLength);
            }
        });          
    },
    
    count: 0,
    maxCount: 10,
    
    drawVisual: null,
    
    stopVisualization: function(component) {
        //console.warn('??????????????????????????????????????????????????????????????????????????????????????? stopVisualization');
        var self = this;
        
        //var drawVisual = component.get('v.drawVisual');        
        //console.warn('drawVisual: ', drawVisual);
		window.cancelAnimationFrame(self.drawVisual);
        //component.set('v.drawVisual', null);
        
        //console.warn('clearing canvas');
        var canvas = component.find('visualizer').getElement();
		var canvasCtx = canvas.getContext("2d");
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;        
		canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);        
        
		var voiceAnalysisProxy = component.find('voiceAnalysisProxy');
        var uid = 'Einstein_Assistant_Voice_Analyzer';
        voiceAnalysisProxy.stopAnalysis(uid, function(response) {
            console.warn('voiceVisualizerHelper.stopAnalysis returned: ', response);
        });        
    },
    
    startVisualization: function(component) {
        //console.warn('??????????????????????????????????????????????????????????????????????????????????????? startVisualization');
        var self = this;
        
		var voiceAnalysisProxy = component.find('voiceAnalysisProxy');
        var uid = 'Einstein_Assistant_Voice_Analyzer';
        voiceAnalysisProxy.startAnalysis(uid, function(response) {
            //console.warn('voiceVisualizerHelper.startAnalysis returned: ', response);
        
            var canvas = component.find('visualizer').getElement();
            var canvasCtx = canvas.getContext("2d");
            
            var visualizerContainer = canvas.parentElement;
            canvas.width = visualizerContainer.clientWidth;        
            
			/*
            console.warn('canvas: ', canvas);
            console.warn('canvasCtx: ', canvasCtx);
            console.warn('canvas.width: ', canvas.width);
            console.warn('canvas.height: ', canvas.height);
            */
            
            var WIDTH = canvas.width;
            var HEIGHT = canvas.height;
                    
            var visualSetting = component.get('v.visualSetting');
            //console.log('visualSetting: ', visualSetting);
    
            var drawVisual = component.get('v.drawVisual');
            //console.log('drawVisual: ', drawVisual);
            
            var _timestamp = Date.now();
            var _fps = 15;
            var _frameDelay = _fps / 1000;
            
            if (visualSetting === "sinewave") {
                var config = {
                    visualSetting: visualSetting
                }
                
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                
                var draw = function() {
                    
                    var listening = component.get('v.listening');
                    if (listening !== true) {
                        return;
                    } else {
                        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);                    
                    }
                    /*
                    if (self.count++ > self.maxCount) {
                        return;
                    }
                    */                
                    self.drawVisual = requestAnimationFrame(draw);
                    //console.warn('created drawVisual: ', drawVisual);
                    //component.set('v.drawVisual', drawVisual);
                    
                    if (Date.now() < _timestamp + _frameDelay) {
                        return;
                    }
                    
                    _timestamp = Date.now();
                    
                    self.getByteTimeDomainData(component, config, function(dataArray, bufferLength) {
                        //console.warn('######################## getByteTimeDomainData returned: ', dataArray, bufferLength);
                    
                        /*
                        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
                        */
                        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                        
                        
                        canvasCtx.lineWidth = 4;
                        
                        canvasCtx.beginPath();
                        
                        var sliceWidth = WIDTH * 1.0 / bufferLength;
                        var x = 0;
                        var y = 0;
                        var v = 0;
                        
                        for (var i = 0; i < bufferLength; i++) {
                            
                            v = dataArray[i] / 128.0;
                            y = v * HEIGHT / 2;
    
                            canvasCtx.strokeStyle = 'rgba(31, 119, 214, ' + (1.0 - v / 2) + ')';
                            
                            if (i === 0) {
                                canvasCtx.moveTo(x, y);
                            } else {
                                canvasCtx.lineTo(x, y);
                            }
                            
                            x += sliceWidth;
                        }
                        
                        canvasCtx.lineTo(canvas.width, canvas.height/2);
                        canvasCtx.stroke();
                        
                    });
                }
                draw();
                
            } else if (visualSetting == "frequencybars") {
                
                var config = {
                    visualSetting: visualSetting
                }
                
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                
                //console.warn('WIDTH: ', WIDTH);
                //console.warn('HEIGHT: ', HEIGHT);
                
                var roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
                    if (typeof stroke == "undefined" ) {
                        stroke = true;
                    }
                    if (typeof radius === "undefined") {
                        radius = 5;
                    }
                    ctx.beginPath();
                    ctx.moveTo(x + radius, y);
                    ctx.lineTo(x + width - radius, y);
                    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                    ctx.lineTo(x + width, y + height - radius);
                    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                    ctx.lineTo(x + radius, y + height);
                    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                    ctx.lineTo(x, y + radius);
                    ctx.quadraticCurveTo(x, y, x + radius, y);
                    ctx.closePath();
                    if (stroke) {
                        ctx.stroke();
                    }
                    if (fill) {
                        ctx.fill();
                    }        
                }            
                
                var drawAlt = function() {
                    
                    var awake = component.get('v.awake');
                    var listening = component.get('v.listening');
                    if (listening !== true) {
                        return;
                    } else {
                        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                    }
                    
                    self.drawVisual = requestAnimationFrame(drawAlt);
                    //component.set('v.drawVisual', drawVisual);                
    
                    if (awake === false) {
                        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                        return;
                    }
                    
                    if (Date.now() < _timestamp + _frameDelay) {
                        return;
                    }
                    
                    _timestamp = Date.now();
                    
                    
                    self.getByteTimeDomainData(component, config, function(dataArrayAlt, bufferLengthAlt) {
                        //console.warn('######################## getByteTimeDomainData returned: ', dataArrayAlt, bufferLengthAlt);
    
                        //analyser.getByteFrequencyData(dataArrayAlt);
                        
                        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                        //canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                        //canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
                        var threshold = 0;
                        var start = 0;
                        var inc = 1;;
                        
                        
                        var barWidth = 10;
                        var barHeight;
                        var barGap = barWidth * 1.5;
                        var minHeight = barWidth;
                        var radius = barWidth / 2;
                        var maxHeight = HEIGHT - radius;
                        var r, g, b;
                        var fillStyle = '';
                        var scale = (maxHeight / 128.0) / 1;
                        var avgArray = [];
                        
                        var micWidth = 54;
                        var micGap = barWidth * 2;
                        //var xOffset = (WIDTH / 2) + (micWidth / 2) + micGap;
                        var xOffset = (micWidth / 2) + micGap;
    
                        var x = (WIDTH / 2) + xOffset;
                        var x2 = ((WIDTH / 2) - xOffset); - barWidth;
                        
                        var numBars = 8;
                        
                        inc = bufferLengthAlt / numBars;
                        var sumHeight = 0;
                        var avgHeight = 0;
                        for (var i = start; i < bufferLengthAlt; i++) {
                            sumHeight += dataArrayAlt[i];
                            if ((i + 1) % inc === 0) {
                                avgHeight = ((sumHeight / inc) || barWidth) * scale;
                                //avgHeight -= avgHeight > (HEIGHT / 2) - radius ? radius : 0;
                                avgArray.push(avgHeight);
                                sumHeight = 0;
                            }
                            
                        }
                                               
                        for (var i = start; i < avgArray.length; i++) {
                            barHeight = avgArray[i];
                        //for (var i = start; i < bufferLengthAlt; i += inc) {
                            //barHeight = dataArrayAlt[i];
                            
                            if (barHeight > threshold) {
                                
                                //console.warn('barHeight: ', barHeight);
                                
                                //canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
                                r = 22;
                                g = 124;
                                b = 218;
                                
                                fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                                
                                canvasCtx.fillStyle = fillStyle;
                                
                                //canvasCtx.fillRect(0, (HEIGHT / 2) - 1, WIDTH, 2);
    
                                barHeight = barHeight < barWidth ? barWidth : barHeight;
                                
                                if ((i % 2 !== 0)) {
                                    roundRect(canvasCtx, x, (HEIGHT / 2 - (barHeight / 2)), barWidth, barHeight, radius, true, false);                                
                                    x += barWidth + barGap;
                                    barWidth -=2;
                                    radius -= 1;
                                } else {
                                    roundRect(canvasCtx, x2, (HEIGHT / 2 - (barHeight / 2)), barWidth, barHeight, radius, true, false);                                                                
                                    x2 -= barWidth + barGap;
                                }
                                
                            }
                        }
                    });
                };
                
                drawAlt();
                
            } else if (visualSetting == "off") {
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                canvasCtx.fillStyle = "blue";
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            }
        
        });        
            
    }   
})