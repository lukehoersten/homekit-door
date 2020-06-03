const hap = require("hap-nodejs");
const pysh = require("python-shell");

const Accessory = hap.Accessory;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;
const AccessoryEventTypes = hap.AccessoryEventTypes;
const Service = hap.Service;
const uuid = hap.uuid;

const accessoryUuid = hap.uuid.generate("hap.accessories.doorbell-lock");
const accessory = new Accessory("Doorbell and Lock", accessoryUuid);

const doorbellService = new Service.Doorbell("Doorbell");
const lockService = new Service.LockMechanism("Lock");

const lockTargetStateCharacteristic = lockService.getCharacteristic(Characteristic.LockTargetState);
const lockCurrentStateCharacteristic = lockService.getCharacteristic(Characteristic.LockCurrentState);

const doorbellSwitchCharacteristic = doorbellService.getCharacteristic(Characteristic.ProgrammableSwitchEvent);

function Door() {
    this.lockTimeout = 10000; // milliseconds - 10 sec

    this.pyshell = new pysh.PythonShell("doord.py", {
        mode: "text",
        pythonPath: "/usr/bin/python3",
        pythonOptions: ["-u"],
        scriptPath: "python/"
    });

    this.lock = () => {
        console.log("locking door");
        this.pyshell.send("lock");
    };

    this.unlock = () => {
        console.log("unlocking door");
        this.pyshell.send("unlock");
    };

    this.identify = () => { console.log("identify door"); };

    this.listenDoorbell = (doorbellOnCallback, doorbellOffCallback) => {
        this.pyshell.on("message", (message) => {
            console.log(message);
            switch(message) {
            case "doorbell on":
                doorbellOnCallback();
                break;
            case "doorbell off":
                doorbellOffCallback();
                break;
            }
        });
    };
}

const door = new Door();

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
    door.unlock();
    lockCurrentStateCharacteristic.setValue(Characteristic.LockCurrentState.UNSECURED);
    scheduleUnlockTimeout();
}

function lockDoor() {
    door.lock();
    lockCurrentStateCharacteristic.setValue(Characteristic.LockCurrentState.SECURED);
}

function scheduleUnlockTimeout() {
    setTimeout(() => {
        console.log("unlock timeout door");
        lockTargetStateCharacteristic.setValue(Characteristic.LockTargetState.SECURED);
    }, door.lockTimeout);
}

door.listenDoorbell(
    () => {
        doorbellSwitchCharacteristic.setValue(Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
    },
    () => {}
);

// set initial state
lockTargetStateCharacteristic.setValue(Characteristic.LockTargetState.SECURED);
lockCurrentStateCharacteristic.setValue(Characteristic.LockCurrentState.SECURED);
lockTargetStateCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
    setDoorTargetState(value);
    callback();
});

accessory.on(AccessoryEventTypes.IDENTIFY, (paired, callback) => {
    door.identify();
    callback();
});

accessory.addService(doorbellService);
accessory.addService(lockService);

accessory.getService(Service.AccessoryInformation)
    .setCharacteristic(Characteristic.Manufacturer, "Raspberry Pi")
    .setCharacteristic(Characteristic.Model, "Zero W")
    .setCharacteristic(Characteristic.SerialNumber, "A1S2NASF88EW");

accessory.publish({
  username: "C1:5D:3A:EA:54:AB",
  pincode: "031-45-154",
  category: hap.Categories.DOOR_LOCK
});

console.log("Accessory initialized");
