sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, Filter) {
    "use strict";

    return Controller.extend("zprojectodatat14.controller.Main", {
      onInit: function () {
        this.getView().setModel(new JSONModel(), "popup");
      },

      onSearch: function () {
        let sCurrcode = this.byId("idCurrcode").getSelectedKey();
        let sCarrname = this.byId("idCarrname").getValue();
        let aFilter = [];

        if (sCurrcode) aFilter.push(new Filter("Currcode", "EQ", sCurrcode));
        if (sCarrname)
          aFilter.push(new Filter("Carrname", "Contains", sCarrname));

        this.byId("productTable").getBinding("items").filter(aFilter);
      },

      onButtonPress: function (oEvent) {
        let oModel = this.getView().getModel();
        let oPopupModel = this.getView().getModel("popup");
        let sBindPath = oEvent.getSource().getBindingContext().getPath();

        oModel.read(sBindPath, {
          urlParameters: { $expand: "to_Item" },
          success: function (oReturn) {
            console.log(oReturn);
            oPopupModel.setData(oReturn);
          }.bind(this),
        });

        this.onOpenDialog();

        // var oSelectedData = oEvent
        //   .getSource()
        //   .getBindingContext()
        //   .getObject({ expand: "to_Item" });
        // var aDetail = oSelectedData.to_Item;
      },

      onOpenDialog: function () {
        if (!this.pDialog) {
          this.pDialog = this.loadFragment(
            {
              name: "zprojectodatat14.view.DetailDialog",
            },
            this
          );
        }
        this.pDialog.then(
          function (oDialog) {
            oDialog.open();
          }.bind(this)
        );
      },
      onClose: function () {
        this.byId("SeatsDialog").close();
      },
    });
  }
);
