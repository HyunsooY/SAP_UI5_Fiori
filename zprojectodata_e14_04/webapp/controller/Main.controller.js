sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectodatae1404.controller.Main", {
            onInit: function () {

            },

            onSelectionChange: function(oEvent) {                             
                var oRouter = this.getOwnerComponent().getRouter();
                var sPath = oEvent.getParameters().listItem.getBindingContextPath();
                var sKey = this.getView().getModel().getProperty(sPath+'/OrderID');

                oRouter.navTo("RouteDetail", {
                    "key" : sKey
                });
            },

            onValueHelpRequest: function() {
                /*
                    CustomerDialog.fragment.xml 오픈

                    해당 Dialog 안에 sap.ui.table.Table 세팅 후,
                    /Customers 바인딩한다. 표시할 필드는 CustomerID, CompanyName
                    팝업에 close 버튼을 구성하여 클릭 시 팝업이 닫히도록 한다.
                */
                sap.m.MessageToast.show("input value help 실행!")
                var oDialog = this.byId("diaCustomers");

                if(oDialog) {
                    oDialog.open();
                }else{
                    this.loadFragment({
                        name : "zprojectodatae1404/view/fragment/CustomerDialog"
                    }).then(function(oDialog){
                        oDialog.open();
                    }, this);
                }
            },

            onClose: function(oEvent) {
                var oDialog = oEvent.getSource().getParent();

                oDialog.close();
            },

            onRowClick: function(oEvent) {
                var oDialog = oEvent.getSource().getParent();
                var sPath = oEvent.getParameters().rowContext.sPath;
                var sKey = this.getView().getModel().getProperty(sPath+'/CustomerID');
                this.byId("idInput").setValue(sKey);
                this._search(sKey);
                oDialog.close();
            },

            _search: function(sKey) {
                var oFilter = new sap.ui.model.Filter('CustomerID', 'EQ', sKey);
                this.byId("idProductsTable").getBinding("items").filter([oFilter]);
                // debugger
            }
        });
    });
