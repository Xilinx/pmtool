# Copyright (C) 2024 Advanced Micro Devices, Inc.  All rights reserved.
# SPDX-License-Identifier: MIT

from bokeh.plotting import figure, output_file, show
from bokeh.models import Button, Div, ColumnDataSource, Label, Legend, LegendItem, CustomJS
from bokeh.core.enums import SizingMode
from bokeh.layouts import Column, Row, GridBox
from bokeh.io import curdoc
from bokeh.events import ButtonClick

from config import *

from collections import deque
import sys
sys.path.insert(1, '/usr/share/raft/xclient/raft_services')

import pm_client
curdoc().title = app_tile

handle = pm_client.pm
board = handle.GetBoardInfo()
deviceName = board["Product Name"]

Version = Div(text=f""" <p class="Version_info">{Version}</p> """)
BUTTON_WIDTH=70

expand_buttons = {}

device_data = []
ps_temp_value = None
total_power = {}

REFRESH_TIME=4
count_down = REFRESH_TIME
color_list = ["darkseagreen", "steelblue", "indianred", "chocolate", "mediumpurple", "rosybrown", "gold",
              "mediumaquamarine", "green", "pink", "red", "blue", "white", "brown", "yellow", "orange"]

sample_size = 120
x = deque(range(sample_size), maxlen=sample_size)
pm_y = []

domain_names = []
domain_powers = []

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


def data_table(device_data):
    table = f"""
        <table id="powerdata">
            <tr>
                <th></th>
                <th style="width:150px;text-align:end;color:#88d992;">Voltage (V)</th>
                <th style="width:150px;text-align:end;color:#88d992;">Current (A)</th>
                <th style="width:150px;text-align:end;color:#88d992;">Power (W)</th>
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

def expandClicked(event):
    global expand_buttons
    btn_id = event._model_id
    btn = curdoc().get_model_by_id(btn_id)
    if btn is None:
        return
    if expand_buttons[btn.name] == "+":
        expand_buttons[btn.name] = "-"
    else:
        expand_buttons[btn.name] = "+"
    btn.label = expand_buttons[btn.name]
    update_power_data()
        
def read_device_data():
    global handle
    global deviceName
    global device_data
    global ps_temp_value
    global total_power
    data = handle.GetValuesAll()
    device_data = data.get(deviceName)
    total_power = handle.GetPowersAll()
    try:
        ps_temp = handle.GetSysmonTemperatures()
        if "TEMP" in ps_temp:
            ps_temp_value = ps_temp["TEMP"]
    except Exception as e:
        pass

def power_data():
    global device_data
    global ps_temp_value
    global deviceName
    global total_power
    result = Column(align="center",sizing_mode="scale_width")
    try:
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
                <p class="powerResult">{Rail_name}<span style= "float:right">{total_power_domain} W</span></p>
                {rail_data_table} 
                """

            device_total_power = total_power.get(deviceName, {})
            total_power_name = list(device_total_power.keys())
            total_power_value = device_total_power.get("Total Power", "N/A")
            power_result.text += f"""
                <p class="powerResult">{total_power_name[1]}<span style= "float:right">{total_power_value} W</span></p>
            """
            power_result.css_classes = ["clockdata"]
    except Exception as e:
        print(f"An error occurred: {e}")
        power_result = Div(text="""
            <p style="color: #88d992;font-size: large;"> No Data Available </p>
        """, margin=[150, 300, 150, 300])
    return power_result

def pm_graph():
    global domain_names, domain_powers, pm_y, x, sample_size
    global total_power, color_list

    power_domains = total_power.get(deviceName, {}).get("Power Domains", [])
    for domain in power_domains:
        domain_name = list(domain.keys())[0]
        domain_power = domain[domain_name]["Power"]
        domain_names.append(domain_name)
        domain_powers.append(deque([domain_power] * sample_size, maxlen=sample_size))

    pm_plot = figure( x_axis_label='seconds',y_axis_label='W', x_range=(0, sample_size), sizing_mode="stretch_width")
    legend_items = []
    for i, domain_name in enumerate(domain_names):
        source = ColumnDataSource(data={'x': list(x), 'y': list(domain_powers[i])})
        pm_y.append(source)
        line = pm_plot.line('x', 'y', source=source, line_width=2, color=color_list[i])
        legend_items.append(LegendItem(label=domain_name, renderers=[line]))

        # last_power = domain_powers[i][-1]
        # pm_plot.add_layout(Label(x=list(x)[-1], y=last_power, text=f'{domain_name}: {last_power} mW', text_align='left',
        #                           text_font_size='10px', text_color='white'))

    legend = Legend(items=legend_items, location="center")
    pm_plot.add_layout(legend, 'below')
    pm_plot.legend.orientation = "horizontal"
    pm_plot.legend.click_policy = "hide"
    # pm_plot.plot_width = 1200
    pm_plot.title.align = 'center'

    return pm_plot

def update_pm_graph():
    global x
    global total_power
    device_data = total_power.get(deviceName, {}).get("Power Domains", [])
    for i, domain_name in enumerate(domain_names):
        current_power = next(domain[domain_name]["Power"] for domain in device_data if domain_name in domain)
        domain_powers[i].append(current_power)

        pm_y[i].data = {'x': list(x), 'y': list(domain_powers[i])}
        pm_y[i].trigger('data', pm_y[i].data, pm_y[i].data)

        # plot.add_layout(Label(x=list(x)[-1], y=current_power, text=f'{domain_name}: {current_power} mW', text_align='left', text_font_size='10px', text_color='white'))

def flip():
    if plot.visible:
        plot.visible = False
        right_part.children[2].visible = True
        Select.label = "Switch to Graph"
    else:
        plot.visible = True
        right_part.children[2].visible = False
        Select.label = "Switch to Domains Info"

def update_power_data():
    if not plot.visible:
        right_part.children[2] = power_data() 
    else:
        pass
def timer():
    global count_down
    global count_down_label
    read_device_data()
    update_pm_graph()
    if count_down <= 0:
        update_power_data()
        count_down = REFRESH_TIME
    else:
        count_down -= 1
    # if count_down == 0:
    #     count_down_label.text = f"<p class='timer' >updating in a moment...</p>"
    # else:
    #     count_down_label.text = f"<p class='timer'>updating in {count_down} sec</p>"



LPD = groupbuttons(domain_elements[0]["elements"])
Lowpower = Column(Column(Div(text=domain_elements[0]["group"],css_classes=["headings"]),width=80),LPD,background="#95D4A2", margin=(10,10,10,10))
FPD = groupbuttons(domain_elements[1]["elements"],2)
Fullpower = Column(Column(Div(text=domain_elements[1]["group"],css_classes=["headings"]),width=170),FPD,background="#93A5D1", margin=(10,10,0,0))
BPD = groupbuttons(domain_elements[2]["elements"])
Battpower = Column(Column(Div(text=domain_elements[2]["group"],css_classes=["headings"]),width=170),BPD,background="#E0DF9A", margin=(10,10,0,0), css_classes=["battpower"])
PLD = groupbuttons(domain_elements[3]["elements"],3)
Programmablelogic = Column(Column(Div(text=domain_elements[3]["group"],css_classes=["headings"]),width=250),PLD,background="#E2BF7E", margin=(0,10,0,10), css_classes=["programmablelogic"])


Preset = Button(label=default_buttons[0]["title"],button_type="primary",margin=(10,10,0,10),width =BUTTON_WIDTH, disabled = True,css_classes=["presetbtn"])
Select = Button(label=default_buttons[1]["title"],button_type="primary",margin=(10,10,40,10),width =BUTTON_WIDTH)

power_domains = Column(Column(Preset,Row(Lowpower,Column(Fullpower,Battpower)),Programmablelogic), css_classes=["all_domains"])

read_device_data()

power_result = power_data()
count_down_label = Div(text="")

plot = pm_graph()
plot.css_classes = ['pmgraph']

domainInfo=Column(sizing_mode="stretch_width")
domainInfo.children.append(power_result)

#right_part = Row(Column(Select,power_result,plot),Version,count_down_label,css_classes=["graph_bg"])
right_part = Column(Select,plot, power_result, Version, sizing_mode="stretch_width")
right_part.css_classes =["black_bg"]

flip()
Select.on_click(flip)

timer()
curdoc().add_periodic_callback(timer, 1000)

curdoc().theme = 'dark_minimal'
curdoc().add_root(right_part)

