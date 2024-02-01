# Copyright (C) 2024 Advanced Micro Devices, Inc.  All rights reserved.
# SPDX-License-Identifier: MIT


from bokeh.io import curdoc
from bokeh.layouts import column, row
from bokeh.models import Button, Div
from config import *

import sys
sys.path.insert(1, '/usr/share/raft/xclient/raft_services')
import pm_client

handle= pm_client.pm
data = handle.GetValuesAll()
curdoc().title = app_tile

deviceName = "vek280"
def button_click_handler():
    print("Button clicked!")
def click():
    print("helloworld")
Preset = Button (label=GUI_list[GUIC["PRESET"]]["label"], button_type="primary", margin=[15, 0, 0, 80], max_width=50)
Select = Button(label=GUI_list[GUIC["SELECT"]]["label"], button_type="primary", max_width=50, css_classes=["selBtn"])
buttons = []
title1 = Div(text="""
     <p style= "text-align:center;font-family: Roboto-Regular; font-weight: bold;">Low <br> Power</p>
    """,
             width=55,
             margin=[0, 0, 0, 15])
title2 = Div(text="""
     <p style= "text-align:center;font-family: Roboto-Regular; font-weight: bold;">Full Power <br> Domain</p>
    """,
             width=100,
             margin=[0, 0, 0, 35])
title3 = Div(text="""
     <p style= "text-align:center;font-family: Roboto-Regular; font-weight: bold; margin-left:25px; ">Programmable <br>Logic Domain</p>
    """,
             margin=[0, 0, 0, 35])
BPD = Div(text = """
    <p style= "text-align:center;font-family: Roboto-Regular; margin-left:35px; margin-right:6px; margin-top: 10px; font-weight: bold;">Batt Power <br> Domain</p>
""",
          width=135,
          height=60,
          margin=[5, 0, 0, 0])

FPD_data = """
<table style="color: green;max-width:100%;font-weight:bold;margin-left: 60px;">
    <tr>
        <th></th>
        <th style = "width:150px;text-align:end">Voltage(V)</th>
        <th style = "width:150px;text-align:end">Current(mA)</th>
        <th style = "width:150px;text-align:end">Power(mW)</th>
    </tr>
"""

for result in data["VCK190"][0]["FPD"]["Rails"]:
    FPD_data += f"""
    <tr>
        <th style="text-align:left">{list(result.keys())[0]}</th>
        <td style="text-align:right">{result[list(result.keys())[0]]["Voltage"]}</td>
        <td style="text-align:right">{result[list(result.keys())[0]]["Current"]}</td>
        <td style="text-align:right">{result[list(result.keys())[0]]["Power"]}</td>
    </tr>
    """

FPD_data += "</table>"
LPD_data = """
<table style="color: green;max-width:100%;font-weight:bold;margin-left: 60px;">
    <tr>
        <th></th>
        <th style = "width:150px;text-align:end">Voltage(V)</th>
        <th style = "width:150px;text-align:end">Current(mA)</th>
        <th style = "width:150px;text-align:end">Power(mW)</th>
    </tr>
"""

for result in data["VCK190"][1]["LPD"]["Rails"]:
    LPD_data += f"""
    <tr>
        <th style="text-align:left">{list(result.keys())[0]}</th>
        <td style="text-align:right">{result[list(result.keys())[0]]["Voltage"]}</td>
        <td style="text-align:right">{result[list(result.keys())[0]]["Current"]}</td>
        <td style="text-align:right">{result[list(result.keys())[0]]["Power"]}</td>
    </tr>
    """

LPD_data += "</table>"
PLD_data = """
<table style="color: green;max-width:100%;font-weight:bold;margin-left: 60px;">
    <tr>
        <th></th>
        <th style = "width:150px;text-align:end">Voltage(V)</th>
        <th style = "width:150px;text-align:end">Current(mA)</th>
        <th style = "width:150px;text-align:end">Power(mW)</th>
    </tr>
"""

for result in data["VCK190"][2]["PLD"]["Rails"]:
    PLD_data += f"""
    <tr>
        <th style="text-align:left">{list(result.keys())[0]}</th>
        <td style="text-align:right">{result[list(result.keys())[0]]["Voltage"]}</td>
        <td style="text-align:right">{result[list(result.keys())[0]]["Current"]}</td>
        <td style="text-align:right">{result[list(result.keys())[0]]["Power"]}</td>
    </tr>
    """

PLD_data += "</table>"
power_result = Div(text=f"""
    <p style="color:#88ad36;font-weight:bold;">PS Temperature 0.0°</p>
    <p class="powerResult">Full Power Domain<span style= "float:right">{data["VCK190"][0]["FPD"]["Total Power"]} mW</span></p>
    {FPD_data}
    <p class="powerResult">Low Power Domain<span style= "float:right">{data["VCK190"][1]["LPD"]["Total Power"]} mW</span></p>
    {LPD_data}
    <p class="powerResult">Prog Logic Domain<span style= "float:right">{data["VCK190"][2]["PLD"]["Total Power"]} mW</span></p>
    {PLD_data}
    <p class="powerResult">Total<span style= "float:right">0.0 mW</span></p>
""",
                   css_classes=["clockdata"],
		   margin=[50,50,0,50])

# Create buttons based on GUI_array
enabled_buttons = set(dutmapList[deviceName])
def create_button_group(button_group_name, button_type, enabled_buttons):
    buttons = []
    for GUI_index in button_groups[button_group_name]:
        GUI_label = GUI_list[GUI_index]
        title = GUI_label["label"]
        button = Button(label=title, css_classes=['butn'],max_width=70)
        button.on_click(button_click_handler)
        button.button_type = button_type
        button.max_width=10
        if GUI_index in enabled_buttons:
           # button.disabled = True
           buttons.append(button)
    return buttons

LPD1 = create_button_group("LPD 1", "danger", enabled_buttons)
LPD2 = create_button_group("LPD 2", "primary", enabled_buttons)
FPD1 = create_button_group("FPD 1", "primary", enabled_buttons)
FPD2 = create_button_group("FPD 2", "primary", enabled_buttons)
FPD3 = create_button_group("FPD 3", "warning", enabled_buttons)
DDR = create_button_group("DDR", "success", enabled_buttons)
FPD_CLK = create_button_group("FPD_CLK", "primary", enabled_buttons)
HS_PERF = create_button_group("HS_periph", "default", enabled_buttons)
PLD = create_button_group("PLD", "success", enabled_buttons)
PLD_OPT = create_button_group("PLD_option", "success", enabled_buttons)

select_btn = row(Select,power_result)
table = column(select_btn,margin=[5, 10, 0, 10], css_classes=['Black_bg'])
low_power = column(Preset, column(title1, *LPD1, *LPD2, background="#95D4A2", margin=[10, 0, 0, 15], max_width=75, css_classes=['lowpower']))
full_power = column(title2, row(column(*FPD1), column(*FPD2, css_classes=['fullpower_clock'])), column(*FPD_CLK, margin=[0, 0, 0, 32]), row(column(*FPD3), column(*DDR, css_classes=['ddr_clock']), margin=[10, 0, 0, 0]),  column(*HS_PERF, margin=[3, 0, 0, 20]), background="#93A5D1", css_classes=['fullpower'] )
batt_power = column(full_power,column(BPD, css_classes=['battpower']), margin=[53, 0, 0, -40])
programmable_domain = column(row(low_power, batt_power), column(title3, column(*PLD, css_classes=['pld_clock']), background="#E2BF7E", margin=[15, 0, 10, 15], width=210, height=130))
final_layout = row(programmable_domain, table, background="#939393")
curdoc().add_root(row(final_layout))


