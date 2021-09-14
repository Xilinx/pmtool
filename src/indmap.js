/*
* Copyright (c) 2021, Xilinx Inc. and Contributors. All rights reserved.
*
* SPDX-License-Identifier: MIT
*/

// Function to create similar to ENUM from list
function Enum(lst){
    di = {};
    for (ke in lst){
      di[lst[ke]] = ke;
    }
    return di;
}
// Function to convert bit range to hex value
// eg. 1:0 -> 0b11
function bitToAddress(biten){
    var sp = (""+biten).trim().split(":");
    var ad = 0x0;
    if (sp.length == 1){
        sp.push(sp[0]);
    }
    for(var i = parseInt(sp[1]); i <= parseInt(sp[0]); i++){
        ad = ad | (1 << i);
    }

    return ad;
}
/* Function returns value present in particular bits
*       eg: 0b110, 2:1
*       returns 0b11
*       val : input hex value
*       biten: string of bits range eg.1:0
*/
function valAt(val, biten){
        var resp = val & bitToAddress(biten)
        var sp = (""+biten).trim().split(":")
        return resp >> parseInt(sp[sp.length-1])
}
// GUI components
var gc_array = [
"close","PRESET","SAMPLE"
,"R5","R5_PERF","R5_CLK","TCM","OCM","R5_PERF","XRAM","GEM","LP_PERPH"
,"A72","A72_PERF","A72_CLK","L2","FP_PERPH"
,"NoC","NOC_PERF","NOC_CLK","DDR","DDR_PERF","DDR_CLK"
,"PMC","PMC_PERF","PMC_CLK","PD_PERPH"
,"AIE", "GTY","HARD_IP"
,"OPTIONS_PERF","OPTIONS_CLK","OPTIONS","INFO"
,"PLLS"
];
var GUIC = Enum(gc_array);

// GUI Type KEYS
var gks = ["none","popups","label","valuelabel","checkbox","textfield","dropdown","calllocalfn","callextfnstrname"
        ,"registers_set_exception","heading","clockspopup","registers_set_on_off_exception"

        ];
var GUI_KEYS = Enum(gks);

// xsdb targets list
var XSDBTARGETSLIST = {
    "TARGET00": "Versal"
    ,"TARGET01": "RPU"
    ,"TARGET02": "APU"
};

// reg db
// title, address, bits and its names
var REG_DB = {
   "REQ_PWRUP_TRIG":{
      "FP":"22",
      "GEM0":"21",
      "GEM1":"20",
      "OCM_Bank3":"19",
      "OCM_Bank2":"18",
      "OCM_Bank1":"17",
      "OCM_Bank0":"16",
      "TCM1B":"15",
      "TCM1A":"14",
      "TCM0B":"13",
      "TCM0A":"12",
      "RPU":"10",
      "L2_Bank0":" 7",
      "ACPU1":" 1",
      "ACPU0":" 0",
      "Absolute_Address":"0x00FFC90120"
   },
   "REQ_PWRDWN_TRIG":{
      "FP":"22",
      "GEM0":"21",
      "GEM1":"20",
      "OCM_Bank3":"19",
      "OCM_Bank2":"18",
      "OCM_Bank1":"17",
      "OCM_Bank0":"16",
      "TCM1B":"15",
      "TCM1A":"14",
      "TCM0B":"13",
      "TCM0A":"12",
      "RPU":"10",
      "L2_Bank0":" 7",
      "ACPU1":" 1",
      "ACPU0":" 0",
      "Absolute_Address":"0x00FFC90220"
   },
   "PWRCTL":{
      "CLREXMONREQ":"17",
      "L2FLUSHREQ":"16",
      "CPUPWRDWNREQ":" 1:0",
      "Absolute_Address":"0x00FD5C0090"
   },
   "PWRSTAT":{
      "CLREXMONACK":"17",
      "L2FLUSHDONE":"16",
      "DBGNOPWRDWN":" 1:0",
      "Absolute_Address":"0x00FD5C0094"
   },
   "PWR_SUPPLY_STATUS":{
      "VCC_RAM":" 7",
      "VCCINT":" 6",
      "VCCAUX_SOC":" 5",
      "VCC_SOC":" 4",
      "VCC_LPD":" 3",
      "VCC_FPD":" 2",
      "VCC_PMC":" 1",
      "VCCAUX_PMC":" 0",
      "Absolute_Address":"0x00F111010C"
   },
   "DDR_RETENTION_CTRL":{
      "value":" 0",
      "Absolute_Address":"0x00F1110324"
   },
   "USB_PwrState":{
      "u2pmu":" 1:0",
      "Absolute_Address":"0x00F1060600"
   },
   "APU_PWR_STATUS_INIT":{
      "ACPU1":" 1",
      "ACPU0":" 0",
      "Absolute_Address":"0x00FFC90008"
   },
   "PWR_STATE":{
      "FP":"22",
      "GEM0":"21",
      "GEM1":"20",
      "OCM_Bank3":"19",
      "OCM_Bank2":"18",
      "OCM_Bank1":"17",
      "OCM_Bank0":"16",
      "TCM1B":"15",
      "TCM1A":"14",
      "TCM0B":"13",
      "TCM0A":"12",
      "R5_1":"11",
      "R5_0":"10",
      "L2_Bank0":" 7",
      "ACPU1":" 1",
      "ACPU0":" 0",
      "Absolute_Address":"0x00FFC90100"
   },
   "AUX_PWR_STATE":{
      "ACPU1_Emulation":"29",
      "ACPU0_Emulation":"28",
      "RPU_Emulation":"27",
      "OCM_Bank3":"19",
      "OCM_Bank2":"18",
      "OCM_Bank1":"17",
      "OCM_Bank0":"16",
      "TCM1B":"15",
      "TCM1A":"14",
      "TCM0B":"13",
      "TCM0A":"12",
      "L2_Bank0":" 7",
      "Absolute_Address":"0x00FFC90104"
   },
   "APU0_PWR_CTRL":{
      "Isolation":" 4",
      "Pwr_Gates":" 3:0",
      "Absolute_Address":"0x00FFC88000"
   },
   "APU0_PWR_STATUS":{
      "Pwr_Gates":" 3:0",
      "Absolute_Address":"0x00FFC88004"
   },
   "APU1_PWR_CTRL":{
      "Isolation":" 4",
      "Pwr_Gates":" 3:0",
      "Absolute_Address":"0x00FFC88010"
   },
   "APU1_PWR_STATUS":{
      "Pwr_Gates":" 3:0",
      "Absolute_Address":"0x00FFC88014"
   },
   "RPU_PWR_CTRL":{
      "Isolation":" 4",
      "Pwr_Gates":" 3:0",
      "Absolute_Address":"0x00FFC88080"
   },
   "RPU_PWR_STATUS":{
      "Pwr_Gates":" 3:0",
      "Absolute_Address":"0x00FFC88084"
   },
   "L2_PWR_CTRL":{
      "Bank0":" 0",
      "Absolute_Address":"0x00FFC880B0"
   },
   "L2_PWR_STATUS":{
      "Bank0":" 0",
      "Absolute_Address":"0x00FFC880BC"
   },
   "OCM_PWR_CTRL":{
      "Bank3":"24",
      "Bank2":"16",
      "Bank1":" 8",
      "Bank0":" 0",
      "Absolute_Address":"0x00FFC880C0"
   },
   "OCM_PWR_STATUS":{
      "Bank3":"24",
      "Bank2":"16",
      "Bank1":" 8",
      "Bank0":" 0",
      "Absolute_Address":"0x00FFC880CC"
   },
   "TCM_PWR_CTRL":{
      "TCMB1":"24",
      "TCMA1":"16",
      "TCMB0":" 8",
      "TCMA0":" 0",
      "Absolute_Address":"0x00FFC880D0"
   },
   "TCM_PWR_STATUS":{
      "TCMB1":"24",
      "TCMA1":"16",
      "TCMB0":" 8",
      "TCMA0":" 0",
      "Absolute_Address":"0x00FFC880DC"
   },
   "GEM_PWR_CTRL":{
      "GEM1":" 8",
      "GEM0":" 0",
      "Absolute_Address":"0x00FFC880E0"
   },
   "GEM_PWR_STATUS":{
      "GEM1":" 8",
      "GEM0":" 0",
      "Absolute_Address":"0x00FFC880E8"
   },
   "RPU0_PWRDWN":{
      "EN":" 0",
      "Absolute_Address":"0x00FF9A0108"
   },
   "RPU1_PWRDWN":{
      "EN":" 0",
      "Absolute_Address":"0x00FF9A0208"
   },
   "PWR_UP_BANK0":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951100"
   },
   "PWR_DOWN_BANK0":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951104"
   },
   "PWR_STATUS_BANK0":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951108"
   },
   "PWR_UP_BANK1":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951110"
   },
   "PWR_DOWN_BANK1":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951114"
   },
   "PWR_STATUS_BANK1":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951118"
   },
   "PWR_UP_BANK2":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951120"
   },
   "PWR_DOWN_BANK2":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951124"
   },
   "PWR_STATUS_BANK2":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951128"
   },
   "PWR_UP_BANK3":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951130"
   },
   "PWR_DOWN_BANK3":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951134"
   },
   "PWR_STATUS_BANK3":{
      "I3":" 3",
      "I2":" 2",
      "I1":" 1",
      "I0":" 0",
      "Absolute_Address":"0x00FF951138"
   },
   "CPLL_CTRL":{
      "POST_SRC":"26:24",
      "PRE_SRC":"22:20",
      "FBDIV":"15:8",
      "BYPASS":" 3",
      "RESET":" 0",
      "Absolute_Address":"0x00FCA00040"
   },
   "APLL_CTRL":{
      "POST_SRC":"26:24",
      "PRE_SRC":"22:20",
      "CLKOUTDIV":"17:16",
      "FBDIV":"15:8",
      "BYPASS":" 3",
      "RESET":" 0",
      "Absolute_Address":"0x00FD1A0040"
   },
   "RPLL_CTRL":{
      "POST_SRC":"26:24",
      "PRE_SRC":"22:20",
      "CLKOUTDIV":"17:16",
      "FBDIV":"15:8",
      "BYPASS":" 3",
      "RESET":" 0",
      "Absolute_Address":"0xFF5E0040"
   },
   "PMCPLL_CTRL":{
      "Post_Src":"26:24",
      "Pre_Src":"22:20",
      "ClkOutDiv":"17:16",
      "FBDiv":"15:8",
      "Bypass":" 3",
      "Reset":" 0",
      "Absolute_Address":"0x00F1260040"
   },
   "NOCPLL_CTRL":{
      "Post_Src":"26:24",
      "Pre_Src":"22:20",
      "ClkOutDiv":"17:16",
      "FBDiv":"15:8",
      "Bypass":" 3",
      "Reset":" 0",
      "Absolute_Address":"0xF1260050"
   },
   "APU_CLK_CTRL":{
      "CLKACT":"25",
      "DIVISOR":"17:8",
      "SRCSEL":" 2:0",
      "Absolute_Address":"0x00FD1A010C"
   },
   "PMC_PL0_REF_CTRL":{
      "ClkAct":"24",
      "Divisor":"17:8",
      "SrcSel":" 2:0",
      "Absolute_Address":"0x00F12605C0"
   },
   "PMC_PL1_REF_CTRL":{
      "ClkAct":"24",
      "Divisor":"17:8",
      "SrcSel":" 2:0",
      "Absolute_Address":"0x00F12605C4"
   },
   "REQ_PWRUP_INT_EN": {
        "Absolute_Address": "0xFFC90118",
        "reserved": "6:2",
        "FP": "22",
        "GEM0": "21",
        "GEM1": "20",
        "OCM_Bank3": "19",
        "OCM_Bank2": "18",
        "OCM_Bank1": "17",
        "OCM_Bank0": "16",
        "TCM1B": "15",
        "TCM1A": "14",
        "TCM0B": "13",
        "TCM0A": "12",
        "RPU": "10",
        "L2_Bank0": "7",
        "ACPU1": "1",
        "ACPU0": "0"
      },
   "REQ_PWRUP_TRIG": {
        "Absolute_Address": "0xFFC90120",
        "reserved": "6:2",
        "FP": "22",
        "GEM0": "21",
        "GEM1": "20",
        "OCM_Bank3": "19",
        "OCM_Bank2": "18",
        "OCM_Bank1": "17",
        "OCM_Bank0": "16",
        "TCM1B": "15",
        "TCM1A": "14",
        "TCM0B": "13",
        "TCM0A": "12",
        "RPU": "10",
        "L2_Bank0": "7",
        "ACPU1": "1",
        "ACPU0": "0"
      },
      "PWR_STATE": {
        "Absolute_Address": "0xFFC90100",
        "reserved": "6:2",
        "FP": "22",
        "GEM0": "21",
        "GEM1": "20",
        "OCM_Bank3": "19",
        "OCM_Bank2": "18",
        "OCM_Bank1": "17",
        "OCM_Bank0": "16",
        "TCM1B": "15",
        "TCM1A": "14",
        "TCM0B": "13",
        "TCM0A": "12",
        "R5_1": "11",
        "R5_0": "10",
        "L2_Bank0": "7",
        "ACPU1": "1",
        "ACPU0": "0"
      },
      "REQ_PWRDWN_INT_EN": {
        "Absolute_Address": "0xFFC90218",
        "reserved": "6:2",
        "FP": "22",
        "GEM0": "21",
        "GEM1": "20",
        "OCM_Bank3": "19",
        "OCM_Bank2": "18",
        "OCM_Bank1": "17",
        "OCM_Bank0": "16",
        "TCM1B": "15",
        "TCM1A": "14",
        "TCM0B": "13",
        "TCM0A": "12",
        "RPU": "10",
        "L2_Bank0": "7",
        "ACPU1": "1",
        "ACPU0": "0"
      },
      "REQ_PWRDWN_TRIG": {
        "Absolute_Address": "0xFFC90220",
        "reserved": "6:2",
        "FP": "22",
        "GEM0": "21",
        "GEM1": "20",
        "OCM_Bank3": "19",
        "OCM_Bank2": "18",
        "OCM_Bank1": "17",
        "OCM_Bank0": "16",
        "TCM1B": "15",
        "TCM1A": "14",
        "TCM0B": "13",
        "TCM0A": "12",
        "RPU": "10",
        "L2_Bank0": "7",
        "ACPU1": "1",
        "ACPU0": "0"
      },
      "CPU_R5_CTRL": {
        "Absolute_Address": "0xFF5E010C",
        "reserved": "7:3",
        "CLKACT_OCM2": "28",
        "CLKACT_OCM": "27",
        "CLKACT_CORE": "26",
        "CLKACT": "25",
        "DIVISOR0": "17:8",
        "SRCSEL": "2:0"
      },
      "ACPU_CTRL": {
        "Absolute_Address": "0xFD1A010C",
        "reserved": "7:3",
        "CLKACT": "25",
        "DIVISOR0": "17:8",
        "SRCSEL": "2:0"
      },
      "DDR_RETENTION": {
        "Absolute_Address": "0xF1110324",
        "value": "0"
      },
      "PWR_SUPPLY_STATUS": {
        "Absolute_Address": "0xF111010C",
        "reserved": "31:8",
        "VCCINT_RAM": "7",
        "VCCINT_PL": "6",
        "VCCAUX": "5",
        "VCCINT_SOC": "4",
        "VCCINT_LPD": "3",
        "VCCINT_FPD": "2",
        "VCCINT_PMC": "1",
        "VCCAUX_PMC": "0"
      },
      "cur_pwr_st": {
        "Absolute_Address": "0xF1060600",
        "reserved": "31:2",
        "u2pmu": "1:0"
      },
      "PMCPLL_CTRL": {
        "Absolute_Address": "0xF1260040",
        "reserved": "2:1",
        "POST_SRC": "26:24",
        "PRE_SRC": "22:20",
        "CLKOUTDIV": "17:16",
        "FBDIV": "15:8",
        "BYPASS": "3",
        "RESET": "0"
      },
      "PMC_PL0_REF_CTRL": {
        "Absolute_Address": "0xF12605C0",
        "reserved": "7:3",
        "CLKACT": "24",
        "DIVISOR0": "17:8",
        "SRCSEL": "2:0"
      },
      "PMC_PL1_REF_CTRL": {
        "Absolute_Address": "0xF12605C4",
        "reserved": "7:3",
        "CLKACT": "24",
        "DIVISOR0": "17:8",
        "SRCSEL": "2:0"
      },
      'APLL_CTRL': {'Absolute_Address': '0xFD1A0040', 'reserved': '2:1', 'POST_SRC': '26:24', 'PRE_SRC': '22:20', 'CLKOUTDIV': '17:16', 'FBDIV': '15:8', 'BYPASS': '3', 'RESET': '0'},
      'CPU_R5_CTRL': {'Absolute_Address': '0xFF5E010C', 'reserved': '7:3', 'CLKACT_OCM2': '28', 'CLKACT_OCM': '27',
                       'CLKACT_CORE': '26', 'CLKACT': '25', 'DIVISOR0': '17:8', 'SRCSEL': '2:0',
                       'DIVISOR0_TXT_RANGE':'0-1023',
                       'SRCSEL_DD_LIST':[[0b000,0b001,0b011],['PPLL','RPLL','NPLL'],['REG_DB.PMCPLL_CTRL','REG_DB.RPLL_CTRL','REG_DB.NOCPLL_CTRL']]}
};
// index of buttons and action elements
var a_indexes = {
     [GUIC.PRESET] :    [52,126,168,175]
     ,[GUIC.SAMPLE] :   [186,126,303,175]


    ,[GUIC.R5] :        [68, 278, 158, 321]
    ,[GUIC.R5_PERF] :   [68, 326, 158, 369]
    ,[GUIC.R5_CLK] :    [68, 375, 158, 418]
    ,[GUIC.TCM] :       [68, 424, 158, 467]
    ,[GUIC.OCM] :       [68, 472, 158, 515]
    ,[GUIC.XRAM] :      [68, 522, 158, 564]
    ,[GUIC.GEM] :       [68, 571, 158, 613]
    ,[GUIC.LP_PERPH] :  [68, 619, 158, 664] // 662

    ,[GUIC.A72] :       [195, 278, 285, 321]
    ,[GUIC.A72_PERF] :  [195, 326, 285, 370]
    ,[GUIC.A72_CLK] :   [195, 375, 285, 419]
    ,[GUIC.L2] :        [195, 424, 285, 468]
    ,[GUIC.FP_PERPH] :  [195, 475, 285, 519]

    ,[GUIC.NoC] :       [328, 278, 418, 321]
    ,[GUIC.NOC_PERF] :  [328, 326, 418, 369]
    ,[GUIC.NOC_CLK] :   [328, 375, 418, 419]
    ,[GUIC.DDR] :       [328, 424, 418, 467]
    ,[GUIC.DDR_PERF] :  [328, 472, 418, 515]
    ,[GUIC.DDR_CLK] :   [328, 522, 418, 566]

    ,[GUIC.PMC] :       [195, 615, 285, 658]
    ,[GUIC.PMC_PERF] :  [195, 663, 285, 706]
    ,[GUIC.PMC_CLK] :   [195, 712, 285, 756]
    ,[GUIC.PD_PERPH] :  [195, 762, 285, 807]

    ,[GUIC.AIE] :       [328, 636, 418, 679]
    ,[GUIC.GTY] :       [328, 686, 418, 730]
    ,[GUIC.HARD_IP] :   [328, 734, 418, 781]

    ,[GUIC.OPTIONS_PERF]:[66, 845, 158, 889]
    ,[GUIC.OPTIONS_CLK]:[66, 893, 158, 939]
    ,[GUIC.OPTIONS] :   [285, 845, 376, 891]
    ,[GUIC.INFO] :      [382, 845, 422, 891]

};
// mapping of action elements and registers
var mappinCommon = {
    [GUIC.PRESET] : {
        "title" : "Preset"
        ,"onclick" : [GUI_KEYS.calllocalfn]
        ,"func" : function(){}
         ,"elems" : []
         }
    ,[GUIC.SAMPLE] : {
        "title" : "Sample"
        ,"onclick" : [GUI_KEYS.callextfnstrname]
        ,"func" : "sampleClicked"
         ,"elems" : []
         }
    ,[GUIC.R5] : {
        "title" : "R5 x2"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "R5"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATE.R5_0   //TODO :: To change single bit read to multiple bit read as R%/1 and R5/2.
            ,"getaddress": REG_DB.PWR_STATE.Absolute_Address
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.RPU,REG_DB.REQ_PWRUP_TRIG.RPU]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.RPU,REG_DB.REQ_PWRDWN_TRIG.RPU]
            ,"setaddress_off": [REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ]
    }
    ,[GUIC.TCM] : {     // All the 4 bits has to be enabled once or disabled once..
    // for TCM power down other TCMs need to be power down means tcm0a, tcm0b, tcm1a, tcm1b all needs to power down then only actual power down will happen
        "title" : "TCM x4"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "TCM"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATE.TCM0A
            ,"getaddress": REG_DB.PWR_STATE.Absolute_Address
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.TCM1B+":"+REG_DB.REQ_PWRUP_INT_EN.TCM0A,REG_DB.REQ_PWRUP_TRIG.TCM1B+":"+REG_DB.REQ_PWRUP_TRIG.TCM0A]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.TCM1B+":"+REG_DB.REQ_PWRDWN_INT_EN.TCM0A,REG_DB.REQ_PWRDWN_TRIG.TCM1B+":"+REG_DB.REQ_PWRDWN_TRIG.TCM0A]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        /*,{
            "title" : "TCMA/1"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATE.TCM1A
            ,"getaddress":REG_DB.PWR_STATE.Absolute_Address
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.TCM1A,REG_DB.REQ_PWRUP_TRIG.TCM1A]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.TCM1A,REG_DB.REQ_PWRDWN_TRIG.TCM1A]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ,{
            "title" : "TCMB/0"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATE.TCM0B
            ,"getaddress": REG_DB.PWR_STATE.Absolute_Address
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.TCM0B,REG_DB.REQ_PWRUP_TRIG.TCM0B]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.TCM0B,REG_DB.REQ_PWRDWN_TRIG.TCM0B]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ,{
            "title" : "TCMB/1"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATE.TCM1B
            ,"getaddress":REG_DB.PWR_STATE.Absolute_Address
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.TCM1B,REG_DB.REQ_PWRUP_TRIG.TCM1B]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.TCM1B,REG_DB.REQ_PWRDWN_TRIG.TCM1B]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }*/
        ]
    }
    /* // Currently OCM power up/down feature is disabled in psm so it will not work for bit 16-19
    ,[GUIC.OCM] : {
        "title" : "OCM x4"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "Bank 0"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATE.OCM_Bank0
            ,"getaddress": REG_DB.PWR_STATE.Absolute_Address
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.OCM_Bank0,REG_DB.REQ_PWRUP_TRIG.OCM_Bank0]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.OCM_Bank0,REG_DB.REQ_PWRDWN_TRIG.OCM_Bank0]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 1"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATE.OCM_Bank1
            ,"getaddress":REG_DB.PWR_STATE.Absolute_Address
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.OCM_Bank1,REG_DB.REQ_PWRUP_TRIG.OCM_Bank1]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.OCM_Bank1,REG_DB.REQ_PWRDWN_TRIG.OCM_Bank1]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 2"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATE.OCM_Bank2
            ,"getaddress": REG_DB.PWR_STATE.Absolute_Address
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.OCM_Bank2,REG_DB.REQ_PWRUP_TRIG.OCM_Bank2]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.OCM_Bank2,REG_DB.REQ_PWRDWN_TRIG.OCM_Bank2]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 3"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATE.OCM_Bank3
            ,"getaddress":REG_DB.PWR_STATE.Absolute_Address
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.OCM_Bank3,REG_DB.REQ_PWRUP_TRIG.OCM_Bank3]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.OCM_Bank3,REG_DB.REQ_PWRDWN_TRIG.OCM_Bank3]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ]
    }*/
    /*VCK190 and VMK180 has no XRAM */
    /*,[GUIC.XRAM] : {
        "title" : "XRAM x16"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "Bank 0 - Island 0"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK0.I0
            ,"getaddress": REG_DB.PWR_STATUS_BANK0.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK0.I0
            ,"setaddress_on": REG_DB.PWR_UP_BANK0.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK0.I0
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK0.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 0 - Island 1"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK0.I1
            ,"getaddress": REG_DB.PWR_STATUS_BANK0.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK0.I1
            ,"setaddress_on": REG_DB.PWR_UP_BANK0.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK0.I1
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK0.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 0 - Island 2"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK0.I2
            ,"getaddress": REG_DB.PWR_STATUS_BANK0.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK0.I2
            ,"setaddress_on": REG_DB.PWR_UP_BANK0.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK0.I2
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK0.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 0 - Island 3"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK0.I3
            ,"getaddress": REG_DB.PWR_STATUS_BANK0.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK0.I3
            ,"setaddress_on": REG_DB.PWR_UP_BANK0.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK0.I3
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK0.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 1 - Island 0"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK1.I0
            ,"getaddress": REG_DB.PWR_STATUS_BANK1.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK1.I0
            ,"setaddress_on": REG_DB.PWR_UP_BANK1.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK1.I0
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK1.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 1 - Island 1"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK1.I1
            ,"getaddress": REG_DB.PWR_STATUS_BANK1.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK1.I1
            ,"setaddress_on": REG_DB.PWR_UP_BANK1.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK1.I1
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK1.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 1 - Island 2"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK1.I2
            ,"getaddress": REG_DB.PWR_STATUS_BANK1.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK1.I2
            ,"setaddress_on": REG_DB.PWR_UP_BANK1.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK1.I2
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK1.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 1 - Island 3"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK1.I3
            ,"getaddress": REG_DB.PWR_STATUS_BANK1.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK1.I3
            ,"setaddress_on": REG_DB.PWR_UP_BANK1.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK1.I3
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK1.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 2 - Island 0"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK2.I0
            ,"getaddress": REG_DB.PWR_STATUS_BANK2.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK2.I0
            ,"setaddress_on": REG_DB.PWR_UP_BANK2.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK2.I0
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK2.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 2 - Island 1"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK2.I1
            ,"getaddress": REG_DB.PWR_STATUS_BANK2.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK2.I1
            ,"setaddress_on": REG_DB.PWR_UP_BANK2.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK2.I1
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK2.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 2 - Island 2"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK2.I2
            ,"getaddress": REG_DB.PWR_STATUS_BANK2.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK2.I2
            ,"setaddress_on": REG_DB.PWR_UP_BANK2.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK2.I2
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK2.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 2 - Island 3"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK2.I3
            ,"getaddress": REG_DB.PWR_STATUS_BANK2.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK2.I3
            ,"setaddress_on": REG_DB.PWR_UP_BANK2.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK2.I3
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK2.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 3 - Island 0"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK3.I0
            ,"getaddress": REG_DB.PWR_STATUS_BANK3.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK3.I0
            ,"setaddress_on": REG_DB.PWR_UP_BANK3.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK3.I0
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK3.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 3 - Island 1"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK3.I1
            ,"getaddress": REG_DB.PWR_STATUS_BANK3.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK3.I1
            ,"setaddress_on": REG_DB.PWR_UP_BANK3.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK3.I1
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK3.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 3 - Island 2"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK3.I2
            ,"getaddress": REG_DB.PWR_STATUS_BANK3.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK3.I2
            ,"setaddress_on": REG_DB.PWR_UP_BANK3.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK3.I2
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK3.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 3 - Island 3"
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.PWR_STATUS_BANK3.I3
            ,"getaddress": REG_DB.PWR_STATUS_BANK3.Absolute_Address
            ,"setbit_on":REG_DB.PWR_UP_BANK3.I3
            ,"setaddress_on": REG_DB.PWR_UP_BANK3.Absolute_Address
            ,"setbit_off":REG_DB.PWR_DOWN_BANK3.I3
            ,"setaddress_off": REG_DB.PWR_DOWN_BANK3.Absolute_Address
            ,"calc": function(adr){}
        }
        ]
    }*/
    ,[GUIC.GEM] : {
        "title" : "GEM x2"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "GEM 0"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.PWR_STATE.GEM0
            ,"getaddress": REG_DB.PWR_STATE.Absolute_Address
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.GEM0,REG_DB.REQ_PWRUP_TRIG.GEM0]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.GEM0,REG_DB.REQ_PWRDWN_TRIG.GEM0]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ,{
            "title" : "GEM 1"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.PWR_STATE.GEM1
            ,"getaddress": REG_DB.PWR_STATE.Absolute_Address
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.GEM1,REG_DB.REQ_PWRUP_TRIG.GEM1]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.GEM1,REG_DB.REQ_PWRDWN_TRIG.GEM1]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ]
    }
    ,[GUIC.A72] : {
        "title" : "A72 x2"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [
        {
            "title" : "APU 0"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.PWR_STATE.ACPU0
            ,"getaddress": REG_DB.PWR_STATE.Absolute_Address
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.ACPU0,REG_DB.REQ_PWRUP_TRIG.ACPU0]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.ACPU0,REG_DB.REQ_PWRDWN_TRIG.ACPU0]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ,{
            "title" : "APU 1"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.PWR_STATE.ACPU1
            ,"getaddress": REG_DB.PWR_STATE.Absolute_Address
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.ACPU1,REG_DB.REQ_PWRUP_TRIG.ACPU1]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.ACPU1,REG_DB.REQ_PWRDWN_TRIG.ACPU1]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ]
    }
    ,[GUIC.L2] : {
        "title" : "L2 x2"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "Bank 0"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.PWR_STATE.L2_Bank0
            ,"getaddress": REG_DB.PWR_STATE.Absolute_Address
            ,[GUI_KEYS.registers_set_exception] : 1
            ,"setbit_on":[REG_DB.REQ_PWRUP_INT_EN.L2_Bank0,REG_DB.REQ_PWRUP_TRIG.L2_Bank0]
            ,"setaddress_on": [REG_DB.REQ_PWRUP_INT_EN.Absolute_Address,REG_DB.REQ_PWRUP_TRIG.Absolute_Address]
            ,"setbit_off":[REG_DB.REQ_PWRDWN_INT_EN.L2_Bank0,REG_DB.REQ_PWRDWN_TRIG.L2_Bank0]
            ,"setaddress_off":[REG_DB.REQ_PWRDWN_INT_EN.Absolute_Address,REG_DB.REQ_PWRDWN_TRIG.Absolute_Address]
            ,"calc": function(adr){}
        }
        ]
    }
    ,[GUIC.DDR] : {
        "title" : "DDR"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "DDR Retention"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.DDR_RETENTION.value
            ,"getaddress": REG_DB.DDR_RETENTION.Absolute_Address
            ,"setbit":REG_DB.DDR_RETENTION.value
            ,"setaddress": REG_DB.DDR_RETENTION.Absolute_Address
            ,"calc": function(adr){}
        }
        ]
    }
    ,[GUIC.R5_CLK] : {
        "title" : "RPU Clock"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "CLOCK"
            ,"type": [GUI_KEYS.valuelabel]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.CPU_R5_CTRL.CLKACT
            ,"getaddress": REG_DB.CPU_R5_CTRL.Absolute_Address
            ,"label": [GUIC.R5_CLK]
            ,"ddlist": REG_DB.CPU_R5_CTRL.SRCSEL_DD_LIST
            ,"calc": function(adr){}
        },{
            "title" : "CLKACT_CORE"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.CPU_R5_CTRL.CLKACT_CORE
            ,"getaddress": REG_DB.CPU_R5_CTRL.Absolute_Address
            ,[GUI_KEYS.registers_set_on_off_exception] : 1
            ,"setbit_on":[REG_DB.CPU_R5_CTRL.CLKACT, REG_DB.CPU_R5_CTRL.CLKACT_CORE]
            ,"setaddress_on": [REG_DB.CPU_R5_CTRL.Absolute_Address, REG_DB.CPU_R5_CTRL.Absolute_Address]
            ,"setbit_off":[REG_DB.CPU_R5_CTRL.CLKACT_CORE]
            ,"setaddress_off": [REG_DB.CPU_R5_CTRL.Absolute_Address]
            ,"calc": function(adr){}
        }
        ,{
            "title" : "DIVISOR"
            ,"type": [GUI_KEYS.textfield]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.CPU_R5_CTRL.DIVISOR0
            ,"getaddress": REG_DB.CPU_R5_CTRL.Absolute_Address
            ,"setbit":REG_DB.CPU_R5_CTRL.DIVISOR0
            ,"setaddress": REG_DB.CPU_R5_CTRL.Absolute_Address
            ,"range": REG_DB.CPU_R5_CTRL.DIVISOR0_TXT_RANGE
            ,"calc": function(adr){}
        }
        ,{
            "title" : "SRCSEL"
            ,"type": [GUI_KEYS.dropdown]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.CPU_R5_CTRL.SRCSEL
            ,"getaddress": REG_DB.CPU_R5_CTRL.Absolute_Address
            ,"setbit":REG_DB.CPU_R5_CTRL.SRCSEL
            ,"setaddress": REG_DB.CPU_R5_CTRL.Absolute_Address
            ,"ddlist": REG_DB.CPU_R5_CTRL.SRCSEL_DD_LIST
            ,"calc": function(adr){}
        }
        ,{
            "title" : "CLC_PERCENT"
            ,"type": [GUI_KEYS.label]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.CPU_R5_CTRL.CLKACT
            ,"getaddress": REG_DB.CPU_R5_CTRL.Absolute_Address
            ,"label": [GUIC.R5_CLK]
            ,"ddlist": REG_DB.CPU_R5_CTRL.SRCSEL_DD_LIST
            ,"calc": function(adr){}
        }

        ]
    }
    ,[GUIC.PLLS] : {
        "title" : "PLLs"
        ,"onclick" : [GUI_KEYS.none]
        ,"elems" : [{
            "title" : "PMCPLL_CTRL"
            ,"type": [GUI_KEYS.none]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.PMCPLL_CTRL.RESET
            ,"getaddress": REG_DB.PMCPLL_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "RPLL_CTRL"
            ,"type": [GUI_KEYS.none]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.RPLL_CTRL.RESET
            ,"getaddress": REG_DB.RPLL_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "NOCPLL_CTRL"
            ,"type": [GUI_KEYS.none]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.NOCPLL_CTRL.RESET
            ,"getaddress": REG_DB.NOCPLL_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ]
    }
    /*PMC : No support for handling interrupt requests in plm */
};
// display labels
var labelsmap = {
    [GUIC.R5_CLK] :{
        "dVal" : ""
    }
}
var dutmapList = {
"vck190": [[GUIC.PRESET],[GUIC.SAMPLE],[GUIC.R5],[GUIC.R5_CLK],[GUIC.TCM],[GUIC.GEM],[GUIC.A72],[GUIC.L2],[GUIC.DDR],[GUIC.PLLS]]
,"vmk180": [[GUIC.PRESET],[GUIC.SAMPLE],[GUIC.R5],[GUIC.TCM],[GUIC.GEM],[GUIC.PLLS]]

};

function createMapin(dev){
    var maps = {};
    for(var i in dutmapList[dev]){
        maps[dutmapList[dev][i]] = mappinCommon[dutmapList[dev][i]]
    }
    return maps;
}

var deviceName;
var mappin;
