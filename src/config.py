# Copyright (C) 2024 Advanced Micro Devices, Inc.  All rights reserved.
# SPDX-License-Identifier: MIT


app_tile = "Power Management Dashboard"
GUI_array = [
    "SELECT", "PRESET"
    , "R5/0", "R5/0_CLK", "R5/1", "R5/1_CLK", "LPD_CLK", "TCM", "OCM", "PMU", "CSU", "LPD_PERF"
    , "A53/0", "A53/0_CLK", "A53/1", "A53/1_CLK", "A53/2", "A53/2_CLK", "A53/3", "A53/3_CLK", "FPD_CLK", "GPU", "GPU_CLK", "DDR", "HS_PERF"
    , "PLD_CLK1", "PLD_CLK2", "PLD_OPT"
]
gks = ["none", "popups", "label", "valuelabel", "checkbox", "textfield", "dropdown", "calllocalfn", "clockspopup"]

GUIC = {GUI: i for i, GUI in enumerate(GUI_array)}
GUI_KEYS = {GUIK: i for i, GUIK in enumerate(gks)}

GUI_list = {
    GUIC["SELECT"]: {
        "label": "Select"
        , "onclick": GUI_KEYS["popups"]
        , "func": " "
    }
    , GUIC["PRESET"]: {
        "label": "Preset"
        , "onclick": ""
        , "func": " "
    }
    , GUIC["R5/0"]: {
        "label": "R5/0"
        , "onclick": ""
        , "elems": [{
            "title": ""
        }]
    }
    , GUIC["R5/0_CLK"]: {
        "label": "clock"
        , "onclick": GUI_KEYS["popups"]
    }
    , GUIC["R5/1"]: {
        "label": "R5/1"
        , "onclick": ""
    }
    , GUIC["R5/1_CLK"]: {
        "label": "clock"
        , "onclick": "hello world"
    }
    , GUIC["LPD_CLK"]: {
        "label": "clock"
        , "onclick": "hello"
    }
    , GUIC["TCM"]: {
        "label": "TCM"
        , "onclick": "hello world"
    }
    , GUIC["OCM"]: {
        "label": "OCM"
        , "onclick": "hello world"
    }
    , GUIC["PMU"]: {
        "label": "PMU"
        , "onclick": "hello world"
    }
    , GUIC["CSU"]: {
        "label": "CSU"
        , "onclick": "hello world"
    }
    , GUIC["LPD_PERF"]: {
        "label": "Periph"
        , "onclick": "hello world"
    }
    , GUIC["A53/0"]: {
        "label": "A53/0"
        , "onclick": ""
    }
    , GUIC["A53/0_CLK"]: {
        "label": "clock"
        , "onclick": "hello world"
    }
    , GUIC["A53/1"]: {
        "label": "A53/1"
        , "onclick": ""
    }
    , GUIC["A53/1_CLK"]: {
        "label": "clock"
        , "onclick": "hello world"
    }
    , GUIC["A53/2"]: {
        "label": "A53/2"
        , "onclick": "hello world"
    }
    , GUIC["A53/2_CLK"]: {
        "label": "clock"
        , "onclick": "hello world"
    }
    , GUIC["A53/3"]: {
        "label": "A53/3"
        , "onclick": "hello world"
    }
    , GUIC["A53/3_CLK"]: {
        "label": "clock"
        , "onclick": "hello world"
    }
    , GUIC["FPD_CLK"]: {
        "label": "clock"
        , "onclick": "hello world"
    }
    , GUIC["GPU"]: {
        "label": "GPU"
        , "onclick": "hello world"
    }
    , GUIC["GPU_CLK"]: {
        "label": "clock"
        , "onclick": "hello world"
    }
    , GUIC["DDR"]: {
        "label": "DRR"
        , "onclick": "hello world"
    }
    , GUIC["HS_PERF"]: {
        "label": "HS Periph"
        , "onclick": "hello world"
    }
    , GUIC["PLD_CLK1"]: {
        "label": "clock"
        , "onclick": "hello world"
    }
    , GUIC["PLD_CLK2"]: {
        "label": "clock"
        , "onclick": "hello world"
    }
    , GUIC["PLD_OPT"]: {
        "label": "Options"
        , "onclick": "hello world"
    }
}


button_groups = {
      "LPD 1": [ GUIC["R5/0"],GUIC["R5/0_CLK"],GUIC["R5/1"], GUIC["R5/1_CLK"], GUIC["LPD_CLK"]]
    , "LPD 2": [GUIC["TCM"], GUIC["OCM"], GUIC["PMU"], GUIC["CSU"], GUIC["LPD_PERF"]]
    , "FPD 1": [GUIC["A53/0"], GUIC["A53/0_CLK"], GUIC["A53/2"], GUIC["A53/2_CLK"]]
    , "FPD 2": [GUIC["A53/1"], GUIC["A53/1_CLK"], GUIC["A53/3"], GUIC["A53/3_CLK"]]
    , "FPD 3": [GUIC["GPU"], GUIC["GPU_CLK"]]
    , "FPD_CLK": [GUIC["FPD_CLK"]]
    , "PLD"  : [GUIC["PLD_CLK1"], GUIC["PLD_CLK2"]]
    , "PLD_option" : [GUIC["PLD_OPT"]]
    , "DDR"  : [GUIC["DDR"]]
    , "HS_periph": [GUIC["HS_PERF"]]
}
dutmapList = {
    "vek280": [GUIC["R5/0"], GUIC["R5/0_CLK"], GUIC["R5/1"], GUIC["R5/1_CLK"], GUIC["LPD_CLK"], GUIC["TCM"], GUIC["OCM"], GUIC["PMU"], GUIC["CSU"], GUIC["LPD_PERF"]
               , GUIC["A53/0"], GUIC["A53/0_CLK"], GUIC["A53/2"], GUIC["A53/2_CLK"], GUIC["A53/1"], GUIC["A53/1_CLK"], GUIC["A53/3"], GUIC["A53/3_CLK"]
               , GUIC["GPU"], GUIC["GPU_CLK"], GUIC["PLD_CLK1"], GUIC["PLD_CLK2"], GUIC["DDR"], GUIC["FPD_CLK"], GUIC["HS_PERF"], GUIC["PLD_OPT"]]

    , "vhk158": [GUIC["CSU"]]
    , "vpk180": []
    , "vpk120": []
}
def create_map_in(dev):
    maps = {}
    for i in dutmapList[dev]:
        maps[dutmapList[dev][i]] = GUI_list[dutmapList[dev][i]]
    return maps
