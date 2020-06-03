# Raspberry Pi Homekit Door Lock Buzzer Accessory

Using a [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/)
and [Pimoroni Automation pHAT](https://shop.pimoroni.com/products/automation-phat), make a simple circuit-based door
lock and doorbell intercom into a Siri-controlled HomeKit smart accessory. Siri integration is provided
by [HAP-NodeJS](https://github.com/homebridge/HAP-NodeJS). This package itself does not depend on Homebridge.

## Installation

Installation can be handled by:

1. The [Ansible](https://ansible.com/) `homekit-door` role provided in the `roles` directory or
2. By copying the `npmjs-package` to the Raspberry Pi and running `npm install`.
