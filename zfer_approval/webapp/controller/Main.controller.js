sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, Fragment, MessageBox) {
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
                    if(!oTime){
                        var time = '';
                        return time;
                    }else{
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

                Telno : function(oTelno) {
                    oTelno = String(oTelno);
                    var Telno = oTelno.substr(0, 3)+"-"+oTelno.substr(4, 4)+"-"+oTelno.substr(7, 4);
                    return Telno;
                },

                Price : function(value1, value2) {
                    var value = Number(value1).toLocaleString()+' '+value2;
                    return value;
                }
            },

            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(new JSONModel(), 'app');
                this.oModel.read('/LoginSet', {
                    success: function(oReturn) {
                        this.getView().getModel('app').setProperty('/login', oReturn.results[0]);
                        this.oLoginmodel = oReturn.results[0];
                    }.bind(this)
                });
                
                this.onSelect();

            },

            onSelect: function() {
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
                });
                var sSelectedkey = this.byId("idIconTabBar").getSelectedKey();
                var sAppstate = new String;
                if(!sSelectedkey){
                    sSelectedkey = 'all';
                }else{
                    if(sSelectedkey === 'req'){
                        sAppstate = 'R';
                    }else if(sSelectedkey === 'app'){
                        sAppstate = 'A';
                    }else if(sSelectedkey === 'den'){
                        sAppstate = 'D';
                    }else{
                        sAppstate = '';
                    }
                }

                let oFilter;
                if (!sAppstate) {
                    oFilter = new Filter({});
                }else{
                   oFilter = new Filter({path:'Appstate', operator:'EQ', value1:sAppstate})
                        
                }
                this.byId("idAppTable").getBinding("rows").filter(oFilter);
            },

            onDocuButton: function(oEvent) {
                var oLogin = this.getView().getModel('app').getProperty('/login');
                var oApproval = oEvent.getSource().getParent().getRowBindingContext().getObject();
                let sRequest = oApproval.Requestid.substr(0, 3);
                this.getView().getModel('app').setProperty('/request', {Request : sRequest});

                this.getView().getModel('app').setProperty('/docu', oApproval);
                if(sRequest === 'CRN'){
                    var sPath = this.oModel.createKey('/CarprhSet', {
                        Prid : oApproval.Requestid
                    });
                    this.oModel.read(sPath, {
                        success: function(oReturn){
                            this.getView().getModel('app').setProperty('/detail', oReturn);
                            var sEmppath = this.oModel.createKey('/EmployeeSet', {
                                Employeeid : oReturn.Prempid
                            })
                            this.oModel.read(sEmppath, {
                                success: function(oReturn) {
                                    this.getView().getModel('app').setProperty('/crn', oReturn);
                                }.bind(this)
                            });
                            this.oModel.read(sPath+'/CarpriSet', {
                                success: function(oReturn){
                                    this.getView().getModel('app').setProperty('/crndetail', oReturn.results);
                                }.bind(this)
                            });
                            this.oModel.read(sPath+'/ApphisSet', {
                                success: function(oReturn){
                                    var aReturn = oReturn.results.map(function(object, index) {
                                        if(index === 0){
                                            if(object.Appstate === 'R'){
                                                object.Approvalid = oLogin.Employeeid;
                                                object.Approvalname = oLogin.Name;
                                                object.Appdate = '';
                                            }  
                                            return object; // 0번째 객체는 그대로 반환
                                        }else{
                                            object.Reportid = '';
                                            object.Reportname = '';
                                            object.Repdate = '';
                                            object.Reptime = '';
                                            if(object.Appstate === 'R'){
                                                object.Approvalid = oLogin.Employeeid;
                                                object.Approvalname = oLogin.Name;
                                                object.Appdate = '';
                                            }   
                                            return object;
                                        };
                                    });
                                var aApphis = [];
                                for(var i=0; i<aReturn.length; i++){
                                if(aReturn[i].Appdounum == oApproval.Appdounum){
                                    aApphis.push(aReturn[i]);
                                    break;
                                }else{
                                    aApphis.push(aReturn[i]);
                                }
                                };
                                this.getView().getModel('app').setProperty('/apphis', aApphis);
                                }.bind(this)
                            })
                        }.bind(this)
                    })
                }else if(sRequest === 'CON'){
                    var sPath = this.oModel.createKey('/CarpohSet', {
                        Poid : oApproval.Requestid
                    });
                    this.oModel.read(sPath, {
                        success: function(oReturn){
                            this.getView().getModel('app').setProperty('/detail', oReturn);
                            var sEmppath = this.oModel.createKey('/EmployeeSet', {
                                Employeeid : oReturn.Poempid
                            })
                            this.oModel.read(sEmppath, {
                                success: function(oReturn) {
                                    this.getView().getModel('app').setProperty('/con', oReturn);
                                }.bind(this)
                            });
                            this.oModel.read(sPath+'/CarpoiSet', {
                                success: function(oReturn){
                                    var iTotal = new Number;
                                    for(var i=0; i<oReturn.results.length; i++){
                                        iTotal = iTotal + oReturn.results[i].Price * oReturn.results[i].Quty;
                                    };
                                    iTotal = iTotal.toLocaleString();
                                    this.getView().getModel('app').setProperty('/contotal', {total : iTotal});
                                    this.getView().getModel('app').setProperty('/condetail', oReturn.results);
                                }.bind(this)
                            });
                            this.oModel.read(sPath+'/ApphisSet', {
                                success: function(oReturn){
                                    var aReturn = oReturn.results.map(function(object, index) {
                                            if(index === 0){
                                                if(object.Appstate === 'R'){
                                                    object.Approvalid = oLogin.Employeeid;
                                                    object.Approvalname = oLogin.Name;
                                                    object.Appdate = '';
                                                }  
                                                return object; // 0번째 객체는 그대로 반환
                                            }else{
                                                object.Reportid = '';
                                                object.Reportname = '';
                                                object.Repdate = '';
                                                object.Reptime = '';
                                                if(object.Appstate === 'R'){
                                                    object.Approvalid = oLogin.Employeeid;
                                                    object.Approvalname = oLogin.Name;
                                                    object.Appdate = '';
                                                }   
                                                return object;
                                            }
                                        });
                                    var aApphis = [];
                                    for(var i=0; i<aReturn.length; i++){
                                        if(aReturn[i].Appdounum == oApproval.Appdounum){
                                            aApphis.push(aReturn[i]);
                                            break;
                                        }else{
                                            aApphis.push(aReturn[i]);
                                        }
                                    };
                                    this.getView().getModel('app').setProperty('/apphis', aApphis);
                                }.bind(this)
                            })
                        }.bind(this)
                    })
                }else if(sRequest === 'RRN'){
                    var sPath = this.oModel.createKey('/RepairSet', {
                        Reprid : oApproval.Requestid
                    });
                    this.oModel.read(sPath, {
                        success: function(oReturn){
                            this.getView().getModel('app').setProperty('/detail', oReturn);
                            var sRepemppath = this.oModel.createKey('/EmployeeSet', {
                                Employeeid : oReturn.Repempid
                            });
                            var sInsemppath = this.oModel.createKey('/EmployeeSet', {
                                Employeeid : oReturn.Insempid
                            });
                            this.oModel.read(sRepemppath, {
                                success: function(oReturn) {
                                    this.getView().getModel('app').setProperty('/rrnrep', oReturn);
                                }.bind(this)
                            });
                            this.oModel.read(sInsemppath, {
                                success: function(oReturn) {
                                    this.getView().getModel('app').setProperty('/rrnins', oReturn);
                                }.bind(this)
                            });
                            this.oModel.read(sPath+'/ApphisSet', {
                                success: function(oReturn){
                                    var aReturn = oReturn.results.map(function(object, index) {
                                            if(index === 0){
                                                if(object.Appstate === 'R'){
                                                    object.Approvalid = oLogin.Employeeid;
                                                    object.Approvalname = oLogin.Name;
                                                    object.Appdate = '';
                                                }  
                                                return object; // 0번째 객체는 그대로 반환
                                            }else{
                                                object.Reportid = '';
                                                object.Reportname = '';
                                                object.Repdate = '';
                                                object.Reptime = '';
                                                if(object.Appstate === 'R'){
                                                    object.Approvalid = oLogin.Employeeid;
                                                    object.Approvalname = oLogin.Name;
                                                    object.Appdate = '';
                                                }   
                                                return object;
                                            }
                                        });
                                    var aApphis = [];
                                    for(var i=0; i<aReturn.length; i++){
                                        if(aReturn[i].Appdounum == oApproval.Appdounum){
                                            aApphis.push(aReturn[i]);
                                            break;
                                        }else{
                                            aApphis.push(aReturn[i]);
                                        }
                                    };
                                    this.getView().getModel('app').setProperty('/apphis', aApphis);
                                }.bind(this)
                            })
                        }.bind(this)
                    })
                }else if(sRequest === 'JCN'){
                    var sPath = this.oModel.createKey('/JunkcarSet', {
                        Junkcarid : oApproval.Requestid
                    });
                    this.oModel.read(sPath, {
                        success: function(oReturn){
                            this.getView().getModel('app').setProperty('/detail', oReturn);
                            var sEmppath = this.oModel.createKey('/EmployeeSet', {
                                Employeeid : oReturn.Employeeid
                            });
                            var sInsemppath = this.oModel.createKey('/EmployeeSet', {
                                Employeeid : oReturn.Insempid
                            });
                            var sRepemppath = this.oModel.createKey('/EmployeeSet', {
                                Employeeid : oReturn.Reportid
                            });
                            var sAppemppath = this.oModel.createKey('/EmployeeSet', {
                                Employeeid : oReturn.Approvalid
                            });
                            this.oModel.read(sEmppath, {
                                success: function(oReturn) {
                                    this.getView().getModel('app').setProperty('/jcnemp', oReturn);
                                }.bind(this)
                            });
                            this.oModel.read(sInsemppath, {
                                success: function(oReturn) {
                                    this.getView().getModel('app').setProperty('/jcnins', oReturn);
                                }.bind(this)
                            });
                            this.oModel.read(sRepemppath, {
                                success: function(oReturn) {
                                    this.getView().getModel('app').setProperty('/jcnrep', oReturn);
                                }.bind(this)
                            });
                            this.oModel.read(sAppemppath, {
                                success: function(oReturn) {
                                    this.getView().getModel('app').setProperty('/jcnapp', oReturn);
                                }.bind(this)
                            });
                            this.oModel.read(sPath+'/ApphisSet', {
                                success: function(oReturn){
                                    var aReturn = oReturn.results.map(function(object, index) {
                                            if(index === 0){
                                                if(object.Appstate === 'R'){
                                                    object.Approvalid = oLogin.Employeeid;
                                                    object.Approvalname = oLogin.Name;
                                                    object.Appdate = '';
                                                }
                                                return object; // 0번째 객체는 그대로 반환  
                                            }else{
                                                object.Reportid = '';
                                                object.Reportname = '';
                                                object.Repdate = '';
                                                object.Reptime = '';
                                                if(object.Appstate === 'R'){
                                                    object.Approvalid = oLogin.Employeeid;
                                                    object.Approvalname = oLogin.Name;
                                                    object.Appdate = '';
                                                }
                                                return object;
                                            }
                                        });
                                    var aApphis = [];
                                    for(var i=0; i<aReturn.length; i++){
                                        if(aReturn[i].Appdounum == oApproval.Appdounum){
                                            aApphis.push(aReturn[i]);
                                            break;
                                        }else{
                                            aApphis.push(aReturn[i]);
                                        }
                                    };
                                    this.getView().getModel('app').setProperty('/apphis', aApphis);
                                }.bind(this)
                            })
                        }.bind(this)
                    })
                };
                var oDetailDialog = this.byId("idDetailDialog");
                var oView = this.getView();
                if(!oDetailDialog){
                    Fragment.load({
                        id: oView.getId(),
                        name: "ER.zferapproval/view/fragment/Detail",
                        controller: this
                    }).then(function(oDialog){
                        oView.addDependent(oDialog);
                        oDialog.open();
                    })
                }else{
                    oDetailDialog.open();
                }
            },

            onDocuClose: function(oEvent) {
                var oDialog = oEvent.getSource().getParent();
                this.byId("idDesc").setValue("");
                this.byId("idDesc").setValueState("None");
                this.byId("idDesc").setValueStateText("");
                this.byId("idIconTabBar").setSelectedKey("");
                this.onSelect();
                oDialog.close();
            },

            onPressApproval: function() {
                let oLogin = this.getView().getModel('app').getProperty('/login');
                let oDocu = this.getView().getModel('app').getProperty('/docu');
                let oDetail = this.getView().getModel('app').getProperty('/detail');
                let sRequest = oDocu.Requestid.substr(0, 3);
                let sPath = this.oModel.createKey('/ApprovalSet', {
                    Appdounum : oDocu.Appdounum
                });
                let oToday = new Date();
                oDocu.Approvalid = oLogin.Employeeid;
                oDocu.Approvalname = oLogin.Name;
                oDocu.Appdate = new Date(oToday.setMinutes(oToday.getMinutes() - oToday.getTimezoneOffset()));
                oDocu.Apptime ='PT'+oToday.getUTCHours()+'H'+oToday.getUTCMinutes()+'M'+oToday.getUTCSeconds()+'S';
                oDocu.Appstate = 'A';
                var iTime = oToday.getUTCHours() * 60 * 60 * 1000 + oToday.getUTCMinutes() * 60 * 1000 + oToday.getUTCSeconds() * 1000;
                MessageBox["success"]("승인 처리 하시겠습니까?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this.oModel.update(sPath, oDocu, {
                                success: function() {
                                    if(sRequest === 'RRN'){
                                        var sCarpath = this.oModel.createKey('/CarSet', {
                                            Carid : oDetail.Carid
                                        });
                                        this.oModel.read(sCarpath, {
                                            success: function(oReturn){
                                                oReturn.Castatus = '5';
                                                this.oModel.update(sCarpath, oReturn, {
                                                    success: function() {

                                                    }.bind(this)
                                                })
                                            }.bind(this)
                                        })
                                    }else if(sRequest === 'JCN'){
                                        var sCarpath = this.oModel.createKey('/CarSet', {
                                            Carid : oDetail.Carid
                                        });
                                        var sJunkpath = this.oModel.createKey('/JunkcarSet', {
                                            Junkcarid : oApproval.Requestid
                                        });
                                        this.oModel.read(sCarpath, {
                                            success: function(oReturn){
                                                oReturn.Castatus = '6';
                                                oReturn.Delflag = 'X';
                                                this.oModel.update(sCarpath, oReturn, {
                                                    success: function() {

                                                    }.bind(this)
                                                })
                                            }.bind(this)
                                        });
                                        oDetail.Staflag = true;
                                        this.oModel.update(sJunkpath, oDetail, {
                                            success: function() {

                                            }.bind(this)
                                        })
                                    }else{
                                    };
                                    MessageBox['success']("승인되었습니다.", {
                                        actions: [MessageBox.Action.YES],
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.YES) {
                                                var aApphis = this.getView().getModel('app').getProperty('/apphis');
                                                var iIndex = aApphis.length - 1;
                                                aApphis[iIndex].Appdate = oDocu.Appdate;
                                                aApphis[iIndex].Apptime.ms = iTime;
                                                aApphis[iIndex].Appstate = oDocu.Appstate;
                                                this.getView().getModel('app').setProperty('/apphis', aApphis);
                                            }
                                        }.bind(this)
                                    });
                                }.bind(this)
                            });
                        }
                    }.bind(this)
                });
            },

            onPressDeny: function() {
                let oLogin = this.getView().getModel('app').getProperty('/login');
                let oDocu = this.getView().getModel('app').getProperty('/docu');
                let sPath = this.oModel.createKey('/ApprovalSet', {
                    Appdounum : oDocu.Appdounum
                });

                let oToday = new Date();
                oDocu.Approvalid = oLogin.Employeeid;
                oDocu.Approvalname = oLogin.Name;
                oDocu.Appdate = new Date(oToday.setMinutes(oToday.getMinutes() - oToday.getTimezoneOffset()));
                oDocu.Apptime ='PT'+oToday.getUTCHours()+'H'+oToday.getUTCMinutes()+'M'+oToday.getUTCSeconds()+'S';
                oDocu.Appstate = 'D';
                oDocu.Returndesc = this.byId("idDesc").getValue();
                this.byId("idDesc").setValueState(oDocu.Returndesc ? "None" : "Error");
                this.byId("idDesc").setValueStateText(oDocu.Returndesc ? "" : "반려 사유를 입력해 주십시오.")

                var iTime = oToday.getUTCHours() * 60 * 60 * 1000 + oToday.getUTCMinutes() * 60 * 1000 + oToday.getUTCSeconds() * 1000;

                if(oDocu.Returndesc){
                    MessageBox["warning"]("반려 처리 하시겠습니까?", {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.YES) {
                                this.oModel.update(sPath, oDocu, {
                                    success: function() {
                                        MessageBox['warning']("반려되었습니다.", {
                                            actions: [MessageBox.Action.YES],
                                            onClose: function (oAction) {
                                                if (oAction === MessageBox.Action.YES) {
                                                    var aApphis = this.getView().getModel('app').getProperty('/apphis');
                                                    var iIndex = aApphis.length - 1;
                                                    aApphis[iIndex].Appdate = oDocu.Appdate;
                                                    aApphis[iIndex].Apptime.ms = iTime;
                                                    aApphis[iIndex].Appstate = oDocu.Appstate;
                                                    aApphis[iIndex].Returndesc = oDocu.Returndesc;
                                                    this.getView().getModel('app').setProperty('/apphis', aApphis);
                                                    this.byId("idDesc").setValue('');
                                                }
                                            }.bind(this)
                                        });
                                    }.bind(this)
                                });
                            }
                        }.bind(this)
                    });
                }else{
                    
                }
            }
        });
    });
