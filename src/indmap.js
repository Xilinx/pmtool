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

// GUI components
var gc_array = [
"close","PRESET","SAMPLE"
,"R5","R5_PERF","R5_CLK","TCM","OCM","R5_PERF","XRAM","GEM","LP_PERPH"
,"A72","A72_PERF","A72_CLK","L2","FP_PERPH"
,"NoC","NOC_PERF","NOC_CLK","DDR","DDR_PERF","DDR_CLK"
,"PMC","PMC_PERF","PMC_CLK","PD_PERPH"
,"AIE", "GTY","HARD_IP"
,"OPTIONS_PERF","OPTIONS_CLK","OPTIONS","INFO"
];
var GUIC = Enum(gc_array);

// GUI Type KEYS
var gks = ["popups","checkbox","calllocalfn","callextfnstrname"
        ,"registers_set_exception"

        ];
var GUI_KEYS = Enum(gks);

// xsdb targets list
var XSDBTARGETSLIST = {
    "TARGET00": "RPU (PS POR is active)"
    ,"TARGET01": "APU (FPD domain isolation)"
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
      "Absolute_Address":"0x00FF5E0040"
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
      "Absolute_Address":"0x00F1260050"
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
   }
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
var mappin = {
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
            "title" : "R5/0"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":"0"   //'Pwr_Gates': ' 3:0'
            ,"getaddress": REG_DB.RPU_PWR_STATUS.Absolute_Address
            ,"setbit":"0"
            ,"setaddress": REG_DB.RPU_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "R5/1"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":"1"
            ,"getaddress":REG_DB.RPU_PWR_STATUS.Absolute_Address
            ,"setbit":"1"
            ,"setaddress": REG_DB.RPU_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ]
    }
    ,[GUIC.TCM] : {
        "title" : "TCM x4"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "TCMA/0"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.TCM_PWR_STATUS.TCMA0
            ,"getaddress": REG_DB.TCM_PWR_STATUS.Absolute_Address
            ,"setbit":REG_DB.TCM_PWR_CTRL.TCMA0
            ,"setaddress": REG_DB.TCM_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "TCMA/1"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.TCM_PWR_STATUS.TCMA1
            ,"getaddress":REG_DB.TCM_PWR_STATUS.Absolute_Address
            ,"setbit":REG_DB.TCM_PWR_CTRL.TCMA1
            ,"setaddress": REG_DB.TCM_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "TCMB/0"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.TCM_PWR_STATUS.TCMB0
            ,"getaddress": REG_DB.TCM_PWR_STATUS.Absolute_Address
            ,"setbit":REG_DB.TCM_PWR_CTRL.TCMB0
            ,"setaddress": REG_DB.TCM_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "TCMB/1"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.TCM_PWR_STATUS.TCMB1
            ,"getaddress":REG_DB.TCM_PWR_STATUS.Absolute_Address
            ,"setbit":REG_DB.TCM_PWR_CTRL.TCMB1
            ,"setaddress": REG_DB.TCM_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ]
    }
    ,[GUIC.OCM] : {
        "title" : "OCM x4"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "Bank 0"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.OCM_PWR_STATUS.Bank0
            ,"getaddress": REG_DB.OCM_PWR_STATUS.Absolute_Address
            ,"setbit":REG_DB.OCM_PWR_CTRL.Bank0
            ,"setaddress": REG_DB.OCM_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 1"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.OCM_PWR_STATUS.Bank1
            ,"getaddress":REG_DB.OCM_PWR_STATUS.Absolute_Address
            ,"setbit":REG_DB.OCM_PWR_CTRL.Bank1
            ,"setaddress": REG_DB.OCM_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 2"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.OCM_PWR_STATUS.Bank2
            ,"getaddress": REG_DB.OCM_PWR_STATUS.Absolute_Address
            ,"setbit":REG_DB.OCM_PWR_CTRL.Bank2
            ,"setaddress": REG_DB.OCM_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "Bank 3"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit":REG_DB.OCM_PWR_STATUS.Bank3
            ,"getaddress":REG_DB.OCM_PWR_STATUS.Absolute_Address
            ,"setbit":REG_DB.OCM_PWR_CTRL.Bank3
            ,"setaddress": REG_DB.OCM_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ]
    },[GUIC.XRAM] : {
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
    }
    ,[GUIC.GEM] : {
        "title" : "GEM x2"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "GEM 0"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.GEM_PWR_STATUS.GEM0
            ,"getaddress": REG_DB.GEM_PWR_STATUS.Absolute_Address
            ,"setbit": REG_DB.GEM_PWR_CTRL.GEM0
            ,"setaddress": REG_DB.GEM_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ,{
            "title" : "GEM 1"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.GEM_PWR_STATUS.GEM1
            ,"getaddress": REG_DB.GEM_PWR_STATUS.Absolute_Address
            ,"setbit": REG_DB.GEM_PWR_CTRL.GEM1
            ,"setaddress": REG_DB.GEM_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ]
    }
    ,[GUIC.A72] : {
        "title" : "A72 x2"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : []
    }
    ,[GUIC.L2] : {
        "title" : "L2 x2"
        ,"onclick" : [GUI_KEYS.popups]
        ,"elems" : [{
            "title" : "Bank 0"
            ,"type": [GUI_KEYS.checkbox]
            ,"xsdbtarget": XSDBTARGETSLIST.TARGET00
            ,"getbit": REG_DB.L2_PWR_STATUS.Bank0
            ,"getaddress": REG_DB.L2_PWR_STATUS.Absolute_Address
            ,"setbit": REG_DB.L2_PWR_CTRL.Bank0
            ,"setaddress": REG_DB.L2_PWR_CTRL.Absolute_Address
            ,"calc": function(adr){}
        }
        ]
    }
};
// display labels
var labelsmap = {
//    [GUIC.R5_PERF] :{
//        "dVal" : ""
//    }
}
