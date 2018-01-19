# Raspberry Pi Homekit Door Accessory

## Ansible Inventory

`inventory/host_vars/raspberrypi.local.yaml`

    github_user: "<github user>"
    nodejs_version: "8.9.0"
    nodejs_dir: "node-v{{nodejs_version}}-linux-{{ansible_architecture}}"
    wpa_networks:
      - ssid: "<your ssid>"
        psk: "<your wifi password>"
