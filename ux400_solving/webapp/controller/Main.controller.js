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
        });
    });
