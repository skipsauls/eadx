({
    log: function(component, message) {
        let log = component.get('v.log');
        log.push(message);
        component.set('v.log', log);
    },
    
    setup: function(component) {
        
        let self = this;
        
        window.addEventListener("compassneedscalibration", function(event) {
            alert('Your compass needs calibrating! Wave your device in a figure-eight motion');
            event.preventDefault();
        }, true);
        
        if (window.DeviceMotionEvent) {
            window.ondevicemotion = function(e) {
                var x = e.acceleration.x;
                var y = e.acceleration.y;
                var z = e.acceleration.z;
                component.set('v.acceleration', e.acceleration);
                self.log(component, 'Acceleration: ' + x + ', ' + y + ', ' + z);
                
                var xg = e.accelerationIncludingGravity.x;
                var yg = e.accelerationIncludingGravity.y;
                var zg = e.accelerationIncludingGravity.z;
                component.set('v.accelerationIncludingGravity', e.accelerationIncludingGravity);
                self.log(component, 'Acceleration including gravity: ' + xg + ', ' + yg + ', ' + zg);
                
                var alpha = e.rotationRate.alpha;
                var beta = e.rotationRate.beta;
                var gamma = e.rotationRate.gamma;
                component.set('v.rotationRate', e.rotationRate);
                self.log(component, 'Rotation rate: ' + alpha + ', ' + beta + ', ' + gamma);
                
                
                component.set('v.refreshInterval', e.interval);
                self.log(component, 'Refresh interval: ' + e.interval); 
                
                let latest = {
                    timestamp: Date.now(),
                    acceleration: {
                        x: e.acceleration.x,
                        y: e.acceleration.y,
                        z: e.acceleration.z                        
                    },
                    accelerationIncludingGravity: {
                        x: e.accelerationIncludingGravity.x,
                        y: e.accelerationIncludingGravity.y,
                        z: e.accelerationIncludingGravity.z                        
                    },
                    rotationRate: {
                        alpha: e.rotationRate.alpha,
                        beta: e.rotationRate.beta,
                        gamma: e.rotationRate.gamma
                    }   
                };
                
                component.set('v.latest', latest);
                
                let position = component.get('v.position') || {x: 0, y: 0, z: 0};
                position.x = (parseFloat(position.x) + latest.acceleration.x).toFixed(4);
                position.y = (parseFloat(position.y) + latest.acceleration.y).toFixed(4);
                position.z = (parseFloat(position.z) + latest.acceleration.z).toFixed(4);
                component.set('v.position', position);
            }
        } else {
            log('Device Motion not supported.');
        }
        
        if (window.DeviceOrientationEvent) {
            window.ondeviceorientation = function(e) {
                let orientation = {
                    alpha: e.alpha,
                    beta: e.beta,
                    gamma: e.gamma,
                    absolute: e.absolute
                };
                component.set('v.orientation', orientation);
                
                // Moved to markup
                /*                
                let logoElement = component.find('orientee').getElement();
                let transform = 'rotate(' + e.gamma + 'deg) rotate3d(1, 0, 0, ' + e.beta + 'deg)';
                logoElement.style.webkitTransform = transform;
                logoElement.style.transform = transform;
                */
            }
            
        }
    }
})