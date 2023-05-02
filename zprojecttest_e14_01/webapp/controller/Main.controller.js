sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        // 클로저 변수
        var test = 'hihi';

        return Controller.extend("zprojectteste1401.controller.Main", {
            iNumber : 20,
            onInit: function () {
                this.test2 = 'hihi2';
                // this.iNumber = 20;

                // this.byId("idInput1").setValue(10);
                // this.byId("idInput2").setValue(20);
                // this.byId("idSelect1").setSelectedKey("multiply");
            },
            onButtonPress: function(oEvent) {
                        //    debugger;
                //주석
                /* 다중주석 */
                // alert('버튼 이벤트 함수 실행!');
                
                // <접근 방식>
                // test = 'hello'; // 클로저 변수
                // this.test2  // Controller에 붙은 변수
                // this.iNumber  // Controller에 붙은 변수 2

                let sValue = this.byId("idInput1").getValue();
                alert(sValue);

                this._getSum(10, 20, 30);
            },
            _getSum : function(a, b, c) {
                return a+b+c;
            },

            onClick: function() {
                var oInput = this.byId("idCustomer"); // Input 객체
                var oLabel = oInput.getLabels()[0]; // Label 객체

                // oLabel.getText(); //'Customer'

                console.log(oLabel.getText());

            }
        });
    });
