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

        return Controller.extend("zprojectteste1404.controller.Main", {
            onInit: function () {
                let datas = {
                    title : {
                        subTitle : 'Json Title'
                    },
                    list : [
                        {num1 : 33, oper : "+", num2 : 10, result : 43}
                        // {name : 'moon', age : 20},
                        // {name : 'hong', age : 21},
                        // {name : 'kim', age : 22},
                        // {name : 'park', age : 23},
                        // {name : 'song', age : 24}
                    ],
                    todo : [
                        {content : 'test'}
                    ]
                };
                // var oModel = new JSONModel();
                // oModel.loadData( sap.ui.require.toUrl("zprojectteste1404/model/data.json") );
                this.getView().setModel(new JSONModel(datas), 'MainModel');
            },

            onChange: function() {
                var oModel = this.getView().getModel("MainModel");
                // var oData = oModel.getData(); // 전체 데이터를 다 가져옴
                // // // oModel.getProperty("/title/subTitle"); // 특정 경로에 해당하는 데이터 가져옴
                                
                // // console.log('변경 전 : ', oData.title.subTitle);
                // oModel.getProperty("/title/subTitle");
                // oModel.setProperty("/title/subTitle", 'hihi')


                // console.log('변경 전 : ', oData.list[4].age);
                // oData.title.subTitle = 'change Title';
                // // oModel.setData(oData);
                // oData.list[4].age = 100;
                // oModel.setData(oData);

                // var sText = oData.list[0].name; // 'moon'
                //     this.byId("idText").setText(sText);

                var oData = oModel.getProperty("/title/subTitle");
                console.log('변경 전 : ', oData);
                oModel.setProperty("/title/subTitle", 'Change Title');
            },

            onDisplay: function() {
                var oModel = this.getView().getModel("MainModel");
                // var oData = oModel.getData(); // 전체 데이터를 다 가져옴
                // // console.log('변경 후 : ', oData.title.subTitle);
                // console.log('변경 후 : ', oData.list[4].age);
                var oData = oModel.getProperty("/title/subTitle");
                console.log('변경 후 : ', oData);
            },

            onButtonPress: function(oEvent) {
                var oModel = this.getView().getModel("MainModel"),
                    aList = oModel.getData().list; //[{}]
                let oSelect = this.byId("idSelect").getSelectedItem(),
                    iNum1 = Number(this.byId("idInput1").getValue()),
                    iNum2 = Number(this.byId("idInput2").getValue()),
                    result = 0;
                let sMsg = '';

                    switch (oSelect.getKey()) {
                        case 'plus':
                            result = iNum1 + iNum2;
                        break;
                        case 'minus':
                            result = iNum1 - iNum2;
                        break;
                        case 'multiply':
                            result = iNum1 * iNum2;
                        break;
                        case 'divide':
                            result = iNum1 / iNum2;
                        break;
                        default:
                            break;
                    }

                    sMsg = `${iNum1} ${oSelect.getText()} ${iNum2} = ${result}`;
                                   
                    // MessageToast.show(sMsg);
                    MessageBox.show(sMsg, {
                        icon: MessageBox.Icon.INFORMATION,
                        title: "My message box title",
                        actions: [MessageBox.Action.YES],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if(oAction === 'YES'){
                                aList.push({
                                    num1 : iNum1,
                                    oper : oSelect.getText(),
                                    num2 : iNum2,
                                    result : result
                                });

                                oModel.setProperty("/list", aList);
                            }
                        }
                    } );
            },

            onAdd: function() {
                var oDialog = this.byId("addDialog");

                if(oDialog) {
                    oDialog.open();
                }else{
                    this.loadFragment({
                        name : "zprojectteste1404/view/fragment/addDialog"
                    }).then(function(oDialog){
                        oDialog.open();
                    }, this);
                }
            },

            onClose: function(oEvent) {
                var oDialog = oEvent.getSource().getParent();
                // var sValue = oDialog.getContent()[0].getItems()[1].getValue();
                // console.log(sValue);
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
