sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectodatae1404.controller.Detail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
            },
            _onPatternMatched: function(oEvent) {
                // oEvent.getParameters().arguments
                var oArgu = oEvent.getParameter("arguments");
                var oModel = this.getView().getModel(); // Northwind OData Model
                var oFilter = new sap.ui.model.Filter('OrderID', 'EQ', oArgu.key);
                console.log(oArgu); // { key : 10248 }

                oModel.read("/Orders", {
                    filters: [oFilter],
                    success: function(oReturn) {
                        console.log(oReturn.results[0]);
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
