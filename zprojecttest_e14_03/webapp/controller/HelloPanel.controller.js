sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectteste1403.controller.HelloPanel", {
            onInit: function () {

            },
            onHelloPress: function() {
                // sap.ui.core.Fragment.load({
                //     name: "zprojectteste1403.view.fragment.HelloDialog",
                //     type: "XML",
                //     controller: this
                // }.then(function(oDialog) {
                //     oDialog.open();
                // }));
                var oDialog = this.byId("helloDialog"); // undefined

                if (oDialog) {
                    oDialog.open();
                    return;
                }

                this.loadFragment({
                    name: "zprojectteste1403.view.fragment.HelloDialog"
                }).then(function(oDialog) {
                    oDialog.open();
                }, this);
            },
            onClose: function(oEvent) {
                var oDialog = oEvent.getSource().getParent(); // Dialog 객체
                
                oDialog.close();
            }
        });
    });
