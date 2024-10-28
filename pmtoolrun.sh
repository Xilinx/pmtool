#!/bin/bash

#
# Copyright (c) 2024 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
#

ip=$(ip -4 addr show end0 | grep -oE "inet ([0-9]{1,3}[\.]){3}[0-9]{1,3}" | cut -d ' ' -f2)
if [ -z $ip ]; then
     echo "Cant find IP addr, please call /usr/bin/pmtoolrun.sh after assigning IP addr"
     exit 1
else
    echo "Power Management Dashboard Tool will be running at http://$ip:5006/"
    bokeh serve --show --allow-websocket-origin=$ip:5006 --allow-websocket-origin=$(hostname):5006 /usr/share/pmtool/
fi
