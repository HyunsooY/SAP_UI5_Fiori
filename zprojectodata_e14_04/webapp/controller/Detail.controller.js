sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("zprojectodatae1404.controller.Detail", {
            onInit: function () {
                this.getView().setModel(new JSONModel(), "detail");

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
            },
            _onPatternMatched: function(oEvent) {
                // oEvent.getParameters().arguments
                var oView = this.getView();
                var oArgu = oEvent.getParameter("arguments");
                var oDetailModel = oView.getModel('detail'); // Local JSONModel
                var oModel = oView.getModel(); // Northwind OData Model
                var oFilter = new sap.ui.model.Filter('OrderID', 'EQ', oArgu.key);
                console.log(oArgu); // { key : 10248 }

                oView.setBusy(true);
                // GET : /iwfnd/gw_client
                // .../northwind.svc/Orders?$filter=OrderID eq 10248
                oModel.read("/Orders", {
                    urlParameters: {
                        '$expand' : 'Customer, Employee'
                    },
                    filters: [oFilter],
                    success: function(oReturn) {
                        oView.setBusy(false);
                        // this, scope <- javascript 문법
                        console.log(oReturn.results[0]);
                        /*
                        { data : {OrderID : 10248, CustomerID : '', Customers : ''} }
                        */
                        oDetailModel.setProperty("/data", oReturn.results[0]);
                    }.bind(this),
                    error: function() {
                        oView.setBusy(false);
                        sap.m.MessageToast.show('에러 발생');
                    }
                });
            },
            onNavButtonPress: function() {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain", {}, true);
                // navTo(1,2,3)
                //    1: Route Name
                //    2: Parameters
                //    3: Route History Clear
            }
        });
    });
