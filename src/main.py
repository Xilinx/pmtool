# Copyright (C) 2024 Advanced Micro Devices, Inc.  All rights reserved.
# SPDX-License-Identifier: MIT

from bokeh.plotting import figure, output_file, show
from bokeh.models import Button, Div
from bokeh.core.enums import SizingMode
from bokeh.layouts import Column, Row, GridBox
from bokeh.io import curdoc
from config import *
import sys

sys.path.insert(1, '/usr/share/raft/xclient/raft_services')
import pm_client
curdoc().title = app_tile

Version = Div(text=f""" <p class="Version_info">{Version}</p> """)
BUTTON_WIDTH=70
def groupbuttons(domain_elements1,gridWidth=1):
    gridbox = GridBox()
    i = 0
    j = 0
    for button in domain_elements1:
        if button["type"] == TYPE_MAJOR_BUTTON:
            button = Button(label=button["title"],button_type=button["color"],margin=(10,10,0,10),width =BUTTON_WIDTH, disabled=True)
            # column = Column(column,button)
            gridbox.children.append((button, j, i))
        elif button["type"] == TYPE_MINOR_BUTTON:
            button2 = Button(label=button["title"],button_type=button["color"],margin=(5,10,0,10),width =BUTTON_WIDTH, disabled=True)
            # column = Column(column, button2  )
            gridbox.children.append((button2, j, i))
            i = i+1
        elif button["type"] == TYPE_CENTER_BUTTON:
            button2 = Button(label=button["title"],button_type=button["color"], margin=(5, 10, 0, -int(button2.width / 2) - 5), width=BUTTON_WIDTH, disabled=True)
            # column = Column(column, button2  )
            if i % 2 == 1:
                i = 0
                j += 1
            gridbox.children.append((button2, j, i + 1))
            i = i + 1
        elif button["type"] == TYPE_MAJMIN_COMBI_BUTTON:
            button = Button(label=button["title"],button_type=button["color"],margin=(10,10,0,10),width =BUTTON_WIDTH, disabled=True)
            button2 = Button(label="100%",button_type="warning",margin=(2,10,0,10),width =BUTTON_WIDTH, disabled=True)
            column = Column(button, button2)
            gridbox.children.append((column,j,i))
        elif button["type"] == TYPE_MAJMIN_COMBI_BUTTON_GRID:
            button = Button(label=button["title"],button_type=button["color"],margin=(10,10,0,10),width =BUTTON_WIDTH, disabled=True)
            button2 = Button(label="100%",button_type="primary",margin=(2,0,0,10),width =BUTTON_WIDTH, disabled=True)
            column2 = Column(button, button2)
            gridbox.children.append((column2,j,i))
        else:
            pass
        i = i + 1
        if i >= gridWidth:
            j = j + 1
            i = 0
    column = Column(gridbox,Column(Div(height=15)))
    return column
LPD = groupbuttons(domain_elements[0]["elements"])
Lowpower = Column(Column(Div(text=domain_elements[0]["group"],css_classes=["headings"]),width=80),LPD,background="#95D4A2", margin=(10,10,10,10))
FPD = groupbuttons(domain_elements[1]["elements"],2)
Fullpower = Column(Column(Div(text=domain_elements[1]["group"],css_classes=["headings"]),width=170),FPD,background="#93A5D1", margin=(10,10,0,0))
BPD = groupbuttons(domain_elements[2]["elements"])
Battpower = Column(Column(Div(text=domain_elements[2]["group"],css_classes=["headings"]),width=170),BPD,background="#E0DF9A", margin=(10,10,0,0), css_classes=["battpower"])
PLD = groupbuttons(domain_elements[3]["elements"],3)
Programmablelogic = Column(Column(Div(text=domain_elements[3]["group"],css_classes=["headings"]),width=250),PLD,background="#E2BF7E", margin=(0,10,0,10), css_classes=["programmablelogic"])


Preset = Button(label=default_buttons[0]["title"],button_type="primary",margin=(10,10,0,10),width =BUTTON_WIDTH, disabled = True,css_classes=["presetbtn"])
Select = Button(label=default_buttons[1]["title"],button_type="primary",margin=(10,10,0,10),width =BUTTON_WIDTH, disabled = True)

power_domains = Column(Column(Preset,Row(Lowpower,Column(Fullpower,Battpower)),Programmablelogic), css_classes=["all_domains"])


#power data
def data_table(device_data):
    table = f"""
        <table id="powerdata">
            <tr>
                <th></th>
                <th style="width:150px;text-align:end;color:#88d992;">Voltage</th>
                <th style="width:150px;text-align:end;color:#88d992;">Current</th>
                <th style="width:150px;text-align:end;color:#88d992;">Power</th>
            </tr>
             <tr>
                <td colspan="4" style="height:10px"></td>
            </tr>
    """
    for result in device_data.get("Rails"):
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
        <hr class="table_line">
    """
    return table

def power_data():
    power_result = None
    try:
        handle = pm_client.pm
        data = handle.GetValuesAll()
        board = handle.GetBoardInfo()
        total_power = handle.GetPowersAll()
        deviceName = board["Product Name"]
        device_data = data.get(deviceName)
        ps_temp_value = None
        try:
            ps_temp = handle.GetSysmonTemperatures()
            if "TEMP" in ps_temp:
                ps_temp_value = ps_temp["TEMP"]
        except Exception as e:
            print(f"An error occurred while getting system temperatures: {e}")
        if device_data:
            power_result = Div(text="")

            if ps_temp_value is not None:
                power_result.text += f"""
                                <p style="color: #88d992;font-size: large;">PS Temperature {ps_temp_value}° </p>
                            """
            for rail_data in device_data:
                Rail_name = list(rail_data.keys())[0]
                total_power_domain = rail_data[Rail_name].get("Total Power", 0)
                rail_data_table = data_table(rail_data[Rail_name])
                power_result.text += f"""
                <p class="powerResult">{Rail_name}<span style= "float:right">{total_power_domain} </span></p>
                {rail_data_table}
                """
            device_total_power = total_power.get(deviceName, {})
            total_power_name = list(device_total_power.keys())
            total_power_value = device_total_power.get("Total Power", "N/A")
            power_result.text += f"""
                <p class="powerResult">{total_power_name[1]}<span style= "float:right">{total_power_value}</span></p>
            """
            power_result.css_classes = ["clockdata"]
    except Exception as e:
        print(f"An error occurred: {e}")
        power_result = Div(text="""
            <p style="color: #88d992;font-size: large;"> No Data Available </p>
        """, margin=[150, 300, 150, 300])
    return power_result

power_result = power_data()

count_down = 6
count_down_label = Div(text="")

def update_power_data():
    new_power_result = power_data()
    power_result.text = new_power_result.text

def timer():
    global count_down
    global count_down_label
    if count_down <= 0:
        update_power_data()
        count_down = 5
    else:
        count_down -= 1
    if count_down == 0:
        count_down_label.text = f"<p class='timer' >updating in a moment...</p>"
    else:
        count_down_label.text = f"<p class='timer'>updating in {count_down} sec</p>"

timer()
curdoc().add_periodic_callback(timer, 1000)

sizing_mode = SizingMode.scale_both
right_part = Row(Column(Select,power_result),Version,count_down_label,css_classes=["black_bg"],sizing_mode=sizing_mode)
column3= Column(right_part,sizing_mode=sizing_mode,background="#303030")

# Add the column to the current document
curdoc().add_root(Row(power_domains,right_part, sizing_mode=sizing_mode))

