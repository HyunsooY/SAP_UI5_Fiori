sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("zprojectteste1406.controller.Main", {
            onInit: function () {
                let datas = {
                    todo : [
                        {content : 'test'}
                    ]
                };
                this.getView().setModel(new JSONModel(datas), 'MainModel');
            },

            onAdd: function() {
                var oDialog = this.byId("addDialog");

                if(oDialog) {
                    oDialog.open();
                }else{
                    this.loadFragment({
                        name : "zprojectteste1406/view/fragment/addDialog"
                    }).then(function(oDialog){
                        oDialog.open();
                    }, this);
                }
            },

            onClose: function(oEvent) {
                var oDialog = oEvent.getSource().getParent();
                var oModel = this.getView().getModel("MainModel");
                var sValue = this.getView().getModel("root").getProperty("/value");
                var aTodo = oModel.getData().todo;
                if(sValue) {
                aTodo.unshift({ content : sValue });
                oModel.setProperty("/todo", aTodo);
                };
                oDialog.close();
            },

            onBeforeOpen: function() {
                // this.getView().getModel("root").setProperty("/value", "");
                this.byId("addInput").setValue();
            },

            onDelete: function() {
                var oTable = this.byId("todoTable");
                var oModel = this.getView().getModel("MainModel");
                var aSelectedIndices = oTable.getSelectedIndices();
                var aDatas = oModel.getProperty("/todo");

                MessageBox.confirm("정말 삭제하시겠습니까?", {
                    title: "Delete",
                    actions: ['YES', 'NO'],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if(oAction === 'YES'){
                            for(var i=aSelectedIndices.length-1; i>=0; i--) {
                                aDatas.splice(aSelectedIndices[i], 1);
                                }
                            oModel.setProperty("/todo", aDatas);
                            };
                        }
                    }
                );
            },

            onRowDelete: function(oEvent) {                                  // 단건 삭제
                var iSelectedIndex = oEvent.getParameters().row.getIndex();  // 선택된 Row 인덱스 추출
                var oModel = this.getView().getModel("MainModel");
                var aDatas = oModel.getProperty("/todo");

                aDatas.splice(iSelectedIndex, 1);
                oModel.setProperty("/todo", aDatas);
            }
        });
    });
