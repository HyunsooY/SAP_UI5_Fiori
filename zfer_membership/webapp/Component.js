/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
var _rootPath = jQuery.sap.getModulePath("ER.zfermembership").split('/~')[0];
// var oModel = new sap.ui.model.json.JSONModel({ rootPath: _rootPath });
// sap.ui.getCore().setModel(oModel, "config");
sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "ER/zfermembership/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("ER.zfermembership.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);