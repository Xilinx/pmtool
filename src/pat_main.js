/*
* Copyright (c) 2021, Xilinx Inc. and Contributors. All rights reserved.
*
* SPDX-License-Identifier: MIT
*/


/*
// Images
image, state, hidden,

// Clicks and calls
x, y, width, height, isEnable, apicall, responseKeys[], display-ids[]

// labels   - Single Lined values only
// Z values will be above last image z-index
id, type, x, y, width, valueToDisplay,

// calls
//                vk = mappin[akey]["valueAt"];
//                $("#"+vk).text("30%");
*/

var pmtool_version = "Beta.0.0";

function getlocallinkwithport (portno){
var url = window.location.href;
return "http://"+url.split(":")[1].substring(2)+":"+portno
}

var req_regdata_url = getlocallinkwithport("49993");

function updateWithRealData(mappinObj){
    vk = mappinObj["valueAt"];
    $("#"+vk).text("........");
    $.ajax({
            url: req_regdata_url + "/getregister/",
            type: 'GET',
            data:JSON.stringify({"address":"[\""+mappinObj["address"]+"\"]"}),
            dataType: 'json',
            success: function (res){
                if (res.length == 1){
                    if(res[0].status === "Success"){
                        if(mappinObj["valueAt"] >= 0){
                            vk = mappinObj["valueAt"];
                            v = res[0].value
                            $("#"+vk).text(mappinObj["calc"](v));
                        }
                    }else{
                        vk = mappinObj["valueAt"];
                        $("#"+vk).text("ERR");
                    }
                }
            },
            error: function(){
                vk = mappinObj["valueAt"];
                $("#"+vk).text("FAIL");
            }
    });
}

function imagelayer(imgname, zind)   {
    var em2 = document.createElement("img");
    em2.classList.add("overlap");
    em2.setAttribute("style","z-index:"+zind);
    em2.setAttribute("src", imgname);
    return em2
}
    function getPLLClockOut( pll_clock){
        console.log(pll_clock,"----------------------");
        var RESET = valAt(pll_clock,"0");
        var BYPASS = valAt(pll_clock,"3");
        var FBDIV = valAt(pll_clock,"15:8");
        var CLKOUTDIV = valAt(pll_clock,"17:16");
        var PRE_SRC = valAt(pll_clock,"22:20");
        var POST_SRC = valAt(pll_clock,"26:24");
        //
        console.log("RESET ",RESET.toString(16));
        console.log("BYPASS ",BYPASS.toString(16));
        console.log("FBDIV ",FBDIV.toString(16));
        console.log("CLKOUTDIV ",CLKOUTDIV.toString(16));
        console.log("PRE_SRC ",PRE_SRC.toString(16));
        console.log("POST_SRC ",POST_SRC.toString(16));

        //check PRE or POST SRC
        var CAL_CLK = 0;
        if(BYPASS == 0){
            if ((PRE_SRC & 0b010) == 0 ){
                // REF_CLK
                CAL_CLK = refClock;
            }
            if ((PRE_SRC & 0b011) == 3){
                // PL_XXX_ALT_REF_CLK
                CAL_CLK = altrefClock;
            }
            console.log(CAL_CLK);
            // integer portion fbdiv multiplier
            CAL_CLK = CAL_CLK * FBDIV;

            console.log(CAL_CLK);
            // divider
            switch(CLKOUTDIV){
                case 0b00:
                    CAL_CLK = CAL_CLK;
                    break;
                case 0b01:
                    CAL_CLK = CAL_CLK / 2;
                    break;
                case 0b10:
                    CAL_CLK = CAL_CLK / 4;
                    break;
                case 0b11:
                    CAL_CLK = CAL_CLK / 8;
                    break;
            }

            console.log(CAL_CLK);
        }else{
            // POST SRC
            console.log("CLK from POST_SRC");
            if ((POST_SRC & 0b010) == 0 ){
                // REF_CLK
                CAL_CLK = refClock;
            }
            if ((POST_SRC & 0b011) == 3){
                // PL_XXX_ALT_REF_CLK
                CAL_CLK = altrefClock;
            }
        }
        console.log("PLL Clock OUT: ",CAL_CLK);
        return CAL_CLK;
    }
    function getDividerClockOut(div_clock,ot,ddlist){
        var SRCSEL = valAt(div_clock,"2:0");
        var DIVISOR = valAt(div_clock,"17:8");
        var CLKACT = valAt(div_clock,"25");
        var CLKACT_RPU = valAt(div_clock,"26");
        console.log("SRCSEL ",SRCSEL.toString(16));
        console.log("DIVISOR ",DIVISOR.toString(16));
        console.log("CLKACT ",CLKACT.toString(16));
        if(CLKACT == 0 || CLKACT_RPU == 0){
            return 0;
        }
        var pll_perc = 0;
        for(var i in ddlist[0]){
            if (SRCSEL == ddlist[0][i]){
                var di = eval(ddlist[2][i]);
                console.log(di.Absolute_Address);
                pll_perc = getPLLClockOut(ot[di.Absolute_Address]);
                break;
            }
        }
        if (DIVISOR < 1) DIVISOR = 1;
        console.log("pll perc: ",pll_perc);
        div_perc = pll_perc / DIVISOR;
        console.log("div perc: ",div_perc);
        return div_perc;
    }
function labelAtpx(val, x, y, z,id){
    var em = document.createElement("label");
    em.innerHTML = val;
    em.classList.add("overlap");
    em.setAttribute("id",id+"lableID");
    em.setAttribute("style","z-index:"+z+";left:"+(x/11.5)+"vh;top:"+(y/11.1)+"vh; width:0px; height:0px; font-size:1.61vh; white-space: nowrap;margin-top: "+(2.1)+"vh; margin-left: "+(3.221)+"vh; position:fixed;");//font13px
    return em;
}

function maskdiv(x, y, w, h, id){
    var em = document.createElement("div");
    em.classList.add("disableLayer");
    em.setAttribute("id",id+"maskdivid");
    em.setAttribute("style","left:"+((x/10.796) - 0.5 )+"vh;top:"+((y/10.816) -0.25)+"vh; width:"+((w/10.796) + 1 )+"vh; height:"+((h/10.816) + 0.645)+"vh;");
    return em;
}
function noneButton(id){
    $("#"+id+"maskdivid").removeClass().addClass("noneLayer");
}
function disableButton(id){
    $("#"+id+"maskdivid").removeClass().addClass("disableLayer");
}
function offButton(id){
    $("#"+id+"maskdivid").removeClass().addClass("offLayer");
}
function disableOffButton(id){
    $("#"+id+"maskdivid").removeClass().addClass("disableOffLayer");
}
function isButtonEnabled(id){
    return $("#"+id+"maskdivid").hasClass("noneLayer") || $("#"+id+"maskdivid").hasClass("offLayer");
}
function analyseApply(){
    document.getElementById("apiloadingdiv").style.display = "block";
    document.getElementById("popupErrorMsg").innerHTML = "";
    var eh = false;
    var reqJSon = {};
    var erow = $("#popuptbody").find("tr");
    var orderedAry = [];
    jQuery.each(erow, function(j,trs){
        jQuery.each(trs.childNodes, function(k,tds){
            try{
                jQuery.each(tds.childNodes, function(k,ele){

                    if(ele.nodeName.toLowerCase() == "input" && ele.type == "checkbox"){
                        if (ele.getAttribute("registers_set_exception") === "1" || ele.getAttribute("registers_set_on_off_exception") === "1" ) { // same register for set
                        if(ele.checked){
                                var adrs = ele.getAttribute("setaddress_on").split(",");
                                var biar = ele.getAttribute("setbit_on").split(",");
                                for (var l = 0; l < adrs.length; l++){
                                    var bs = 0;
                                    var bpos = 0;
                                    bs = bs | (biar[l]);

                                    bpos = bpos | (biar[l]);
                                    var ob = {};
                                    ob["address"] = adrs[l];
                                    ob["bitposition"] = "0x" + bpos.toString(16);
                                    ob["bitstatus"] = "0x" + bs.toString(16);
                                    ob["xsdbtarget"] = ele.getAttribute("xsdbtarget")
                                    orderedAry.push(ob);
                                }
                            }
                            else{
                                var adrs = ele.getAttribute("setaddress_off").split(",");
                                var biar = ele.getAttribute("setbit_off").split(",");
                                for (var l = 0; l < adrs.length; l++){
                                    var bs = 0;
                                    var bpos = 0;
                                    bs = bs | (biar[l]);
                                    bpos = bpos | (biar[l]);
                                    var ob = {};
                                    ob["address"] = adrs[l];
                                    ob["bitposition"] = "0x" + bpos.toString(16);
                                    if(ele.getAttribute("registers_set_on_off_exception") === "1"){
                                        ob["bitstatus"] = "0x0";
                                    }else{
                                        ob["bitstatus"] = "0x" + bs.toString(16);
                                    }
                                    ob["xsdbtarget"] = ele.getAttribute("xsdbtarget")
                                    orderedAry.push(ob);
                                }
                            }
                        }else{
                            var bs = 0;
                            var bs = 0;
                            var bpos = 0;
                            if(reqJSon[ele.getAttribute("setaddress")] !== undefined){
                                bpos = reqJSon[ele.getAttribute("setaddress")][0];
                                bs = reqJSon[ele.getAttribute("setaddress")][1];
                            }
                            if(ele.checked){
                                bs = bs | (ele.getAttribute("setbit"));
                             }
                            bpos = bpos | (ele.getAttribute("setbit"));
                            reqJSon[ele.getAttribute("setaddress")] = [];
                            reqJSon[ele.getAttribute("setaddress")][0] = bpos;
                            reqJSon[ele.getAttribute("setaddress")][1] = bs;
                            reqJSon[ele.getAttribute("setaddress")][2] = ele.getAttribute("xsdbtarget");
                        }
                    }
                    else if(ele.nodeName.toLowerCase() == "input" && ele.type == "text") {

                            var ran = ele.getAttribute("range").split("-");
                            console.log(ran);
                            if (ele.value >= parseInt(ran[0]) && ele.value <= parseInt(ran[1])){

                            }else{
                                document.getElementById("popupErrorMsg").innerHTML = "Invalid "+ele.getAttribute("title")+" range";
                                eh = true;
                                return false;
                            }

                            var bs = 0;
                            var bs = 0;
                            var bpos = 0;
                            if(reqJSon[ele.getAttribute("setaddress")] !== undefined){
                                bpos = reqJSon[ele.getAttribute("setaddress")][0];
                                bs = reqJSon[ele.getAttribute("setaddress")][1];
                            }
                            console.log(ele.value);
                            if(ele.value){
                                var ar = ele.getAttribute("setbit").split(":");
                                var val = parseInt(ar[ar.length-1]);

                                bs = bs | (ele.value << val);
                             }
                             console.log(ele.value, val);
                             console.log(bs);
                            bpos = bpos | bitToAddress(ele.getAttribute("setbit"));
                            console.log(bpos);
                            reqJSon[ele.getAttribute("setaddress")] = [];
                            reqJSon[ele.getAttribute("setaddress")][0] = bpos;
                            reqJSon[ele.getAttribute("setaddress")][1] = bs;
                            reqJSon[ele.getAttribute("setaddress")][2] = ele.getAttribute("xsdbtarget");
                       }
                       else if(ele.nodeName.toLowerCase() == "select") {
                            var bs = 0;
                            var bs = 0;
                            var bpos = 0;
                            if(reqJSon[ele.getAttribute("setaddress")] !== undefined){
                                bpos = reqJSon[ele.getAttribute("setaddress")][0];
                                bs = reqJSon[ele.getAttribute("setaddress")][1];
                            }
                            console.log(ele.value);
                            if(ele.value){
                                var ar = ele.getAttribute("setbit").split(":");
                                var val = parseInt(ar[ar.length-1]);
                                bs = bs | (ele.value << val);
                             }
                             console.log(ele.value, val);
                             console.log(bs);
                            bpos = bpos | bitToAddress(ele.getAttribute("setbit"));
                            console.log(bpos);
                            reqJSon[ele.getAttribute("setaddress")] = [];
                            reqJSon[ele.getAttribute("setaddress")][0] = bpos;
                            reqJSon[ele.getAttribute("setaddress")][1] = bs;
                            reqJSon[ele.getAttribute("setaddress")][2] = ele.getAttribute("xsdbtarget");
                       }

                });
            }catch(err){};
        });
    });
    if (eh){
        document.getElementById("apiloadingdiv").style.display = "none";
        return;
    }
    reqData = [];
    Object.keys(reqJSon).forEach(function(key) {
        var ob = {};
        ob["address"] = key;
        ob["bitposition"] = "0x" + reqJSon[key][0].toString(16);
        ob["bitstatus"] = "0x" + reqJSon[key][1].toString(16);
        ob["xsdbtarget"] = reqJSon[key][2]
        reqData.push(ob);
    });
    reqData.push(...orderedAry);
    var results = {};
    $.ajax({
            url: req_regdata_url + "/setregister/",
            crossDomain: true,
            type: 'POST',
            data: JSON.stringify(reqData),
            dataType: 'json',
            contentType: 'application/json',
            success: function (res){
                var respFail = false;
                for (var i = 0; i<res.length; i++){
                    if(res[i].status == "Fail"){
                        respFail = true;
                    }
                }
                if (respFail){
                    document.getElementById("popupErrorMsg").innerHTML = "Register write failed.";
                    document.getElementById("apiloadingdiv").style.display = "none";

                }else{
//                        var erow = $("#popuptbody").find("tr");
//                        var isOn = false;
//                        jQuery.each(erow, function(j,trs){
//                            jQuery.each(trs.childNodes, function(k,tds){
//                                try{
//                                    jQuery.each(tds.childNodes, function(k,ele){
//
//                                        if(ele.nodeName.toLowerCase() == "input" && ele.checked){ isOn = true;}
//                                    });
//                                    }catch(error){}
//                            });
//                        });
//                    if (isOn){
//                         noneButton(document.getElementById("popupheadingid").getAttribute("popupid"));
//                    }else{
//                        offButton(document.getElementById("popupheadingid").getAttribute("popupid"));
//                    }
                    sampleClicked();
                    document.getElementById("popform").style.display = "none";
                }
            },
            error: function(){
                    document.getElementById("popupErrorMsg").innerHTML = "Write failed.";
                    document.getElementById("apiloadingdiv").style.display = "none";
            },
            complete:function(){

            }
    });

}
function updateButtonStatus(res){
   var ot = {};
    for (var g in res){
        ot[res[g]["address"]] = res[g];
    }
    var mapinkes = Object.keys(mappin);
    for(var k in mapinkes){
        var comp = mappin[mapinkes[k]];
        var isOn = false;
        var hasReg = false;
        var disab = false;
        for (var l in comp.elems){
            hasReg = true;
            if(ot[comp.elems[l].getaddress].status == "Fail"){
                hasReg = false;
                break;
            }
            console.log("------------------------------------------------")
            console.log(ot[comp.elems[l].getaddress].value & (bitToAddress(comp.elems[l].getbit)));
            console.log(comp.elems[l].getbit);
            console.log((bitToAddress(comp.elems[l].getbit)));
            if(comp.elems[l].type == GUI_KEYS.checkbox && (ot[comp.elems[l].getaddress].value & (bitToAddress(comp.elems[l].getbit)))){
                isOn = true;
//                break;
            }
            // Adding % value to GUI.
            if(comp.elems[l].type == GUI_KEYS.label){
                console.log("update % labels here : ",ot);

                console.log("update % labels here : ",comp.elems[l].ddlist);
                var resu = {};
                for(var n in ot){
                    resu[ot[n]["address"]] = ot[n]["value"]
                }

                var val = getDividerClockOut(ot[comp.elems[l].getaddress].value,resu,comp.elems[l].ddlist);
                console.log("#"+mapinkes[k]+"lableID");
                $("#"+mapinkes[k]+"lableID").text(Math.round((val*100)/refClock) +"%");
                console.log("percnetage out is : ",val);
            }



        }
        if (hasReg){
            if (isOn){
                noneButton(mapinkes[k]);
            }
            else{
                offButton(mapinkes[k]);
            }
        }else{
            disableButton(mapinkes[k]);
        }

    }
        noneButton([GUIC.SAMPLE]);

}
function sampleClicked(){
    document.getElementById("apiloadingdiv").style.display = "block";

    var mapinkes = Object.keys(mappin);
    var ar = new Set();
    var far = [];
    for(var k in mapinkes){
        var comp = mappin[mapinkes[k]];
        for (var l in comp.elems){
            if (ar.has(comp.elems[l].getaddress) == false){
                ar.add(comp.elems[l].getaddress);
                var di = {};
                di["address"] = comp.elems[l].getaddress;
                di["xsdbtarget"] = comp.elems[l].xsdbtarget;
                far.push(di);
            }
        }
    }

    var adrs = JSON.stringify(far);
//    console.log({"address":adrs});
        $.ajax({
            url: req_regdata_url + "/getregister/",
            type: 'POST',
            data:adrs,
            dataType: 'json',
            contentType: 'application/json',
            success: function (res){
                updateButtonStatus(res);
                document.getElementById("apiloadingdiv").style.display = "none";
            },
            error: function(){
                console.log("fail")
                document.getElementById("apiloadingdiv").style.display = "none";
                alert("Could not able to connect target. Please check target and connections.")
            },
            complete: function(){
            }
    });


}
function fetchDeviceName(){

    return "vck190";
}
function readpopupdata(obj,keyid){
    document.getElementById("apiloadingdiv").style.display = "block";

    var ar = new Set();
    var far = [];
    for(k in obj.elems){
        comp = obj.elems[k];
        if (ar.has(comp.getaddress) == false){
            ar.add(comp.getaddress);
            var d = {};
            d["address"] = comp.getaddress;
            d["xsdbtarget"] = comp.xsdbtarget;
            far.push(d);
        }
        for(var p in obj.elems[k]["ddlist"]){
            for( var c in obj.elems[k]["ddlist"][2]){
                if(ar.has(eval(obj.elems[k]["ddlist"][2][c]).Absolute_Address) == false){
                    ar.add(eval(obj.elems[k]["ddlist"][2][c]).Absolute_Address);
                    var d = {};
                    d["address"] = eval(obj.elems[k]["ddlist"][2][c]).Absolute_Address;
                    d["xsdbtarget"] = comp.xsdbtarget;
                    far.push(d);
                }
            }


        }
    }
    var adrs = JSON.stringify(far);
    var results = {};
    var respState = true;
    if(ar.size == 0){
        document.getElementById("apiloadingdiv").style.display = "none";
        return;
    }
//        console.log({"address":adrs});

    $.ajax({
            url: req_regdata_url + "/getregister/",
            type: 'POST',
            data:adrs,
            dataType: 'json',
            contentType: 'application/json',
            success: function (res){
                    for (k in res){
                        results[res[k]["address"]] = res[k]["value"];
                        if (res[k]["status"] == "Fail"){
                            respState = false;
                        }
                        else{
                            respState = true;
                        }
                    }
            },
            error: function(){
                respState = false;
            },
            complete:function(){
                displaypopup(obj,results,respState,keyid);
            }
    });

}
function readpopupdataClock(obj,keyid){
    document.getElementById("apiloadingdiv").style.display = "block";

    var ar = new Set();
    var far = [];
    for(k in obj.elems){
        comp = obj.elems[k];
        if (ar.has(comp.getaddress) == false){
            ar.add(comp.getaddress);
            var d = {};
            d["address"] = comp.getaddress;
            d["xsdbtarget"] = comp.xsdbtarget;
            far.push(d);
        }
    }
    var adrs = JSON.stringify(far);
    var results = {};
    var respState = true;
    if(ar.size == 0){
        document.getElementById("apiloadingdiv").style.display = "none";
        return;
    }
//        console.log({"address":adrs});

    $.ajax({
            url: req_regdata_url + "/getregister/",
            type: 'POST',
            data:adrs,
            dataType: 'json',
            contentType: 'application/json',
            success: function (res){
                    for (k in res){
                        results[res[k]["address"]] = res[k]["value"];
                        if (res[k]["status"] == "Fail"){
                            respState = false;
                        }
                        else{
                            respState = true;
                        }
                    }
            },
            error: function(){
                respState = false;
            },
            complete:function(){
                displayClockpopup(obj,results,respState,keyid);
            }
    });

}
function displaypopup(obj,responseData,respState,keyid){
    document.getElementById("popform").innerHTML = "";
    var bodycomp = document.createElement("div");
    bodycomp.classList.add("popup-content");

    var headcomp = document.createElement("div");
    headcomp.classList.add("popup-header");
    bodycomp.append(headcomp);
    var heading = document.createElement("h2");
    heading.setAttribute("style","text-align: center;");
    heading.setAttribute("popupid",keyid);
    heading.setAttribute("id","popupheadingid");
    heading.innerHTML = obj.title;
    headcomp.append(heading);

    var tablecomp = document.createElement("table");
        tablecomp.classList.add("boardsettings_table");

    var tbodycomp = document.createElement("tbody");
    tbodycomp.classList.add("table_body");
   tbodycomp.setAttribute("id", "popuptbody");

    for(k in obj.elems){
        comp = obj.elems[k];
        var trcomp = document.createElement("tr");
        if (comp.type == GUI_KEYS.checkbox){
               var tdcomp = document.createElement("td");
               var em = document.createElement("input");
               em.setAttribute("type", "checkbox");
             
               if(responseData[comp.getaddress] & (bitToAddress(comp.getbit))){
                    em.setAttribute("checked", true);
               }
               em.setAttribute("getaddress", comp.getaddress);
               em.setAttribute("getbit", bitToAddress(comp.getbit));
               em.setAttribute("xsdbtarget", comp.xsdbtarget);

               if (GUI_KEYS.registers_set_exception in comp || GUI_KEYS.registers_set_on_off_exception in comp){

                   em.setAttribute("registers_set_exception", 1);
                   if(GUI_KEYS.registers_set_on_off_exception in comp){
                        em.setAttribute("registers_set_on_off_exception", 1);
                   }
                   em.setAttribute("setaddress_on", ""+comp.setaddress_on);
                   var ar1 = []
                   for(var i = 0; i< comp.setbit_on.length; i++){
                        ar1.push(bitToAddress(comp.setbit_on[i]));
                   }
                   em.setAttribute("setbit_on", ar1);
                   em.setAttribute("setaddress_off", ""+comp.setaddress_off);
                   var ar2 = [];
                   for(var i = 0; i < comp.setbit_off.length; i++){
                        ar2.push(bitToAddress(comp.setbit_off[i]))
                   }

                   em.setAttribute("setbit_off", ar2);
               }else{
                   em.setAttribute("registers_set_exception", 0);
                   em.setAttribute("setaddress", comp.setaddress);
                   em.setAttribute("setbit", bitToAddress(comp.setbit));
               }

               em.setAttribute("comp", comp.title);
               tdcomp.appendChild(em)

               var tdcomp0 = document.createElement("td");
                var em0 = document.createTextNode(comp.title);
                tdcomp0.appendChild(em0);

               trcomp.appendChild(tdcomp0);
               trcomp.appendChild(tdcomp);
        }
        else if (comp.type == GUI_KEYS.textfield){
               var tdcomp = document.createElement("td");
               var em = document.createElement("input");
               em.setAttribute("type", "text");
               console.log("***************************************");
               console.log(responseData[comp.getaddress] & (bitToAddress(comp.getbit)));
               console.log(responseData[comp.getaddress]);
               console.log((bitToAddress(comp.getbit)));
               var val = responseData[comp.getaddress] & (bitToAddress(comp.getbit));
               var ar = comp.getbit.split(":");
               fval = val >> ar[ar.length-1];
               em.setAttribute("value", fval);

               em.setAttribute("getaddress", comp.getaddress);
               em.setAttribute("getbit", bitToAddress(comp.getbit));
               em.setAttribute("xsdbtarget", comp.xsdbtarget);

               em.setAttribute("registers_set_exception", 0);
               em.setAttribute("setaddress", comp.setaddress);
               em.setAttribute("setbit", comp.getbit);
               em.setAttribute("range", comp.range);
               em.setAttribute("title", comp.title);

               em.setAttribute("comp", comp.title);
               tdcomp.appendChild(em)

                var em2 = document.createElement("label");
               em2.innerHTML = comp.title + "<span style='font-size:1.8vh;font-weight:normal;'> ("+comp.range+")</span>";
                tdcomp.appendChild(em2)
               var tdcomp0 = document.createElement("td");
                tdcomp0.appendChild(em2);

               trcomp.appendChild(tdcomp0);
               trcomp.appendChild(tdcomp);
        }
        else if (comp.type == GUI_KEYS.dropdown){
               var tdcomp = document.createElement("td");
               var em = document.createElement("select");
               em.setAttribute("type", "select");
               console.log("***************************************");
               console.log(responseData[comp.getaddress] & (bitToAddress(comp.getbit)));
               console.log(responseData[comp.getaddress]);
               console.log((bitToAddress(comp.getbit)));
               var val = responseData[comp.getaddress] & (bitToAddress(comp.getbit));
               console.log(comp.getbit);
               var ar = comp.getbit.split(":");
               fval = val >> ar[ar.length-1];
//               em.setAttribute("value", fval);


               em.setAttribute("getaddress", comp.getaddress);
               em.setAttribute("getbit", bitToAddress(comp.getbit));
               em.setAttribute("xsdbtarget", comp.xsdbtarget);

               em.setAttribute("registers_set_exception", 0);
               em.setAttribute("setaddress", comp.setaddress);
               em.setAttribute("setbit", comp.getbit);

               em.setAttribute("comp", comp.title);
                console.log(comp.ddlist[1]);
               for(var n=0; n< comp.ddlist[1].length; n++){
                       var em1 = document.createElement("option");
                       em1.innerHTML = comp.ddlist[1][n];
                       em1.setAttribute("value", comp.ddlist[0][n]);
                       if (comp.ddlist[0][n] == fval) em1.selected = true;
                       em.appendChild(em1);
               }



               tdcomp.appendChild(em)

               var tdcomp0 = document.createElement("td");
                var em0 = document.createTextNode(comp.title);
                tdcomp0.appendChild(em0);

               trcomp.appendChild(tdcomp0);
               trcomp.appendChild(tdcomp);
        }
        else if (comp.type == GUI_KEYS.valuelabel){
               var tdcomp = document.createElement("td");
               var em = document.createElement("label");
               em.classList.add("valuelabel");

               em.setAttribute("type", "value");
               console.log("***************************************");
               console.log(responseData[comp.getaddress] & (bitToAddress(comp.getbit)));
               console.log(responseData[comp.getaddress]);
               console.log((bitToAddress(comp.getbit)));
               var val = responseData[comp.getaddress] & (bitToAddress(comp.getbit));
               console.log(comp.getbit);
               var ar = comp.getbit.split(":");
               fval = val >> ar[ar.length-1];
//               em.setAttribute("value", fval);


               em.setAttribute("getaddress", comp.getaddress);
               em.setAttribute("getbit", bitToAddress(comp.getbit));
               em.setAttribute("xsdbtarget", comp.xsdbtarget);
               em.setAttribute("ddlist", comp.ddlist);

               em.setAttribute("registers_set_exception", 0);
               em.setAttribute("setaddress", comp.setaddress);
               em.setAttribute("setbit", comp.getbit);

               em.setAttribute("comp", comp.title);
                console.log(responseData);

                var val = getDividerClockOut(responseData[comp.getaddress],responseData,comp.ddlist);
//                console.log("#"+mapinkes[k]+"lableID");
//                $("#"+mapinkes[k]+"lableID").text(Math.round(val) +"%");
                retval = Number(Math.round(val+'e0')+'e-6').toString().split(".");
                if(retval.length != 2 ){
                    retval[1] = "00";
                }
                em.innerHTML = retval[0]+"."+retval[1].substring(0,2)+" MHz"; //(val/1000000).toFixed(2);
               tdcomp.appendChild(em)

               var tdcomp0 = document.createElement("td");
                var em0 = document.createTextNode(comp.title);
                tdcomp0.appendChild(em0);

               trcomp.appendChild(tdcomp0);
               trcomp.appendChild(tdcomp);
        }
        tbodycomp.appendChild(trcomp);
    }
    tablecomp.appendChild(tbodycomp);
    bodycomp.appendChild(tablecomp);

    // cancel and apply button.
    var d = document.createElement("div");
    d.classList.add("popup-footer");
    heading = document.createElement("a");
    heading.setAttribute("id", "popupErrorMsg");
    heading.setAttribute("class", "popuperrormsg");
    if(respState == false){
        heading.innerHTML = "Read Failed";
    }
    var sp = document.createElement("span");

    var em = document.createElement("input");
    em.setAttribute("type", "button");
    em.setAttribute("value", "Close");
    em.classList.add("popupbuttons");
    em.onclick = function(){document.getElementById("popform").style.display = "none";};
    sp.appendChild(em)
    em = document.createElement("input");
    em.setAttribute("type", "button");
    em.setAttribute("value", "Apply");
    em.onclick = analyseApply;
    em.classList.add("popupbuttons");
    sp.appendChild(em)
    d.append(sp);
    d.append(heading);

    bodycomp.append(d);
    $("#popform").append(bodycomp);
    b = document.getElementById("popform")
    b.style.display = "block";
    document.getElementById("apiloadingdiv").style.display = "none";

}
/*function displayClockpopup(obj,responseData,respState,keyid){
    document.getElementById("popform").innerHTML = "";
    var bodycomp = document.createElement("div");
    bodycomp.classList.add("popup-content");

    var headcomp = document.createElement("div");
    headcomp.classList.add("popup-header");
    bodycomp.append(headcomp);
    var heading = document.createElement("h2");
    heading.setAttribute("style","text-align: center;");
    heading.setAttribute("popupid",keyid);
    heading.setAttribute("id","popupheadingid");
    heading.innerHTML = obj.title;
    headcomp.append(heading);


    var div0 = document.createElement("div");
    var div1 = document.createElement("div");
    var div2 = document.createElement("div");

    var tablecomp = document.createElement("table");
        tablecomp.classList.add("boardsettings_table_1");

    var tbodycomp = document.createElement("tbody");
    tbodycomp.classList.add("table_body");
   tbodycomp.setAttribute("id", "popuptbody");

   var tbodycomp2 = document.createElement("tbody");
    tbodycomp2.classList.add("table_body");
   tbodycomp2.setAttribute("id", "popuptbody");

    for(k in obj.elems){
        comp = obj.elems[k];
        var trcomp = document.createElement("tr");
        if (comp.type == GUI_KEYS.checkbox){
               var tdcomp = document.createElement("td");
               var em = document.createElement("input");
               em.setAttribute("type", "checkbox");
               console.log("******************Clocks*********************");
               console.log(responseData[comp.getaddress] & (bitToAddress(comp.getbit)));
               console.log(responseData[comp.getaddress]);
               console.log((bitToAddress(comp.getbit)));
               if(responseData[comp.getaddress] & (bitToAddress(comp.getbit))){
                    em.setAttribute("checked", true);
               }
               em.setAttribute("getaddress", comp.getaddress);
               em.setAttribute("getbit", bitToAddress(comp.getbit));
               em.setAttribute("xsdbtarget", comp.xsdbtarget);

               if (GUI_KEYS.registers_set_exception in comp){

                   em.setAttribute("registers_set_exception", 1);
                   em.setAttribute("setaddress_on", ""+comp.setaddress_on);
                   var ar1 = []
                   for(var i = 0; i< comp.setbit_on.length; i++){
                        ar1.push(bitToAddress(comp.setbit_on[i]));
                   }
                   em.setAttribute("setbit_on", ar1);
                   em.setAttribute("setaddress_off", ""+comp.setaddress_off);
                   var ar2 = [];
                   for(var i = 0; i < comp.setbit_off.length; i++){
                        ar2.push(bitToAddress(comp.setbit_off[i]))
                   }

                   em.setAttribute("setbit_off", ar2);
               }else{
                   em.setAttribute("registers_set_exception", 0);
                   em.setAttribute("setaddress", comp.setaddress);
                   em.setAttribute("setbit", bitToAddress(comp.setbit));
               }

               em.setAttribute("comp", comp.title);
               tdcomp.appendChild(em)

               var tdcomp0 = document.createElement("td");
                var em0 = document.createTextNode(comp.title);
                tdcomp0.appendChild(em0);

               trcomp.appendChild(tdcomp0);
               trcomp.appendChild(tdcomp);
        }
        else if (comp.type == GUI_KEYS.heading){
               var tdcomp = document.createElement("td");
               var em = document.createElement("label");
//               em.setAttribute("type", "checkbox");
               console.log("******************Clocks*********************");
               console.log(responseData[comp.getaddress] & (bitToAddress(comp.getbit)));
               console.log(responseData[comp.getaddress]);
               console.log((bitToAddress(comp.getbit)));

               em.setAttribute("getaddress", comp.getaddress);
               em.setAttribute("getbit", bitToAddress(comp.getbit));
               em.setAttribute("xsdbtarget", comp.xsdbtarget);

               if (GUI_KEYS.registers_set_exception in comp){

                   em.setAttribute("registers_set_exception", 1);
                   em.setAttribute("setaddress_on", ""+comp.setaddress_on);
                   var ar1 = []
                   for(var i = 0; i< comp.setbit_on.length; i++){
                        ar1.push(bitToAddress(comp.setbit_on[i]));
                   }
                   em.setAttribute("setbit_on", ar1);
                   em.setAttribute("setaddress_off", ""+comp.setaddress_off);
                   var ar2 = [];
                   for(var i = 0; i < comp.setbit_off.length; i++){
                        ar2.push(bitToAddress(comp.setbit_off[i]))
                   }

                   em.setAttribute("setbit_off", ar2);
               }else{
                   em.setAttribute("registers_set_exception", 0);
                   em.setAttribute("setaddress", comp.setaddress);
                   em.setAttribute("setbit", bitToAddress(comp.setbit));
               }

               em.setAttribute("comp", comp.title);
               tdcomp.appendChild(em)

               var tdcomp2 = document.createElement("td");
               var em2 = document.createElement("label");
                em2.innerHTML = "testing ⓘ";
               tdcomp2.appendChild(em2);

               var tdcomp0 = document.createElement("td");
               var em0 = document.createElement("label");
                em0.innerHTML = comp.title;
                tdcomp0.appendChild(em0);

               trcomp.appendChild(tdcomp0);
               trcomp.appendChild(tdcomp);
               trcomp.appendChild(tdcomp2);
        }
        trcomp.onclick = function (a){
            tbodycomp2.innerHTML = "";
            ro = a.target.parentNode;
            if (a.target.nodeName == "LABEL")
                ro = a.target.parentNode.parentNode;
            var trcompn = document.createElement("tr");
            var tdcomp0 = document.createElement("td");
            var em0 = document.createElement("label");
            em0.innerHTML = ro.childNodes[0].childNodes[0].innerHTML;
            tdcomp0.appendChild(em0);
            trcompn.appendChild(tdcomp0);
            tdcomp0 = document.createElement("td");
            trcompn.appendChild(tdcomp0);
            tbodycomp2.appendChild(trcompn);

            trcompn = document.createElement("tr");
            tdcomp0 = document.createElement("td");
            em0 = document.createElement("label");
            em0.innerHTML = "CLKOUTDIV";
            tdcomp0.appendChild(em0);
            trcompn.appendChild(tdcomp0);
            tdcomp0 = document.createElement("td");
            em0 = document.createElement("label");
            em0.innerHTML = "value";
            tdcomp0.appendChild(em0);
            trcompn.appendChild(tdcomp0);
            tbodycomp2.appendChild(trcompn);

            $("#clocksdivpopup").removeClass().addClass("clocksdivSec");
        };
        tbodycomp.appendChild(trcomp);
    }
    tablecomp.appendChild(tbodycomp);
    div1.appendChild(tablecomp);
    div0.setAttribute("id","clocksdivpopup");
    div0.classList.add("clocksdiv");
    div1.classList.add("clocks2div");
    div2.classList.add("clocks3div");



    var div3 = document.createElement("div");
    div3.classList.add("clocks1div");


    var tablecomp2 = document.createElement("table");
    tablecomp2.classList.add("boardsettings_table_2");
    tablecomp2.appendChild(tbodycomp2);
    div2.appendChild(tablecomp2);
    div0.appendChild(div1);
    div0.appendChild(div2);
    div3.appendChild(div0);
    bodycomp.appendChild(div3);

    var em_back = document.createElement("input");
    em_back.setAttribute("type", "button");
    em_back.setAttribute("value", "Back");
    em_back.classList.add("popupbuttonsInner");
    em_back.onclick = function(){$("#clocksdivpopup").removeClass().addClass("clocksdiv");};
    div2.appendChild(em_back)

    // cancel and apply button.
    var d = document.createElement("div");
    d.classList.add("popup-footer");
    heading = document.createElement("a");
    heading.setAttribute("id", "popupErrorMsg");
    heading.setAttribute("class", "popuperrormsg");
    if(respState == false){
        heading.innerHTML = "Read Failed";
    }
    var sp = document.createElement("span");

    var em = document.createElement("input");
    em.setAttribute("type", "button");
    em.setAttribute("value", "Close");
    em.classList.add("popupbuttons");
    em.onclick = function(){document.getElementById("popform").style.display = "none";};
    sp.appendChild(em)
    em = document.createElement("input");
    em.setAttribute("type", "button");
    em.setAttribute("value", "Apply");
    em.onclick = analyseApply;
    em.classList.add("popupbuttons");
//    sp.appendChild(em)
    d.append(sp);
    d.append(heading);

    bodycomp.append(d);
    $("#popform").append(bodycomp);
    b = document.getElementById("popform")
    b.style.display = "block";
    document.getElementById("apiloadingdiv").style.display = "none";

}
*/
// Detect and call appropriate call based on click location
function detectcall(self,x,y){
    for (ind = 0; ind < Object.keys(a_indexes).length; ind++){
        i = a_indexes[Object.keys(a_indexes)[ind]];
        if(x > i[0] && y > i[1] && x < i[2] && y < i[3]){
            akey = Object.keys(a_indexes)[ind];

            if (! isButtonEnabled(akey)){
                return;
            }

            clickobject = mappin[akey];
            if(clickobject.onclick == GUI_KEYS.popups){
                readpopupdata(clickobject,akey);
            }else if(clickobject.onclick == GUI_KEYS.clockspopup){
                readpopupdataClock(clickobject,akey);
            }else if(clickobject.onclick == GUI_KEYS.callextfnstrname){
                eval(clickobject.func)();
            }
            else if(clickobject.onclick == GUI_KEYS.calllocalfn){
                clickobject.func();
            }

        }
    }
}




// Function that generates table with pixels and index
var tind = 0;
var tindstr = []
function indextablegen(x,y){
    if (tind == 0){
        tindstr[0] = x;
        tindstr[1] = y;
        tind ++;
    }else if (tind == 1){
        tindstr[2] = x;
        tindstr[3] = y;
        console.log(tindstr.join(","));
        tindstr = [];
        tind = 0;
    }
}
window.onclick = function(event) {
// to close popup on gray area click
  if (event.target == document.getElementById("popform")) {
    document.getElementById("popform").style.display = "none";
  }
}
function loadComponents(){
    var e = imagelayer("Layout.png",1);
//    e.setAttribute("id","patguiimage");
    $("#mainpatgui").append(e);

    e = imagelayer("Layout_Mask.png",350);
    e.setAttribute("id","patguiimage");
    $("#mainpatgui").append(e);



    $(window).on('resize', function(){
    });
    $("#patguiimage").on("load", function() {

        var mapkes = Object.keys(a_indexes);
        for (var i = 0; i  < mapkes.length; i++){
            ob = a_indexes[mapkes[i]];
            var e2 = maskdiv(a_indexes[mapkes[i]][0]
            ,a_indexes[mapkes[i]][1]
            ,a_indexes[mapkes[i]][2] - a_indexes[mapkes[i]][0]
            ,a_indexes[mapkes[i]][3] - a_indexes[mapkes[i]][1]
            ,mapkes[i]
            )
            $("#mainpatgui").append(e2);

        }
        var labelsary = Object.keys(labelsmap);

        for (var i = 0; i < labelsary.length; i++){
        ob = labelsmap[labelsary[i]]
            var e2 = labelAtpx(ob["dVal"],
            a_indexes[labelsary[i]][0],
            a_indexes[labelsary[i]][1],
            100,
            labelsary[i]);
            $("#mainpatgui").append(e2);
//            noneButton(labelsary[i]);

    }
       var mapinkes = Object.keys(mappin);
        for (var i = 0; i < mapinkes.length; i++){
//            noneButton(mapinkes[i]);
    }
    // Enable sample and preset by default
    noneButton([GUIC.SAMPLE]);
    });
    // Click actions
    $("#patguiimage").on("click", function(event) {
        bounds=this.getBoundingClientRect();
        var x = event.pageX;
        var y = event.pageY;
        var px = x / this.clientWidth * this.naturalWidth
        var py = y / this.clientHeight * this.naturalHeight
        // generate indexes
//        indextablegen(px,py);

        // detect and call appropriate actions
        detectcall(this,px,py);

    });
}
$(document).ready(function () {
    console.log("Version :v " + pmtool_version);
    // Fetch device name and create GUI accordingly.
    $.ajax({
            url: req_regdata_url + "/getDeviceName/",   // TODO:: change after API integration
            type: 'GET',                                // TODO:: change after API integration
            data:"",                                    // TODO:: change after API integration
            dataType: 'json',
            success: function (res){
                deviceName = res.deviceName;            // TODO:: change after API integration
            },
            error: function(){
                deviceName = "";
            },
            complete: function(re,a){
                deviceName = "vck190";                  // TODO:: Remove after API integration
                mappin = createMapin(deviceName);
                loadComponents();
            }
    });

});
