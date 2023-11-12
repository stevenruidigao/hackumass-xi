(() => {
    // Check if the browser supports DeviceMotionEvent
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleDeviceMotion, false);

    } else {
        console.log('Device motion not supported.');
    }

    // Check if the browser supports DeviceOrientationEvent
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleDeviceOrientation, false);

    } else {
        console.log('Device orientation not supported.');
    }

    // alpha is 0 to 360
    // beta is -180 to 180
    // gamma is -90 to 90
    var rotation_offset = new THREE.Quaternion(); // when you press calibrate, the rotation offset is reset to a new rotation matrix
    var curr_orientation = new THREE.Quaternion(); // the current rotation matrix

    var point_array_2D = []; // element: [x, y, z]
    var point_subarray = [];
    const plane_normal = new THREE.Vector3(0, 1, 0);

    var last_time = -1;
    const past_size = 60;
    var last_accelerations = [Array(past_size), Array(past_size), Array(past_size)];
    var last_shake = -1;

    var resetting = false;
    var reset_start = -1;

    var recording = false;

    // pos, vel, and accel are absolute (not relative to the orientation of the device)
    var position = [0, 0, 0];
    var velocity = [0, 0, 0];
    var acceleration = [0, 0, 0];

    function symbol(symbol) {
        alert(symbol);
        socket.emit('action', symbol);
    }

    var angle_sum = 0;
    var angle_count = 0
    var last_move = -1;

    function tilt(angle) {
        // let p = document.createElement('p');
        // p.innerText = ` tilt: ${angle} `;
        // document.body.appendChild(p);

        angle_sum += angle;
        angle_count ++;

        if (Date.now() - last_move > 100) {
            let avg_angle = angle_sum / angle_count;

            if (avg_angle < -20) {
                socket.emit('move', 'right');
                angle_sum = 0;
                angle_count = 0;

            } else if (avg_angle > 20) {
                socket.emit('move', 'left');
                angle_sum = 0;
                angle_count = 0;

            } else {
                angle_sum = 0;
                angle_count = 0;
            }

            last_move = Date.now();
        }
    }

    function shake() {
        alert('Shake');
        socket.emit('action', 'shake');
    }

    function reset() {
        // reset velocity and position
        rotation_offset = curr_orientation.normalize().invert();
        
        point_array_2D = [];
        position = [0, 0, 0];
        velocity = [0, 0, 0];
        acceleration = [0, 0, 0];
        
        last_accelerations = [Array(past_size), Array(past_size), Array(past_size)];

        curr_orientation = new THREE.Quaternion();

        resetting = true;
        reset_start = Date.now();
    }

    function record() {
        recording = true;
        alert('record');
    }

    function stopRecording() {
        recording = false;
        let recognizer = new QDollarRecognizer();
        let result = recognizer.Recognize(point_array_2D);
        symbol(result.Name);

        point_array_2D = [];
    }

    function cleanSensorInput(accel) {
        // clean sensor input (relative_accel)
        // dead zone (low pass)
        accel = accel.map((x) => {
            return Math.abs(x) > 0.1 ? x : 0;
        });
        
        // get rid of outliers (high pass)
        accel = accel.map((x) => {
            if (x > 15) return 15;
            else if (x < -15) return -15;
            else return x;
        });
        
        // take the arithmetic mean of the last 60 values
        accel = last_accelerations.map((axis, i) => {
            axis.push(accel[i]);
            axis.shift();
            return axis;
        }).map(axis => axis.reduce((a, b) => a + b, 0) / axis.length);

        return accel;
    }

    function handleDeviceMotion(event) {
        let now = Date.now();
        let time_diff = last_time > 0 ? (event.timeStamp - last_time) / 1000 : 0.016;

        relative_accel = [event.acceleration.x,
                        event.acceleration.y,
                        event.acceleration.z];
                                            
        clean_relative_accel = cleanSensorInput(relative_accel);
        
        if (!recording && relative_accel.reduce((acc, cur, i) => {
            return acc + (cur - clean_relative_accel[i]) * (cur - clean_relative_accel[i]);

        }, 0) >= 1000 && event.timeStamp - last_shake > 1000) {
            last_shake = event.timeStamp;
            shake();
        }
        
        acceleration = (new THREE.Vector3(...clean_relative_accel)).applyQuaternion(rotation_offset).toArray();
        
        if (resetting && now - reset_start < 500) {
            
        } else if (resetting) {
            resetting = false;
            reset_start = -1;

        } else {
            position = position.map((axis, i) => axis + velocity[i] * time_diff + acceleration[i] * time_diff * time_diff / 2);
            velocity = velocity.map((axis, i) => axis + acceleration[i] * time_diff);

            if (!resetting && recording) {
                let point_3D = (new THREE.Vector3(...position)).projectOnPlane(plane_normal).multiplyScalar(10);
                point_subarray.push([point_3D.x, point_3D.z]);
                
                if (point_subarray.length > 2) {
                    let point = point_subarray.reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]], [0, 0])
                        .map(x => x / point_subarray.length);
                    
                    point_array_2D.push((new Point(point[0], point[1], 1)));
                    point_subarray = [];
                }
            }
        }

        last_time = event.timeStamp;
    }

    function handleDeviceOrientation(event) {
        let current_euler = new THREE.Euler(); // [alpha, beta, gamma]
        const deg_to_rad = Math.PI / 180;
        const rad_to_deg = 180 / Math.PI;
        current_euler.set(event.alpha * deg_to_rad, event.beta * deg_to_rad, event.gamma * deg_to_rad);
        curr_orientation.setFromEuler(current_euler);
        absolute_orientation = curr_orientation.multiply(rotation_offset);
        absolute_euler = new THREE.Euler(); // [alpha, beta, gamma]
        absolute_euler.setFromQuaternion(absolute_orientation);

        tilt((absolute_euler.x * rad_to_deg > 180) ? absolute_euler.x * rad_to_deg  - 360 : absolute_euler.x * rad_to_deg);
        console.log(absolute_euler.x);

        var p = document.createElement('p');
        p.innerText = absolute_euler.x * rad_to_deg + ' ' + absolute_euler.y * rad_to_deg + ' ' + absolute_euler.z * rad_to_deg;
        document.body.appendChild(p);
    }

    function requestPermissions(callback) {
        if (window.DeviceMotionEvent !== undefined) {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', handleDeviceMotion, true);
                    }

                }).catch((e) => {console.log});

            } else {
                console.log('No requestPermission function');
                window.addEventListener('devicemotion', handleDeviceMotion, true);
            }
        }
        
        if (window.DeviceOrientationEvent !== undefined) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
                    }
                    
                }).catch((e) => {alert});

            } else {
                console.log('No requestPermission function');
                window.addEventListener('deviceorientation', handleDeviceOrientation, true);
            }
        }

        if (callback !== undefined) {
            callback();
        }
    }

    function requestMotion() {
        if (window.DeviceMotionEvent !== undefined) {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', handleDeviceMotion, true);
                    }

                }).catch((e) => {console.log});

            } else {
                console.log('No requestPermission function');
                window.addEventListener('devicemotion', handleDeviceMotion, true);
            }
        }
    }

    function requestOrientation() {
        if (window.DeviceOrientationEvent !== undefined) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
                    }
                    
                }).catch((e) => {alert});

            } else {
                console.log('No requestPermission function');
                window.addEventListener('deviceorientation', handleDeviceOrientation, true);
            }
        }
    }

    // var button = document.createElement('button');
    // button.onclick = requestMotion;
    // button.innerText = 'Allow Motion';
    // document.body.appendChild(button);
    // button = document.createElement('button');
    // button.onclick = requestOrientation;
    // button.innerText = 'Allow Orientation';
    // document.body.appendChild(button);

    // document.getElementById('motion-button').onclick = requestMotion;
    // document.getElementById('orientation-button').onclick = requestOrientation;
    
    requestMotion();
    requestOrientation();
    reset();

    window.requestPermissions = requestPermissions;

    // document.getElementById('reset-button').onclick = reset;
    // document.getElementById('record-button').onpointerdown = record;
    // document.getElementById('record-button').onpointerup = stopRecording;
    document.getElementById('player-button').onpointerdown = record;
    document.getElementById('player-button').onpointerup = stopRecording;
})();