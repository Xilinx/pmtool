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
            data:{"address":"[\""+mappinObj["address"]+"\"]"},
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

function labelAtpx(val, x, y, z,id){
    var em = document.createElement("label");
    em.innerHTML = val;
    em.classList.add("overlap");
    em.setAttribute("id",id);
    em.setAttribute("style","z-index:"+z+";left:"+(x/11.1)+"vh;top:"+(y/11.1)+"vh; width:0px; height:0px; font-size:1.81vh; white-space: nowrap;margin-top: "+(1.68)+"vh; margin-left: "+(3.221)+"vh; position:fixed;");//font13px
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

    var reqJSon = {};
    var erow = $("#popuptbody").find("tr");
    jQuery.each(erow, function(j,trs){
        jQuery.each(trs.childNodes, function(k,tds){
            try{
                jQuery.each(tds.childNodes, function(k,ele){
                    if(ele.nodeName.toLowerCase() == "input"){
                        if (ele.getAttribute("registers_set_exception") === "0") { // same register for set
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
                        }else{
                            var bs = 0;
                            var bpos = 0;
                            if(ele.checked){

                                if(reqJSon[ele.getAttribute("setaddress_on")] !== undefined){

                                    bpos = reqJSon[ele.getAttribute("setaddress_on")][0];
                                    bs = reqJSon[ele.getAttribute("setaddress_on")][1];
                                }

                                    bs = bs | (ele.getAttribute("setbit_on"));

                                bpos = bpos | (ele.getAttribute("setbit_on"));
                                reqJSon[ele.getAttribute("setaddress_on")] = [];
                                reqJSon[ele.getAttribute("setaddress_on")][0] = bpos;
                                reqJSon[ele.getAttribute("setaddress_on")][1] = bs;
                                reqJSon[ele.getAttribute("setaddress_on")][2] = ele.getAttribute("xsdbtarget")
                            }else{

                                if(reqJSon[ele.getAttribute("setaddress_off")] !== undefined){

                                    bpos = reqJSon[ele.getAttribute("setaddress_off")][0];
                                    bs = reqJSon[ele.getAttribute("setaddress_off")][1];
                                }
                                bs = bs | (ele.getAttribute("setbit_off"));
                                bpos = bpos | (ele.getAttribute("setbit_off"));
                                reqJSon[ele.getAttribute("setaddress_off")] = [];
                                reqJSon[ele.getAttribute("setaddress_off")][0] = bpos;
                                reqJSon[ele.getAttribute("setaddress_off")][1] = bs;
                                reqJSon[ele.getAttribute("setaddress_off")][2] = ele.getAttribute("xsdbtarget");
                            }

                        }
                    }
                });
            }catch(err){};
        });
    });
    reqData = [];
    Object.keys(reqJSon).forEach(function(key) {
        var ob = {};
        ob["address"] = key;
        ob["bitposition"] = "0x" + reqJSon[key][0].toString(16);
        ob["bitstatus"] = "0x" + reqJSon[key][1].toString(16);
        ob["xsdbtarget"] = reqJSon[key][2]
        reqData.push(ob);
    });
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
                }else{
                        var erow = $("#popuptbody").find("tr");
                        var isOn = false;
                        jQuery.each(erow, function(j,trs){
                            jQuery.each(trs.childNodes, function(k,tds){
                                try{
                                    jQuery.each(tds.childNodes, function(k,ele){

                                        if(ele.nodeName.toLowerCase() == "input" && ele.checked){ isOn = true;}
                                    });
                                    }catch(error){}
                            });
                        });
                    if (isOn){
                         noneButton(document.getElementById("popupheadingid").getAttribute("popupid"));
                    }else{
                        offButton(document.getElementById("popupheadingid").getAttribute("popupid"));
                    }
                    document.getElementById("popform").style.display = "none";
                }
            },
            error: function(){
                    document.getElementById("popupErrorMsg").innerHTML = "Write failed.";
            },
            complete:function(){
                    document.getElementById("apiloadingdiv").style.display = "none";

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
            if(ot[comp.elems[l].getaddress].value & (bitToAddress(comp.elems[l].getbit))){
                isOn = true;
                break;
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
        $.ajax({
            url: req_regdata_url + "/getregister/",
            type: 'GET',
            data:{"address":adrs},
            dataType: 'json',
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
    }
    var adrs = JSON.stringify(far);
    var results = {};
    var respState = true;
    if(ar.size == 0){
        document.getElementById("apiloadingdiv").style.display = "none";
        return;
    }
    $.ajax({
            url: req_regdata_url + "/getregister/",
            type: 'GET',
            data:{"address":adrs},
            dataType: 'json',
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

               if (GUI_KEYS.registers_set_exception in comp){
                   em.setAttribute("registers_set_exception", 1);
                   em.setAttribute("setaddress_on", comp.setaddress_on);
                   em.setAttribute("setbit_on", bitToAddress(comp.setbit_on));
                   em.setAttribute("setaddress_off", comp.setaddress_off);
                   em.setAttribute("setbit_off", bitToAddress(comp.setbit_off));
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
$(document).ready(function () {
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
            50,
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
});