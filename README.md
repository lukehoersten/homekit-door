# Raspberry Pi Homekit Door Accessory

Using
a
[Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/) and
[Pimoroni Automation pHAT](https://shop.pimoroni.com/products/automation-phat),
make a simple circuit-based door lock and door bell intercom into a
Siri controlled smart accessory. Siri integration is provided
by [HAP-NodeJS](https://github.com/KhaosT/HAP-NodeJS).

## Installation

Installation is complex and handled by
an [Ansible](https://ansible.com/) playbook.

## Ansible Inventory

`inventory/host_vars/raspberrypi.local.yaml`

    github_user: "<github user>"
    nodejs_version: "8.9.0"
    nodejs_dir: "node-v{{nodejs_version}}-linux-{{ansible_architecture}}"
    wpa_networks:
      - ssid: "<your ssid>"
        psk: "<your wifi password>"

## Run Ansible

`ansible-playbook hap.yaml`
