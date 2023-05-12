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
                
                // oModel.read(sBindPath, {
                //     success: function(oReturn) {
                //         // oReturn 안에 조회 데이터가 JSON 형태로 들어오게 됨
                //         // 해당 데이터를 가지고 데이터 가공을 할 수 있음
                //         // 여기에서 데이터를 받아와 데이터 핸들링 해야함
                //     }
                // });
                // // 여기다가 데이터 핸들링 하면 오류 발생, 불러와서 success 함수 안에 진행해야 함
            },
        });
    });
