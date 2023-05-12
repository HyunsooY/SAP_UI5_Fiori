sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("ER.zfermembership.controller.Join", {
            formatter: {
                dateTime: function(oDate) {
                    let oDateTime;

                    oDateTime = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern : 'yyyy-MM-dd HH:mm:ss'
                    });

                    return oDateTime.format(oDate);
                }
            },
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteJoin").attachPatternMatched(this._onPatternMatched, this);
                this.getView().setModel(new JSONModel(), "join");
                this._defaultSet();
                let today = new Date;              
                this.oModel.read("/CustidSet",{
                    success : function(oReturn){
                        console.log("READ: ", oReturn.results[0]); // oReturn.results[0].CustidMax
                        // var nID = Number(oReturn.results[0].CustidMax.substr(1,5));
                        // nID += 1;
                        // var sID = new String(nID);
                        // sID = 'E' + sID.padStart(5, '0');
                        // this.byId("idInputID").setValue(sID);
                        this.byId("idInputID").setValue(oReturn.results[0].CustidMax);
                    }.bind(this)
                });
                this.byId("idJDate").setValue(`${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}`);
            },
            _defaultSet: function() {
                // odata model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel();
                // json model 변수 세팅
                this.oMainModel = this.getView().getModel("join");
                // table 객체
                this.oTable = this.byId("idTable");
            },
            _onPatternMatched: function(oEvent) {
                // oEvent.getParameters().arguments
                var oArgu = oEvent.getParameter("arguments");
            },

            onLogin: function() {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain", {}, true);
            },            
            onCreate: function() {
                let oData = this.oMainModel.getData();

                // if(iName === '' || iBirth === '' || iTel === '' || iAdd === '' || iLic === ''){
                //     this.onValueChange();
                // }else{
                //     this.oModel.create("/CustomerSet", oData, {
                //         success: function() {
                //             sap.m.MessageToast.show("Create Success!");
                //         },
                //         error: function() {
                //             sap.m.MessageToast.show("Error Success!");
                //         }
                //     });
                // }
                this.oModel.create("/CustomerSet", oData, {
                    success: function() {
                        sap.m.MessageToast.show("Create Success!");
                    },
                    error: function() {
                        sap.m.MessageToast.show("Error Success!");
                    }
                });
                
            },
            onValueChange: function(oEvent) {
                let oControlName = this.byId("idInputName");
                let oControlBirth = this.byId("idBirthDate");
                let oControlTel = this.byId("idInputTel");
                let oControlAdd = this.byId("idInputAdd");
                let oControlLic = this.byId("idInputLic");
                let iName = oControlName.getValue();
                let iBirth = oControlBirth.getValue();
                let iTel = oControlTel.getValue();
                let iAdd = oControlAdd.getValue();
                let iLic = oControlLic.getValue();

                oControlName.setValueState(iName ? 'None' : 'Error');
                oControlName.setValueStateText(iName ? '' : '이름을 입력해주세요.');
                oControlBirth.setValueState(iBirth ? 'None' : 'Error');
                oControlBirth.setValueStateText(iBirth ? '' : '생년월일을 입력해주세요.');
                oControlTel.setValueState(iTel ? 'None' : 'Error');
                oControlTel.setValueStateText(iTel ? '' : '전화번호를 입력해주세요.');
                oControlAdd.setValueState(iAdd ? 'None' : 'Error');
                oControlAdd.setValueStateText(iAdd ? '' : '주소를 입력해주세요.');
                oControlLic.setValueState(iLic ? 'None' : 'Error');
                oControlLic.setValueStateText(iLic ? '' : '면허번호를 입력해주세요.');

                this.byId("idBDate").setValue(this.byId("idBirthDate").getValue());

                this.byId("idButton").setEnabled(iName !== '' && iBirth !== '' && iTel !== '' && iAdd !== '' && iLic !== ''? true : false);
            }
        });
    });
