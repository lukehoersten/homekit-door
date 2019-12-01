# Raspberry Pi Homekit Door Accessory

Using
a
[Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/) and
[Pimoroni Automation pHAT](https://shop.pimoroni.com/products/automation-phat),
make a simple circuit-based door lock and door bell intercom into a
Siri-controlled HomeKit smart accessory. Siri integration is provided
by [HAP-NodeJS](https://github.com/KhaosT/HAP-NodeJS).

## Installation

Installation is rather involved and handled by
an [Ansible](https://ansible.com/) playbook.

## Ansible Inventory

`inventory/host_vars/raspberrypi.local.yaml`

    github_user: "<github user>"
    wpa_networks:
      - ssid: "<your ssid>"
        psk: "<your wifi password>"

## Run Ansible

`ansible-playbook rpi-door.yaml`
