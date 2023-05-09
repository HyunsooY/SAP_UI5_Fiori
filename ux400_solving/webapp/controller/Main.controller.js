sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sap.btp.ux400solving.controller.Main", {
            formatter: {
                transformDiscontinued : function(sDiscontinued) {
                    if(sDiscontinued == true) {
                        sDiscontinued = 'Yes';
                    }else{
                        sDiscontinued = 'No';  
                    };
                    return sDiscontinued; // return sDiscontinued === true ? 'Yes' : 'No';
                }
            },

            onInit: function () {
                var oRandomData = {
                    Random : [
                        {value : ''}
                    ]
                };
                oRandomData.Random.pop();
                this.getView().setModel(new JSONModel(oRandomData), 'list');
            },
            
            onRandomPress: function() {
                let sRandom = new String;
                let oData = this.getView().getModel("list").getData().Random;
                this.byId("idInput").setValue(Math.floor(Math.random()*100) + 1);
                sRandom = this.byId("idInput").getValue();
                oData.push({
                    value : sRandom
                });
                
                this.getView().getModel("list").setProperty("/Random", oData);
            },

            onDialog: function() {
                var oDialog = this.byId("productsDialog");
                if(oDialog) {
                    oDialog.open();
                }else{
                    this.loadFragment({
                        name : "sap.btp.ux400solving/view/fragment/Products"
                    }).then(function(oDialog){
                        oDialog.open();
                    }, this);
                };
            },

            onClose: function(oEvent) {
                var oDialog = oEvent.getSource().getParent();
                oDialog.close();
            },

            onValueChange: function(oEvent) {
                // var oInput = oEvent.getSource();
                // var iValue = parseInt(oInput.getValue());
                // if(iValue < 1 || iValue > 100 ){
                //     oInput.setValueState('Error');
                //     oInput.setValueStateText('1 이상 100 이하의 숫자를 입력하세요.');
                // }else{
                //     oInput.setValueState('None');
                //     oInput.setValueStateText('');
                // }
                let oControl = this.byId("idInput");
                let iNum = Number(oControl.getValue());
                let isOK = iNum >= 1 && iNum <= 100; // true 또는 false

                oControl.setValueState(isOK ? 'None' : 'Error');
                oControl.setValueStateText(isOK ? '' : '1~100 사이의 숫자를 입력하세요');
                this.byId("idButton").setEnabled(isOK ? true : false);
            }
        });
    });
