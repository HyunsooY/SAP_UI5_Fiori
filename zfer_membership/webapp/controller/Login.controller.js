sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, MessageBox) {
        "use strict";

        return Controller.extend("ER.zfermembership.controller.Login", {
            formatter: {
                dateTime: function(oDate) {
                    let oDateTimeInstance;

                    oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern : 'yyyy-MM-dd'
                    });

                    return oDateTimeInstance.format(oDate);
                }
            },

            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteLogin").attachPatternMatched(this._onPatternMatched, this);
                this.getView().setModel(new JSONModel(), "login");
                this._defaultSet();
            },
            _defaultSet: function() {
                // odata model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel();
                // json model 변수 세팅
                this.oMainModel = this.getView().getModel("login");
            },
            _onPatternMatched: function(oEvent) {
                var oArgu = oEvent.getParameter("arguments");
                // var oLoginModel = this.getView().getModel();
                let sPath = this.oModel.createKey("/LoginSet", {
                    Custid : oArgu.Custid,
                    Name : oArgu.Name
                    });
                let sLoginPath = this.oModel.createKey("/CustomerSet", {
                    Custid : oArgu.Custid
                })
                this.oModel.read(sPath, {
                    success: function(oReturn) {
                        console.log(oReturn);
                        this.oMainModel.setProperty('/login', oReturn);
                    }.bind(this)
                });
                this.oModel.read(sLoginPath, {
                    success: function(oReturn) {
                        console.log(oReturn);
                        this.oMainModel.setProperty('/customer', oReturn);
                    }.bind(this)
                })
            },

            onLogout: function() {
                var oRouter = this.getOwnerComponent().getRouter();
                MessageBox["confirm"]("로그아웃하시겠습니까?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            oRouter.navTo("RouteMain", {}, true);
                        }
                    }.bind(this)
                });
                
                
            },
            
            // onBeforeRendering: function () {
            //     var oButton = this.byId("buttonBack");
            //     oButton.setEnabled(false);
            // },
    
            // onAfterRendering: function () {
            //     this.byId("quickViewCardContainer").$().css("maxWidth", "320px");
            // },

            // onMyPage: function() {
            //     var oDialog = this.byId("MyPageDialog");

            //     if(oDialog) {
            //         oDialog.open();
            //     }else{
            //         this.loadFragment({
            //             name : "ER.zfermembership/view/fragment/Mypage"
            //         }).then(function(oDialog){
            //             oDialog.open();
            //         }, this);
            //     }
            // },

            onMyPage: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();
    
                // create popover
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "ER.zfermembership/view/fragment/Mypage",
                        controller: this
                    }).then(function(oPopover) {
                        oView.addDependent(oPopover);
                        // oPopover.bindElement("/ProductCollection/0");
                        return oPopover;
                    });
                }
                this._pPopover.then(function(oPopover) {
                    oPopover.openBy(oButton);
                });
            },

            onInfoChange: function() {
                this.byId("idTelnoText").setVisible(false);
                this.byId("idAddressText").setVisible(false);
                this.byId("idTelnoInput").setVisible(true);
                this.byId("idAddressInput").setVisible(true);
            },

            onInfoUpdate: function() {
                let jsonData = this.oMainModel.getProperty("/customer");
                let sFullPath = this.oModel.createKey("/CustomerSet", {
                    Custid : jsonData.Custid
                });
                jsonData.Telno = this.byId("idTelnoInput").getValue();
                jsonData.Address = this.byId("idAddressInput").getValue();
                console.log(jsonData);

                MessageBox["confirm"]("정보를 변경하시겠습니까?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this.oModel.update(sFullPath, jsonData, {
                                success: function() {
                                    sap.m.MessageToast.show("변경되었습니다.");
                                    this.byId("idTelnoInput").setVisible(false);
                                    this.byId("idAddressInput").setVisible(false);
                                    this.byId("idTelnoText").setVisible(true);
                                    this.byId("idAddressText").setVisible(true);
                                }.bind(this)
                            });
                        }else{
                            sap.m.MessageToast.show("취소되었습니다."); 
                        }
                    }.bind(this)
                });
                
                
            },

            onInfoDelete: function() {
                var oRouter = this.getOwnerComponent().getRouter();
                let jsonData = this.oMainModel.getProperty("/customer");
                let sFullPath = this.oModel.createKey("/CustomerSet", {
                    Custid : jsonData.Custid
                });
                jsonData.Delflag = 'X';

                MessageBox["warning"]("탈퇴하시겠습니까?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this.oModel.update(sFullPath, jsonData, {
                                success: function() {
                                    sap.m.MessageToast.show("탈퇴가 성공적으로 완료되었습니다. 지금까지 EReON을 이용해주셔서 감사합니다.");
                                    this.byId("idTelnoInput").setVisible(false);
                                    this.byId("idAddressInput").setVisible(false);
                                    this.byId("idTelnoText").setVisible(true);
                                    this.byId("idAddressText").setVisible(true);
                                    oRouter.navTo("RouteMain", {}, true);
                                }.bind(this)
                            });
                        }else{
                            sap.m.MessageToast.show("취소되었습니다."); 
                        }
                    }.bind(this)
                });
            },
    
            // handleEmailPress: function (oEvent) {
            //     this.byId("MyPageDialog").close();
            //     MessageToast.show("E-Mail has been sent");
            // }
            
    
            // onButtonBackClick: function () {
            //     var oQuickViewCard = this.byId("quickViewCard");
            //     oQuickViewCard.navigateBack();
            // },
    
            // onNavigate: function (oEvent) {
            //     var oNavOrigin = oEvent.getParameter("navOrigin");
    
            //     if (oNavOrigin) {
            //         MessageToast.show("Link '" + oNavOrigin.getText() + "' was clicked");
            //     } else {
            //         MessageToast.show("Back button was clicked");
            //     }
            // },
    
            // onAfterNavigate: function (oEvent) {
            //     var oButton = this.byId("buttonBack");
            //     oButton.setEnabled(!oEvent.getParameter("isTopPage"));
            // }
        });
    });
