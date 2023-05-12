sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, JSONModel) {
        "use strict";

        return Controller.extend("sap.btp.ux410solving.controller.Main", {
            onInit: function () {
                var oType = {
                    Type :[
                        {type : 'bar'},
                        {type : 'column'},
                        {type : 'line'},
                        {type : 'donut'}
                    ]
                }
                this.getView().setModel(new JSONModel(oType), "typeList");
            },
            onSearch: function() {
                let sOrderID = this.byId("idComboBox").getSelectedKey();
                let sType = this.byId("idComboBoxType").getSelectedKey();
                let oFilter;
                // let oFilter = sOrderID ? new Filter("OrderID","EQ",sOrderID) : [];
                // new Filter("Date", "BT", 오늘, 내일); -> BT 일 경우 Value 2개 설정

                // if(!sType){
                //     this.byId("idComboBoxType").setValueState("Error");
                //     return;  // return문을 타면 아래 로직은 타지 않음
                // }
                // this.byId("idComboBoxType").setValueState("None");

                if (sOrderID) oFilter = new Filter("OrderID", "EQ", sOrderID);
                this.byId("idVizFrame").setVizType(sType);
                this.byId("idDataset").getBinding("data").filter(oFilter);
            },
            onValueChange: function() {
                let oControl = this.byId("idComboBoxType");
                let sType = oControl.getSelectedKey();

                oControl.setValueState(!sType ? 'Error' : 'None');
                oControl.setValueStateText(!sType ? 'Invalid Entry' : '' );
            },
            onSelectData: function(oEvent) {
                const oRouter = this.getOwnerComponent().getRouter(),
                    oData = oEvent.getParameters().data[0].data,  // 선택한 데이터 정보 얻기
                    oVizFrame = this.byId("idVizFrame");

                oVizFrame.vizSelection(oData, { clearSelection : true });  // 선택된 것 초기화

                oRouter.navTo("RouteDetail", {  // Detail로 이동
                    OrderID : oData.OrderID,
                    ProductID : oData.ProductID
                });
            }
        });
    });
