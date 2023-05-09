sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ER.zfermembership.controller.Main", {
            onInit: function () {

            },
            onJoin: function() {

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteJoin", {});
            }
        });
    });
