# Copyright (C) 2023 Advanced Micro Devices, Inc.  All rights reserved.
# SPDX-License-Identifier: BSD-3-Clause

from bokeh.io import curdoc
from bokeh.plotting import figure
from bokeh.layouts import column, row
from bokeh.models import Button, Div, CustomJS
from config import *
import sys
sys.path.insert(1, '/usr/share/raft/xclient/raft_services')
import pm_client

curdoc().title = app_tile
def button_click_handler():
    print("Button clicked!")
def click():
    print("helloworld")
Preset = Button (label=GUI_list[GUIC["PRESET"]]["label"], button_type="primary", margin=[15, 0, 0, 80], max_width=50)
Select = Button(label=GUI_list[GUIC["SELECT"]]["label"], button_type="primary", max_width=50, css_classes=["selBtn"])
buttons = []
title1 = Div(text="""
     <p style= "text-align:center; font-weight: bold;">Low <br> Power</p>
    """,
             width=55,
             margin=[0, 0, 0, 15])
title2 = Div(text="""
     <p style= "text-align:center; font-weight: bold;">Full Power <br> Domain</p>
    """,
             width=100,
             margin=[0, 0, 0, 35])
title3 = Div(text="""
     <p style= "text-align:center; font-weight: bold; margin-left:25px; ">Programmable <br>Logic Domain</p>
    """,
             margin=[0, 0, 0, 35])
BPD = Div(text = """
    <p style= "text-align:center; margin-left:35px; margin-right:6px; margin-top: 10px; font-weight: bold;">Batt Power <br> Domain</p>
""",
          width=135,
          height=60,
          margin=[5, 0, 0, 0])

def data_table(device_data):
    table = f"""
        <table style="color: green;max-width:100%;font-weight:bold;margin-left: 60px;">
            <tr>
                <th></th>
                <th style="width:150px;text-align:end">Voltage(V)</th>
                <th style="width:150px;text-align:end">Current(mA)</th>
                <th style="width:150px;text-align:end">Power(mW)</th>
            </tr>
    """
    for result in device_data.get("Rails", []):
        key = list(result.keys())[0]
        rail_data = result[key]
        table += f"""
            <tr>
                <th style="text-align:left">{key}</th>
                <td style="text-align:right">{rail_data.get("Voltage", 0)}</td>
                <td style="text-align:right">{rail_data.get("Current", 0)}</td>
                <td style="text-align:right">{rail_data.get("Power", 0)}</td>
            </tr>
        """
    table += """
        </table>
    """
    return table

def power_data():
    power_result = None
    try:
        handle = pm_client.pm
        data = handle.GetValuesAll()
        board = handle.GetBoardInfo()
        ps_temp = handle.GetPSTemperature()
        deviceName = board["Product Name"]
        device_data = data.get(deviceName)  
        if device_data:
            power_result = Div(text=f"""
                <p style="color: #88d992;font-size: large;">PS Temperature {ps_temp["Temperature Info"]["FPD Temp"]}°</p>
            """
                               )

            total_power = 0  
            for rail_data in device_data:
                Rail_name = list(rail_data.keys())[0]
                total_power_domain = rail_data[Rail_name].get("Total Power", 0)
                rail_data_table = data_table(rail_data[Rail_name])
                power_result.text += f"""
                <p class="powerResult">{Rail_name}<span style= "float:right">{total_power_domain} mW</span></p>
                {rail_data_table}
                """
                total_power += total_power_domain
            power_result.text += f"""
                <p class="powerResult">Total<span style= "float:right">{total_power} mW</span></p>
            """
            print(total_power)
            power_result.css_classes = ["clockdata"]
            power_result.margin = [50, 50, 0, 50]
    except Exception as e:
        print(f"An error occurred: {e}")
        power_result = Div(text="""
            <p style="color: #88d992;font-size: large;"> No Data Available </p>
        """, margin=[150, 300, 150, 300])
    return power_result

power_result=power_data()
def update_power_data():
    global power_result
    power_result = power_data()
    select_btn.children[1] = power_result

Preset.on_click(update_power_data)

# Create buttons based on GUI_array
enabled_buttons = set(dutmapList["buttons"])
def create_button_group(button_group_name, button_type, enabled_buttons):
    buttons = []
    for GUI_index in button_groups[button_group_name]:
        GUI_label = GUI_list[GUI_index]
        title = GUI_label["label"]
        button = Button(label=title, css_classes=['butn'],max_width=70)
        # button.on_click(button_click_handler)
        button.button_type = button_type
        button.max_width=10
        if GUI_index in enabled_buttons:
            # button.disabled= True
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


select_btn = row(Select,power_result, max_height=695)
table = column(select_btn,margin=[5, 10, 0, 10], css_classes=['Black_bg'], background="#303030")
low_power = column(Preset, column(title1, *LPD1, *LPD2, background="#95D4A2", margin=[10, 0, 0, 15], max_width=75, css_classes=['lowpower']))
full_power = column(title2, row(column(*FPD1), column(*FPD2, css_classes=['fullpower_clock'])), column(*FPD_CLK, margin=[0, 0, 0, 32]), row(column(*FPD3), column(*DDR, css_classes=['ddr_click'], margin=[0,0,0,45]), margin=[10, 0, 0, 0]),  column(*HS_PERF, margin=[0, 0, 0, 20]), background="#93A5D1", css_classes=['fullpower'])
batt_power = column(full_power, column(BPD, css_classes=['battpower']), margin=[55, 0, 0, -40])
programmable_domain = column(row(low_power, batt_power), column(title3, column(*PLD, css_classes=['pld_clock']), background="#E2BF7E", margin=[15, 0, 10, 15], width=210, height=130))
final_layout = row(programmable_domain, table, background="#939393", max_height=695)
curdoc().add_root(row(final_layout))



