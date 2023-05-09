sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sap.btp.ux410solving.controller.Detail", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                // 라우터 Pattern이 일치할 때마다 _onPatternMatched() 실행
                oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
                
            },
            _onPatternMatched: function(oEvent) {
                const oView = this.getView(),
                    oModel = oView.getModel(),
                    oArgs = oEvent.getParameter("arguments");  // 이벤트 객체에 파라미터 정보가 있음

                // '/Order_Details(OrderID='파라미터 정보',ProductID='파라미터 정보')'를 sBindPath 변수에 담음
                let sBindPath = oModel.createKey("/Order_Details", {
                    OrderID : oArgs.OrderID,
                    ProductID: oArgs.ProductID,
                });
                // sBindPath = '/Order_Details(OrderID='+oArgs.OrderID+',ProductID='+oArgs.ProductID+')';
                // sBindPath = '/Order_Details(OrderID=${oArgs.OrderID},ProductID=${oArgs.ProductID})';
                oView.bindElement(sBindPath);  // View에 해당 데이터 세팅 
                                               // 해당 Binding 방법을 Element Binding 또는 Context Binding 이라고 부름
            },
        });
    });
