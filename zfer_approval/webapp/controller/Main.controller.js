sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("ER.zferapproval.controller.Main", {
            formatter: {
                dateTime: function(oDate) {
                    let oDateTimeInstance;

                    oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern : 'yyyy-MM-dd'
                    });

                    return oDateTimeInstance.format(oDate);
                },
                Time: function(oTime) {
                    var time = new Date(oTime);
                    var timeHour = new String;
                    var timeMinute = new String;
                    var timeSecond = new String;

                    if(time.getUTCHours() < 10){
                        timeHour = '0'+time.getUTCHours();
                    }else{
                        timeHour = String(time.getUTCHours());
                    };
                    if(time.getUTCMinutes() < 10){
                        timeMinute = '0'+time.getUTCMinutes();
                    }else{
                        timeMinute = String(time.getUTCMinutes());
                    };
                    if(time.getUTCSeconds() < 10){
                        timeSecond = '0'+time.getUTCSeconds();
                    }else{
                        timeSecond = String(time.getUTCSeconds());
                    }
                    var Time = timeHour+":"+timeMinute+":"+timeSecond;
                    return Time;
                }
            },

            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(new JSONModel(), 'app');
                this.oModel.read('/LoginSet', {
                    success: function(oReturn) {
                        this.getView().getModel('app').setProperty('/login', oReturn.results);
                    }.bind(this)
                });
                this.oModel.read('/ApprovalSet', {
                    success: function(oReturn) {
                        var iAll = new Number;
                        var iRequest = new Number;
                        var iApprove = new Number;
                        var iDeny = new Number
                        for(var i=0; i<oReturn.results.length; i++){
                            ;
                            if(oReturn.results[i].Appstate === 'R'){
                                iRequest += 1;
                            }else if(oReturn.results[i].Appstate === 'A'){
                                iApprove += 1;
                            }else if(oReturn.results[i].Appstate === 'D'){
                                iDeny += 1;
                            }
                            iAll += 1;
                        }
                        this.getView().getModel('app').setProperty('/count', {All : iAll, Req : iRequest, App : iApprove, Den : iDeny});
                        this.getView().getModel('app').setProperty('/all', oReturn.results);
                    }.bind(this)
                })

            },

        });
    });
