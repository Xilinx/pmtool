#!/bin/bash

ip=$(ip -4 addr show eth0 | grep -oE "inet ([0-9]{1,3}[\.]){3}[0-9]{1,3}" | cut -d ' ' -f2)
if [ -z $ip ]; then
     echo "Cant find IP addr, please call /usr/bin/pmtoolrun.sh after assigning IP addr"
     exit 1
else
    echo "Power Management Dashboard Tool will be running at http://$ip:11111/"
    bokeh serve --show --allow-websocket-origin=$ip:11111 /usr/share/pmtool/src/
fi
