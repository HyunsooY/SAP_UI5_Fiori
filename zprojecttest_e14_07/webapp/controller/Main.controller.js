sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectteste1407.controller.Main", {
            onInit: function () {

            },
            onButtonPress: function() {
                // 버튼 클릭 시 Detail 화면으로 이동

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteDetail", {
                    aa : 'Apple',
                    bb : 'Banana'
                });
            }
        });
    });
