# Copyright (C) 2024 Advanced Micro Devices, Inc.  All rights reserved.
# SPDX-License-Identifier: MIT


app_tile = "Power Management Dashboard"
Version = "V 0.1"


#enum for button type
TYPE_MAJOR_BUTTON = 1
TYPE_MINOR_BUTTON = 2
TYPE_MAJMIN_COMBI_BUTTON = 3
TYPE_MAJMIN_COMBI_BUTTON_GRID = 4
TYPE_CENTER_BUTTON = 5
default_buttons = [
    {
        "title":"Preset",
        "type":TYPE_MAJOR_BUTTON,
        "color":"primary"
    },
    {
        "title":"Select",
        "type":TYPE_MAJOR_BUTTON,
        "color": "primary"
    },
]
domain_elements = [
    {
        "group": "Low <br> Power",
     "elements": [
    {
        "title":"R5/0",
        "type": TYPE_MAJMIN_COMBI_BUTTON,
        "color": "warning"
    },
    {
        "title":"R5/1",
        "type": TYPE_MAJMIN_COMBI_BUTTON,
        "color": "warning"
    },
    {
        "title":"100%",
        "type": TYPE_MAJOR_BUTTON,
        "color": "warning"
    },
    {
        "title":"TCM",
        "type": TYPE_MINOR_BUTTON,
        "color": "success"
    },
    {
        "title":"OCM",
        "type": TYPE_MAJOR_BUTTON,
        "color": "success"
    },
    {
        "title":"PMU",
        "type": TYPE_MAJOR_BUTTON,
        "color": "warning"
    },
    {
        "title":"CSU",
        "type": TYPE_MAJOR_BUTTON,
        "color": "primary"
    },
    {
        "title":"Periph",
        "type": TYPE_MAJOR_BUTTON,
        "color": "danger"
    }
     ]
    },
     {
        "group": "Full power <br> Domain",
     "elements": [
    {
        
        "title":"A53/0",
        "type": TYPE_MAJMIN_COMBI_BUTTON_GRID,
        "color": "primary"
        
    },
    {
        "title":"A53/1",
        "type": TYPE_MAJMIN_COMBI_BUTTON_GRID,
        "color": "primary"
    },
    {
        "title":"A53/2",
        "type": TYPE_MAJMIN_COMBI_BUTTON_GRID,
        "color": "primary"
    },
    {
        "title":"A53/3",
        "type": TYPE_MAJMIN_COMBI_BUTTON_GRID,
        "color": "primary"
    },
    {
        "title":"100%",
        "type": TYPE_CENTER_BUTTON,
        "color": "primary"
    },
    {
        "title":"GPU",
        "type": TYPE_MAJMIN_COMBI_BUTTON,
        "color": "warning"
    },
    {
        "title":"DDR",
        "type": TYPE_MAJOR_BUTTON,
        "color": "success"
    },
    {
        "title":"HS Periph",
        "type": TYPE_CENTER_BUTTON,
        "color": "danger"
    }
     ]
    },
    {
        "group":"Batt Power <br> Domain",
        "elements":[
    
        ]
    },
    {
        "group":"Programmable <br> Lagic Domain",
        "elements":[
    {
        "title":"100%",
        "type": TYPE_MAJMIN_COMBI_BUTTON_GRID,
        "color": "primary"
    },
    {
        "title":"Options",
        "type": TYPE_MAJOR_BUTTON,
        "color": "primary"
    },
        ]
    }

]


