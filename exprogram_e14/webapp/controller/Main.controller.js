sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter) {
        "use strict";

        return Controller.extend("exprograme14.controller.Main", {
            onInit: function () {
                var oData = {
                    list : [
                        { code : 'USD' },
                        { code : 'EUR' },
                        { code : 'KRW' }
                    ]
                };
                this.getView().setModel(new JSONModel(oData), "code");
                this.getView().setModel(new JSONModel(), "name")
                this.getView().setModel(new JSONModel(), "book");
                this.oDataModel = this.getOwnerComponent().getModel();
            },
            onButtonPress: function() {
                let sCurrcode = this.byId("idComboBox").getSelectedKey();
                let sCarrname = this.byId("idInput").getValue();
                let oFilter; 
                if (!sCurrcode && !sCarrname) {
                    oFilter = new Filter([]);
                }else{
                   oFilter = new Filter({
                        filters : [
                            new Filter({path:'Currcode', operator:'EQ', value1:sCurrcode}),
                            new Filter({path:'Carrname', operator:'Contains', value1:sCarrname})
                        ],
                        and: true
                    });
                }
                this.byId("idTable").getBinding("items").filter([oFilter]);
            },
            onDetailButton: function(oEvent) {
                var oDialog = this.byId("idDialog");
                var sBindPath = oEvent.getSource().getBindingContext().sPath;
    
                this.oDataModel.read(sBindPath, {
                    urlParameters: { $expand: "to_Item" },
                    success: function(oReturn) {
                        this.getView().getModel("name").setProperty('/', oReturn);
                        this.getView().getModel("book").setProperty('/Book', oReturn.to_Item.results);
                    }.bind(this),
                });

                if(oDialog){
                    oDialog.open();
                }else{
                    this.loadFragment({
                        name: "exprograme14/view/fragment/Book"
                    }).then(function(oDialog) {
                        oDialog.open();
                    }, this)
                };
            },
            onClose: function(oEvent) {
                var oDialog = oEvent.getSource().getParent();
                oDialog.close();
            }
        });
    });
