var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var PythonShell = require('python-shell');

var door = exports.accessory = new Accessory('Door', uuid.generate('hap-nodejs:accessories:door'));
door.username = 'C1:5D:3A:EA:54:AB';
door.pincode = '031-45-154';

door.getService(Service.AccessoryInformation)
    .setCharacteristic(Characteristic.Manufacturer, 'Raspberry Pi')
    .setCharacteristic(Characteristic.Model, 'Zero W')
    .setCharacteristic(Characteristic.SerialNumber, 'A1S2NASF88EW');

var DOOR = {
    lockTimeout: 10000, // milliseconds - 10 sec

    pyshell: new PythonShell('doord.py', {
        mode: 'text',
        pythonPath: '/usr/bin/python3',
        pythonOptions: ['-u'],
        scriptPath: 'python/'
    }),

    lock: function() {
        console.log('locking door');
        this.pyshell.send('lock');
    },

    unlock: function() {
        console.log('unlocking door');
        this.pyshell.send('unlock');
    },

    identify: function() {
        console.log('identify door');
    },

    listenDoorbell: function(doorbellOnCallback, doorbellOffCallback) {
        this.pyshell.on('message', function (message) {
            console.log(message);
            switch(message) {
            case 'doorbell_on':
                doorbellOnCallback();
                break;
            case 'doorbell_off':
                doorbellOffCallback();
                break;
            }
        });
    }
};

door.on('identify', function(paired, callback) {
    DOOR.identify();
    callback();
});

door.addService(Service.Doorbell, 'Doorbell');
door.addService(Service.CameraRTPStreamManagement, 'Psudo-Camera');
door.addService(Service.Speaker, 'Psudo-Speaker');
door.addService(Service.Microphone, 'Psudo-Microphone');

door.addService(Service.LockMechanism, 'Door')
    .setCharacteristic(Characteristic.LockTargetState, Characteristic.LockTargetState.SECURED) // force initial state
    .setCharacteristic(Characteristic.LockCurrentState, Characteristic.LockCurrentState.SECURED)
    .getCharacteristic(Characteristic.LockTargetState)
    .on('set', function(value, callback) {
        setDoorTargetState(value);
        callback();
    });

function setDoorTargetState(value) {
    switch(value) {
    case Characteristic.LockTargetState.UNSECURED:
        unlockDoor();
        break;
    case Characteristic.LockTargetState.SECURED:
        lockDoor();
        break;
    }
}

function unlockDoor() {
    DOOR.unlock();
    door.getService(Service.LockMechanism)
        .setCharacteristic(Characteristic.LockCurrentState,
                           Characteristic.LockCurrentState.UNSECURED);
    scheduleUnlockTimeout();
}

function lockDoor() {
    DOOR.lock();
    door.getService(Service.LockMechanism)
        .setCharacteristic(Characteristic.LockCurrentState,
                           Characteristic.LockCurrentState.SECURED);
}

function scheduleUnlockTimeout() {
    setTimeout(function() {
        console.log('unlock timeout door');
        door.getService(Service.LockMechanism)
            .setCharacteristic(Characteristic.LockTargetState,
                               Characteristic.LockTargetState.SECURED);
    }, DOOR.lockTimeout);
}

DOOR.listenDoorbell(
    function() {
        door.getService(Service.Doorbell)
            .setCharacteristic(Characteristic.ProgrammableSwitchEvent,
                               Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
    },
    function() {});
