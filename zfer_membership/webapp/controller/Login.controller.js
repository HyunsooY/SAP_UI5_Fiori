sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
    "sap/ui/core/library",
    "sap/ui/model/Filter",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, MessageBox, CoreLibrary, Filter, Dialog, Button, Text) {
        "use strict";

        var ValueState = CoreLibrary.ValueState,
		oData = {
			reviewButton: false,
			backButtonVisible: false,
        };

        return Controller.extend("ER.zfermembership.controller.Login", {
            formatter: {
                dateTime: function(oDate) {
                    if(oDate === '취소 차량'){
                        var Cancelcar = '취소 차량'
                        return Cancelcar;
                    }else if(oDate === '대여 중'){
                        var Rent = '대여 중'
                        return Rent;
                    }else{
                        let oDateTimeInstance;

                        oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance({
                            pattern : 'yyyy-MM-dd'
                        });

                        return oDateTimeInstance.format(oDate);
                    }
                },
                Time: function(oTime) {
                    if (oTime === 'X') {
                        var Time = '';
                        return Time;
                    } else {
                        var time = new Date(oTime);
                        var timeHour = new String;
                        var timeMinute = new String;
                        var timeSecond = new String;

                        if(time.getUTCHours() < 10){
                            timeHour = '0'+time.getUTCHours();
                        }else{
                            timeHour = String(time.getUTCHours());
                        };
                        if(time.getUTCMinutes() < 10){
                            timeMinute = '0'+time.getUTCMinutes();
                        }else{
                            timeMinute = String(time.getUTCMinutes());
                        };
                        if(time.getUTCSeconds() < 10){
                            timeSecond = '0'+time.getUTCSeconds();
                        }else{
                            timeSecond = String(time.getUTCSeconds());
                        }
                        var Time = timeHour+":"+timeMinute+":"+timeSecond;
                        return Time;
                    }
                }
            },

            onInit: function () {
                var oModel = new JSONModel(),
				oInitialModelState = Object.assign({}, oData);
			    oModel.setData(oInitialModelState);

                var oRouter = this.getOwnerComponent().getRouter();
                
                oRouter.getRoute("RouteLogin").attachPatternMatched(this._onPatternMatched, this);
                this.getView().setModel(new JSONModel(), "login");
                this.getView().setModel(new JSONModel(), "charge");
                this._defaultSet();

                this.getView().setModel(new JSONModel(), "onzone");
                this.oModel.read('/OnzoneinfoSet', {
                    success: function(oReturn){
                        this.getView().getModel("onzone").setProperty('/list1', oReturn.results);
                        this.getView().getModel("onzone").setProperty('/list2', oReturn.results);
                    }.bind(this)
                });
                
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
                });
                let sCntPath = this.oModel.createKey("/RetcountSet", {
                    Custid : oArgu.Custid
                });

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
                });

                this.oModel.read(sCntPath, {
                    success: function(oReturn){
                        this.getView().getModel("charge").setProperty('/retcount', oReturn);
                    }.bind(this)
                });
                
                var Retcount = this.getView().getModel("charge").getProperty('/retcount/Rentalcount');
                var Grade = new String;
                if(Retcount >= 20 && Retcount < 40){
                    Grade = 'N';
                }else if(Retcount >= 40 && Retcount < 70){
                    Grade = 'O';
                }else if(Retcount >= 70 && Retcount < 100){
                    Grade = 'R';
                }else if(Retcount >= 100){
                    Grade = 'E';
                }else{
                    Grade = 'Z';
                }
                var sGradePath = this.oModel.createKey("/GradeSet", {
                    Gradeid : Grade
                });
                this.oModel.read(sGradePath, {
                    success: function(oReturn){
                        this.getView().getModel("charge").setProperty('/grade', oReturn);
                    }.bind(this)
                });
            },

            onLogout: function() {
                var oRouter = this.getOwnerComponent().getRouter();
                MessageBox["confirm"]("로그아웃하시겠습니까?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this.byId("item1").setSelected(true);
                            this.byId("item2").setSelected(false);
                            this.byId("item3").setSelected(false);
                            this.byId("item4").setSelected(false);
                            this.byId("item5").setSelected(false);
                            this.byId("item6").setSelected(false);
                            this.byId("item7").setSelected(false);
                            this.byId("idHome").setVisible(true);
                            this.byId("idMyInfo").setVisible(false);
                            this.byId("idMyRental").setVisible(false);
                            this.byId("idMyRentalHistory").setVisible(false);
                            oRouter.navTo("RouteMain", {}, true);
                        }
                    }.bind(this)
                });
            },

            onInfoChange: function() {
                this.byId("idTelnoText").setVisible(false);
                this.byId("idAddressText").setVisible(false);
                this.byId("idTelnoInput").setVisible(true);
                this.byId("idAddressInput").setVisible(true);
                this.byId("idInfoUpdate").setEnabled(true);
            },

            onInfoUpdate: function() {
                let jsonData = this.oMainModel.getProperty("/customer");
                let sFullPath = this.oModel.createKey("/CustomerSet", {
                    Custid : jsonData.Custid
                });
                jsonData.Telno = this.byId("idTelnoInput").getValue();
                jsonData.Address = this.byId("idAddressInput").getValue();

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
                this.byId("idInfoUpdate").setEnabled(false);  
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
                                    MessageBox['confirm']("탈퇴가 성공적으로 완료되었습니다. 지금까지 EReON을 이용해주셔서 감사합니다.", {
                                        actions: [MessageBox.Action.YES],
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.YES) {
                                                this.byId("idTelnoInput").setVisible(false);
                                                this.byId("idAddressInput").setVisible(false);
                                                this.byId("idTelnoText").setVisible(true);
                                                this.byId("idAddressText").setVisible(true);
                                                oRouter.navTo("RouteMain", {}, true);
                                            }
                                        }.bind(this)
                                    })
                                }.bind(this)
                            });
                        }else{
                            sap.m.MessageToast.show("취소되었습니다."); 
                        }
                    }.bind(this)
                });
            },

            onSelectionChange: function(oEvent) {
                let sText = oEvent.getParameters().item.mProperties.text;
                let jsonData = this.oMainModel.getProperty("/login");
                let sCurrentPath = this.oModel.createKey("/CurRentalSet", {
                    Custid : jsonData.Custid
                });
                let sHisPath = this.oModel.createKey("/RentalInfoSet", {
                    Custid : jsonData.Custid
                });
                if(sText === 'Home'){
                    this.byId("idHome").setVisible(true);
                    this.byId("idMyInfo").setVisible(false);
                    this.byId("idMyRental").setVisible(false);
                    this.byId("idMyRentalHistory").setVisible(false);
                }else if(sText === '내 정보'){
                    this.byId("idHome").setVisible(false);
                    this.byId("idMyInfo").setVisible(true);
                    this.byId("idMyRental").setVisible(false);
                    this.byId("idMyRentalHistory").setVisible(false);
                }else if (sText === '차량 대여'){
                    this.byId("idHome").setVisible(true);
                    this.byId("idMyInfo").setVisible(false);
                    this.byId("idMyRental").setVisible(false);
                    this.byId("idMyRentalHistory").setVisible(false);
                }else if(sText === '대여 신청'){
                    var oView = this.getView();
                    this.oModel.read(sCurrentPath, {
                        success: function() {
                            MessageBox['warning']("현재 대여 중인 차량이 있어 추가 예약이 불가합니다.", {
                                actions: [MessageBox.Action.YES],
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.YES) {   
                                    }
                                }.bind(this)
                            })
                        },
                        error: function() {   
                            if (!this._pDialog) {
                                this._pDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "ER.zfermembership/view/fragment/Rental",
                                    controller: this
                                }).then(function(oDialog) {
                                    oDialog.attachAfterOpen(this.onDialogAfterOpen, this);
                                    oView.addDependent(oDialog);
                                    return oDialog;
                                }.bind(this));
                            };
                            this._pDialog.then(function(oDialog){
                                oDialog.open();
                            });
                            this.byId("idHome").setVisible(true);
                            this.byId("idMyInfo").setVisible(false);
                            this.byId("idMyRental").setVisible(false);
                            this.byId("idMyRentalHistory").setVisible(false);
                        }.bind(this)
                    });
                }else if(sText === '대여 확인'){
                    this.oModel.read(sCurrentPath, {
                        success: function(oReturn) {
                            // 보험료 비율 하드 코딩..
                            if(oReturn.Insurance === 'I05'){
                                oReturn.Retfee = oReturn.Retfee * (1 + 10 / 100);
                            }else if(oReturn.Insurance === 'I30'){
                                oReturn.Retfee = oReturn.Retfee * (1 + 7 / 100);
                            }else if(oReturn.Insurance === 'I70'){
                                oReturn.Retfee = oReturn.Retfee * (1 + 5 / 100);
                            };

                            oReturn.Retfee = (Math.floor((Math.floor(oReturn.Retfee)) / 10) * 10).toLocaleString();
                            this.byId("idRettotfeeCheck").setText(oReturn.Retfee);
                            this.getView().getModel("login").setProperty('/rental', oReturn);
                            this.byId("idHome").setVisible(false);
                            this.byId("idMyInfo").setVisible(false);
                            this.byId("idMyRental").setVisible(true);
                            this.byId("idMyRentalHistory").setVisible(false);
                        }.bind(this),

                        error: function() {
                            MessageBox['warning']("현재 대여 중인 차량이 없습니다.", {
                                actions: [MessageBox.Action.YES],
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.YES) {
                                        this.byId("idHome").setVisible(true);
                                        this.byId("idMyInfo").setVisible(false);
                                        this.byId("idMyRental").setVisible(false);
                                        this.byId("idMyRentalHistory").setVisible(false);
                                    };
                                }.bind(this)
                            });
                        }.bind(this)
                    });
                    
                }else if(sText === '대여 이력'){
                    var oFilterHis = new Filter('Custid', 'EQ', jsonData.Custid);
                    this.oModel.read('/RentalInfoSet', {
                        success: function(oReturn){
                            for(var i=0; i<oReturn.results.length; i++){
                                // 보험료 비율 하드 코딩..
                                if(oReturn.results[i].Insurance === 'I05'){
                                    oReturn.results[i].Retfee = oReturn.results[i].Retfee * (1 + 10 / 100);
                                }else if(oReturn.results[i].Insurance === 'I30'){
                                    oReturn.results[i].Retfee = oReturn.results[i].Retfee * (1 + 7 / 100);
                                }else if(oReturn.results[i].Insurance === 'I70'){
                                    oReturn.results[i].Retfee = oReturn.results[i].Retfee * (1 + 5 / 100);
                                };
                                oReturn.results[i].Retfee = (Math.floor((Math.floor(oReturn.results[i].Retfee)) / 10) * 10).toLocaleString();

                                if(oReturn.results[i].Delflag === 'X'){
                                    oReturn.results[i].Fdate = '취소 차량';
                                    oReturn.results[i].Retendtime.ms = 'X';
                                }
                                if(!oReturn.results[i].Staflag && !oReturn.results[i].Delflag){
                                    oReturn.results[i].Fdate = '대여 중';
                                    oReturn.results[i].Retendtime.ms = 'X';
                                }
                            };
                            this.getView().getModel("login").setProperty('/rentalhis', oReturn.results);
                        }.bind(this)
                    });
                    this.byId("idMyHisTable").getBinding("rows").filter(oFilterHis);
                    this.byId("idHome").setVisible(false);
                    this.byId("idMyInfo").setVisible(false);
                    this.byId("idMyRental").setVisible(false);
                    this.byId("idMyRentalHistory").setVisible(true);
                }else{
                    this.byId("idHome").setVisible(true);
                    this.byId("idMyInfo").setVisible(false);
                    this.byId("idMyRental").setVisible(false);
                    this.byId("idMyRentalHistory").setVisible(false);
                }

            },

            ////////////////////////////////////////////////////////////////////////////////
            onSelectStaBranch: function() {
                let sStabranch = this.byId("idStaBranchComboBox").getSelectedKey();
                let oFilter = new Filter({path:'Oz', operator:'Contains', value1:sStabranch});
                this.byId("idStaZoneComboBox").clearSelection();
                this.byId("idStaZoneComboBox").getBinding("items").filter(oFilter);
                if(sStabranch) {                    
                    this.byId("idStaoz").setVisible(true);
                    
                }else{
                    this.byId("idStaoz").setVisible(false);
                }    
            },

            onSelectStaZone: function() {
                var sBranch = this.byId("idStaBranchComboBox")._getSelectedItemText();
                var sZone = this.byId("idStaZoneComboBox")._getSelectedItemText();
                let sStartzone = this.byId("idStaZoneComboBox").getSelectedKey();
                let oFilter = new Filter({path:'Nowoz', operator:'EQ', value1:sStartzone});

                this.getView().setModel(new JSONModel(), "rentcar");
                this.oModel.read('/RentcarSet', {
                    success: function(oReturn){
                        this.getView().getModel("rentcar").setProperty('/car', oReturn.results);
                    }.bind(this)
                });

                this.byId("idCarTable").getBinding("items").filter(oFilter);
                this.getView().getModel("onzone").setProperty('/now', {Ozname : sZone});
                this.byId("idStaozText").setText(sBranch+'지점의 '+sZone);
                this.byId("idStaZone").setText(sStartzone);
                this.byId("idStaText").setText(sZone);
                // this.byId("idStaCar").setVisible(true);
            },

            onSelectRetBranch: function() {
                let sRetbranch = this.byId("idRetBranchComboBox").getSelectedKey();
                let oFilter = new Filter({path:'Oz', operator:'Contains', value1:sRetbranch});
                this.byId("idRetZoneComboBox").clearSelection();
                this.byId("idRetZoneComboBox").getBinding("items").filter(oFilter);
                if(sRetbranch) {
                    this.byId("idRetoz").setVisible(true);
                }else{
                    this.byId("idRetoz").setVisible(false);
                }

            },

            onSelectRetZone: function() {
                var sBranch = this.byId("idRetBranchComboBox")._getSelectedItemText();
                var sZone = this.byId("idRetZoneComboBox")._getSelectedItemText();
                let sRetzone = this.byId("idRetZoneComboBox").getSelectedKey();
                
                this.byId("idRetozText").setText(sBranch+'지점의 '+sZone);
                this.byId("idRetZone").setText(sRetzone);
                this.byId("idRetText").setText(sZone);
            },

            onCarSelectChange: function(oEvent) {
                let aRent = oEvent.getSource().getSelectedItems();
                let Ctyid = new String;
                for (var i = 0; i < aRent.length; i++) {
                    var sSelectSrc = aRent[i].getCells()[0].getSrc();  // 차량 사진 저장위치, 사진 이름이 바뀌면 수정필요!
                    var sSelectCarid = aRent[i].getCells()[1].getText();
                    var sSelectCtyText = aRent[i].getCells()[2].getText();
                    var sSelectColor = aRent[i].getCells()[3].getText();
                    var sSelectCanum = aRent[i].getCells()[4].getText();
                }
                this.getView().getModel("rentcar").setProperty('/selectcar', {Carid : sSelectCarid});
                Ctyid = sSelectSrc.substr(17, 5);
                this.byId("idCarid").setText(sSelectCarid);
                this.byId("idCtyText").setText(sSelectCtyText);
                this.byId("idColText").setText(sSelectColor);
                this.byId("idCanum").setText(sSelectCanum);

                let sFeePath = this.oModel.createKey("/FeeSet", {
                    Ctyid : Ctyid
                });
                
                this.oModel.read(sFeePath, {
                    success: function(oReturn){
                        this.getView().getModel("charge").setProperty('/fee', oReturn);
                    }.bind(this)
                });
            },
         
            onValueChange: function(oEvent) {
                let currentDate = new Date();
                let sStadate = this.byId("idStadate").getValue();
                let Sdate = new Date(sStadate);
                let sRetdate = this.byId("idRetdate").getValue();
                let Rdate = new Date(sRetdate);
                let sStatime = this.byId("idStatime").getValue();
                let Stime = this.byId("idStatime").getDateValue();
                let sRettime = this.byId("idRettime").getValue();


                if(Sdate.getFullYear() < currentDate.getFullYear()){
                    this.byId("idStadate").setValueState('Error');
                    this.byId("idStadate").setValueStateText('현재보다 이후 날짜를 입력하십시오.');
                    this.byId("idStatime").setValueState('Error');
                }else if(Sdate.getFullYear() === currentDate.getFullYear()){
                    if(Sdate.getMonth() < currentDate.getMonth()){
                        this.byId("idStadate").setValueState('Error');
                        this.byId("idStadate").setValueStateText('현재보다 이후 날짜를 입력하십시오.');
                        this.byId("idStatime").setValueState('Error');
                    }else if(Sdate.getMonth() === currentDate.getMonth()){
                        if(Sdate.getDate() < currentDate.getDate()){
                            this.byId("idStadate").setValueState('Error');
                            this.byId("idStadate").setValueStateText('현재보다 이후 날짜를 입력하십시오.');
                            this.byId("idStatime").setValueState('Error');
                        }else if(Sdate.getDate() === currentDate.getDate()){
                            this.byId("idStadate").setValueState('None');
                            this.byId("idStadateText").setText(sStadate);
                            if(Stime){
                                if(Stime.getHours() < currentDate.getHours()){                                    
                                    this.byId("idStatime").setValueStateText('현재보다 이후 시간을 입력하십시오.');
                                    this.byId("idStatime").setValueState('Error');
                                }else if(Stime.getHours() === currentDate.getHours()){
                                    if(Stime.getMinutes() < currentDate.getMinutes()){                                        
                                        this.byId("idStatime").setValueStateText('현재보다 이후 시간을 입력하십시오.');
                                        this.byId("idStatime").setValueState('Error');
                                    }else if(Stime.getMinutes() === currentDate.getMinutes()){
                                        if(Stime.getSeconds() < Stime.getSeconds()){
                                            this.byId("idStatime").setValueStateText('현재보다 이후 시간을 입력하십시오.');
                                            this.byId("idStatime").setValueState('Error');
                                        }else{
                                            this.byId("idStadate").setValueState(sStadate ? 'None' : 'Error');
                                            this.byId("idStatime").setValueState(sStatime ? 'None' : 'Error');
                                            this.byId("idStatimeText").setText(sStatime);
                                        }
                                    }else{
                                        this.byId("idStadate").setValueState(sStadate ? 'None' : 'Error');
                                        this.byId("idStatime").setValueState(sStatime ? 'None' : 'Error');
                                        this.byId("idStatimeText").setText(sStatime);
                                    }
                                }else{
                                    this.byId("idStadate").setValueState(sStadate ? 'None' : 'Error');
                                    this.byId("idStatime").setValueState(sStatime ? 'None' : 'Error');
                                    this.byId("idStatimeText").setText(sStatime);
                                }
                            }else{
                                this.byId("idStadate").setValueState(sStadate ? 'None' : 'Error');
                                this.byId("idStatime").setValueState(sStatime ? 'None' : 'Error');
                                this.byId("idStatimeText").setText(sStatime);
                            }
                        }else{
                            this.byId("idStadate").setValueState(sStadate ? 'None' : 'Error');
                            this.byId("idStatime").setValueState(sStatime ? 'None' : 'Error');
                            this.byId("idStadateText").setText(sStadate);
                            this.byId("idStatimeText").setText(sStatime);
                        }
                    }else{
                        this.byId("idStadate").setValueState(sStadate ? 'None' : 'Error');
                        this.byId("idStatime").setValueState(sStatime ? 'None' : 'Error');
                        this.byId("idStadateText").setText(sStadate);
                        this.byId("idStatimeText").setText(sStatime);
                    }
                }else{
                    this.byId("idStadate").setValueState(sStadate ? 'None' : 'Error');
                    this.byId("idStatime").setValueState(sStatime ? 'None' : 'Error');
                    this.byId("idStadateText").setText(sStadate);
                    this.byId("idStatimeText").setText(sStatime);
                };
                if(sRetdate){
                    if(Rdate.getFullYear() < Sdate.getFullYear()){
                        this.byId("idRetdate").setValueState('Error');
                        this.byId("idRetdate").setValueStateText('대여 예정일자보다 이후 날짜를 입력하십시오.');
                        this.byId("idRettime").setValueState('Error');
                    }else if(Rdate.getFullYear() === Sdate.getFullYear()){
                        if(Rdate.getMonth() < Sdate.getMonth()){
                            this.byId("idRetdate").setValueState('Error');
                            this.byId("idRetdate").setValueStateText('대여 예정일자보다 이후 날짜를 입력하십시오.');
                            this.byId("idRettime").setValueState('Error');
                        }else if(Rdate.getMonth() === Sdate.getMonth()){
                            if(Rdate.getDate() < Sdate.getDate()){
                                this.byId("idRetdate").setValueState('Error');
                                this.byId("idRetdate").setValueStateText('대여 예정일자보다 이후 날짜를 입력하십시오.');
                                this.byId("idRettime").setValueState('Error');
                            }else if(Rdate.getDate() === Sdate.getDate()){
                                this.byId("idRetdate").setValueState('None');
                                this.byId("idRetdateText").setText(sRetdate);
                                if(sRettime){
                                    if(sRettime < sStatime){                                        
                                        this.byId("idRettime").setValueStateText('대여 예정시각보다 이후 시간을 입력하십시오.');
                                        this.byId("idRettime").setValueState('Error');
                                    }else{
                                        this.byId("idRetdate").setValueState(sStadate ? 'None' : 'Error');
                                        this.byId("idRettime").setValueState(sStatime ? 'None' : 'Error');
                                        this.byId("idRettimeText").setText(sRettime);
                                    }
                                }
                            }else{
                                this.byId("idRetdate").setValueState(sStadate ? 'None' : 'Error');
                                this.byId("idRettime").setValueState(sStatime ? 'None' : 'Error');
                                this.byId("idRetdateText").setText(sRetdate);
                                this.byId("idRettimeText").setText(sRettime);
                            }
                        }else{
                            this.byId("idStadate").setValueState(sStadate ? 'None' : 'Error');
                            this.byId("idStatime").setValueState(sStatime ? 'None' : 'Error');
                            this.byId("idRetdateText").setText(sRetdate);
                            this.byId("idRettimeText").setText(sRettime);
                        }
                    }else{
                        this.byId("idStadate").setValueState(sStadate ? 'None' : 'Error');
                        this.byId("idStatime").setValueState(sStatime ? 'None' : 'Error');
                        this.byId("idRetdateText").setText(sRetdate);
                        this.byId("idRettimeText").setText(sRettime);
                    }
                };
                let sInsurText = this.byId("idInsuranceComboBox")._getSelectedItemText();
                let sInsuranceKey = this.byId("idInsuranceComboBox").getSelectedKey();
                this.byId("idInsurText").setText(sInsurText);
            },
    
            onDialogAfterOpen: function () {
                this._oWizard = this.byId("CreateRental");
                this._iSelectedStepIndex = 0;
                this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
    
                this.handleButtonsVisibility();
            },
    
            handleButtonsVisibility: function () {
                var oModel = this.getView().getModel();
                switch (this._iSelectedStepIndex){
                    case 0:
                        this.byId("idBackButton").setVisible(true);
                        this.byId("idNextButton").setVisible(true);
                        this.byId("idSetButton").setVisible(false);
                        this.byId("idCancelButton").setVisible(true);
                        break;
                    case 1:
                        this.byId("idBackButton").setVisible(true);
                        this.byId("idNextButton").setVisible(true);
                        this.byId("idSetButton").setVisible(false);
                        this.byId("idCancelButton").setVisible(true);
                        break;
                    case 2:
                        this.byId("idBackButton").setVisible(true);
                        this.byId("idNextButton").setVisible(true);
                        this.byId("idSetButton").setVisible(false);
                        this.byId("idCancelButton").setVisible(true);
                        break;
                    case 3:
                        this.byId("idBackButton").setVisible(false);
                        this.byId("idNextButton").setVisible(false);
                        this.byId("idSetButton").setVisible(true);
                        this.byId("idCancelButton").setVisible(true);
                        break;
                    default: break;
                }
    
            },
            onSelectInsurance: function() {
                let Insurance = this.byId("idInsuranceComboBox").getSelectedKey();
                let sInsur = this.byId("idInsuranceComboBox")._getSelectedItemText();
                let sInsPath = this.oModel.createKey("/InsuranceSet", {
                    Insuranceid : Insurance
                });
                this.oModel.read(sInsPath, {
                    success: function(oReturn){
                        this.getView().getModel("charge").setProperty('/insurance', oReturn);
                    }.bind(this)
                });

                this.byId("idInsurText").setText(sInsur);
            },

            onRetfeeCalc: function() {
                let iStadate = this.byId("idStadate").getDateValue();
                let iRetdate = this.byId("idRetdate").getDateValue();
                let iStatime = this.byId("idStatime").getDateValue();
                let iRettime = this.byId("idRettime").getDateValue();
                let StaDate = new Date(iStadate.getFullYear(), iStadate.getMonth(), iStadate.getDate(), iStatime.getHours(), iStatime.getMinutes(), iStatime.getSeconds());
                let RetDate = new Date(iRetdate.getFullYear(), iRetdate.getMonth(), iRetdate.getDate(), iRettime.getHours(), iRettime.getMinutes(), iRettime.getSeconds());
                var Night1 = new Date(iStadate.getFullYear(), iStadate.getMonth(), iStadate.getDate(), 0, 0, 0);
                var Night2 = new Date(iStadate.getFullYear(), iStadate.getMonth(), iStadate.getDate(), 4, 0, 0);
                var iRetfee = new Number;
                var iRettotfee = new Number;
                let timeDiff = (RetDate - StaDate) / (1000 * 60 * 60);
                let timeDiffMinute = timeDiff * 60;
                
                var oFee = this.getView().getModel("charge").getProperty('/fee');
                var oDiscount = this.getView().getModel("charge").getProperty('/grade');
                var oInsurance = this.getView().getModel("charge").getProperty('/insurance');

                // timeDiffMinute = Number(timeDiffMinute);
                oFee.Retfee = Number(oFee.Retfee);
                oFee.Extrafee = Number(oFee.Extrafee);
                oDiscount.Discount = Number(oDiscount.Discount);
                oInsurance.Insrate = Number(oInsurance.Insrate);

                if(timeDiffMinute <= 30){
                    iRetfee = oFee.Retfee;
                }else{
                    iRetfee = oFee.Retfee + (timeDiffMinute - 30) / 10 * oFee.Extrafee;
                };

                if(StaDate.getDay() === 0 || StaDate.getDay() === 6){
                    if(StaDate >= Night1 && StaDate <= Night2){
                        iRetfee = iRetfee;
                    }else{
                        iRetfee = iRetfee * 1.4;
                    };
                }else{
                    if(StaDate >= Night1 && StaDate <= Night2){
                        iRetfee = iRetfee * 0.7;
                    }else{
                        iRetfee = iRetfee;
                    };
                };

                iRetfee = iRetfee - oDiscount.Discount;
                
                iRettotfee = iRetfee * (1 + oInsurance.Insrate / 100);
                iRettotfee = Math.floor(iRettotfee);
                iRettotfee = Math.floor(iRettotfee / 10) * 10;

                iRettotfee = iRettotfee.toLocaleString();
                this.byId("idCurrency").setVisible(true);
                this.byId("idBktime").setText(timeDiff);
                this.byId("idRetfee").setText(iRetfee);
                this.byId("idRettotfee").setText(iRettotfee);
                this.byId("idRettotfeeText").setText(iRettotfee);

            },

            onCreate: function() {
                let sCustid = this.getView().getModel("login").getProperty('/login/Custid');
                let sCarid = this.byId("idCarid").getText();
                let Rndate = this.byId("idStadate").getDateValue();
                let Rtdate = this.byId("idRetdate").getDateValue();
                let UtcMinute = Rndate.getTimezoneOffset();
                let sRndate = new Date(Rndate.setMinutes(Rndate.getMinutes() - UtcMinute));
                let sRtdate = new Date(Rtdate.setMinutes(Rtdate.getMinutes() - UtcMinute));
                let oStatime = this.byId("idStatime").getDateValue();
                let oEndtime = this.byId("idRettime").getDateValue();
                let sStatime = 'PT'+oStatime.getHours()+'H'+oStatime.getMinutes()+'M'+oStatime.getSeconds()+'S';
                let sEndtime = 'PT'+oEndtime.getHours()+'H'+oEndtime.getMinutes()+'M'+oEndtime.getSeconds()+'S';
                let sStaoz =  this.byId("idStaZone").getText();
                let sRetoz = this.byId("idRetZone").getText();
                let sGrade = this.getView().getModel("charge").getProperty('/grade/Gradeid');
                let sInsurance = this.getView().getModel("charge").getProperty('/insurance/Insuranceid');
                let sRetfee = this.byId("idRetfee").getText();
                let sCurkey = this.byId("idCurkey").getText();
                
                let oRental = {
                    Custid : sCustid,
                    Carid : sCarid,
                    Rndate : sRndate,
                    Rtdate : sRtdate,
                    Staoz : sStaoz,
                    Retoz : sRetoz,
                    Statime : sStatime,
                    Endtime : sEndtime,
                    Retstatime : sStatime, // 스케쥴링 테이블 부재로 인한 대여시작시각 강제 할당
                    Grade : sGrade,
                    Insurance : sInsurance,
                    Retfee : sRetfee,
                    Curkey : sCurkey
                };

                MessageBox["confirm"]("신청하시겠습니까?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                            this.oModel.create("/RentalSet", oRental, {
                                success: function() {
                                    sap.m.MessageToast.show("고객님의 차량 대여 신청이 정상적으로 처리되었습니다.");
                                },
                                error: function() {
                                    sap.m.MessageToast.show("서버 문제 발생으로 인하여 대여 신청이 실패하였습니다.");
                                }
                            });
                            this.byId("idRentalDialog").close();
                            this.getView().getModel().setData(Object.assign({}, oData));
                        }
                    }.bind(this)
                });
                
            },
            
            onRentalCancel: function() {
                let oLogin = this.getView().getModel("login").getProperty('/login');
                let sCancelPath = this.oModel.createKey("/CurRentalSet", {
                    Custid : oLogin.Custid
                });

                this.oModel.read(sCancelPath, {
                    success: function(oReturn){
                        this.getView().getModel("login").setProperty('/currental', oReturn);
                    }.bind(this)
                });
                
                if (!this.oDialog) {
                    this.oDialog = new Dialog({
                      type: sap.m.DialogType.Message,
                      title: "대여 예약 취소",
                      content: new Text({ text: "사유를 선택해 주십시오." }),
                      buttons: [
                        new Button({
                          type: sap.m.ButtonType.Neutral,
                          text: "단순 변심",
                          press: function () {
                            MessageBox["warning"]("차량 대여를 취소하시겠습니까? 사유 : 단순 변심", {
                                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.YES) {
                                        var oCurrental = this.getView().getModel("login").getProperty('/currental');
                                        oCurrental.Delflag = 'X';
                                        oCurrental.Note = '취소 사유:단순 변심';
                                        this.oModel.update(sCancelPath, oCurrental, {
                                            success: function() {
                                                MessageBox['warning']("취소 처리 되었습니다. 다음에도 EReON을 찾아주시면 감사하겠습니다.", {
                                                    actions: [MessageBox.Action.YES],
                                                    onClose: function (oAction) {
                                                        if (oAction === MessageBox.Action.YES) {
                                                            this.byId("idHome").setVisible(false);
                                                            this.byId("idMyInfo").setVisible(false);
                                                            this.byId("idMyRental").setVisible(false);
                                                            this.byId("idMyRentalHistory").setVisible(true);   
                                                            this.oDialog.close();
                                                        }
                                                    }.bind(this)
                                                });
                                            }.bind(this)
                                        });
                                    }
                                }.bind(this)
                            });
                          }.bind(this)
                        }),
                        new Button({
                          text: "차량 문제",
                          type: sap.m.ButtonType.Critical,
                          press: function () {
                            MessageBox["warning"]("차량 대여를 취소하시겠습니까? 사유 : 차량 문제", {
                                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.YES) {
                                        var oCurrental = this.getView().getModel("login").getProperty('/currental');
                                        oCurrental.Delflag = 'X';
                                        oCurrental.Note = '취소 사유:차량 문제';
                                        this.oModel.update(sCancelPath, oCurrental, {
                                            success: function() {
                                                MessageBox['warning']("불편을 드려 진심으로 죄송합니다. 다음에도 EReON을 찾아주시면 감사하겠습니다.", {
                                                    actions: [MessageBox.Action.YES],
                                                    onClose: function (oAction) {
                                                        if (oAction === MessageBox.Action.YES) {
                                                            this.byId("idHome").setVisible(false);
                                                            this.byId("idMyInfo").setVisible(false);
                                                            this.byId("idMyRental").setVisible(false);
                                                            this.byId("idMyRentalHistory").setVisible(true);                                                        
                                                            this.oDialog.close();   
                                                        }
                                                    }.bind(this)
                                                });
                                            }.bind(this)
                                        });
                                    }
                                }.bind(this)
                            });
                          }.bind(this)
                        }),
                        new Button({
                          text: "취소",
                          press: function () {
                            this.oDialog.close();
                          }.bind(this)
                        })
                      ]
                    });
                  }
                this.oDialog.open();
            },

            onCarReturn: function() {
                var oDialog = this.byId("idReturnDialog");
                
                if(oDialog) {
                    oDialog.open();
                }else{
                    this.loadFragment({
                        name : "ER/zfermembership/view/fragment/Return"
                    }).then(function(oDialog){
                        oDialog.open();
                    }, this);
                };
            },

            onReturnPress: function() {
                var that = this;
                let oLogin = this.getView().getModel("login").getProperty('/login');
                let sCancelPath = this.oModel.createKey("/CurRentalSet", {
                    Custid : oLogin.Custid
                });

                this.oModel.read(sCancelPath, {
                    success: function(oReturn){
                        this.getView().getModel("login").setProperty('/currental', oReturn);
                        this.oModel.read(this.oModel.createKey("/CarSet",{Carid : oReturn.Carid}), {
                            success: function(oReturn){
                                that.getView().getModel("login").setProperty('/car', oReturn);
                                console.log(oReturn);                            
                            }.bind(this)
                        })
                    }.bind(this)
                });
            },

            onReturnClose: function(oEvent) {
                var oDialog = oEvent.getSource().getParent();
                sap.m.MessageToast.show("취소되었습니다.");
                oDialog.close();
            },

            onChangeImage: function () {
                var sValue = this.byId("idCarUploader").getValue();
                var sImage = "/model/image/"+sValue;
                this.byId("idCarImage").setSrc(sImage);          
            },
    
            handleNavigationChange: function (oEvent) {
                this._oSelectedStep = oEvent.getParameter("step");
                this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
                this.handleButtonsVisibility();
            },
    
            editStepOne: function () {
                this._handleNavigationToStep(0);
            },
    
            editStepTwo: function () {
                this._handleNavigationToStep(1);
            },
    
            editStepThree: function () {
                this._handleNavigationToStep(2);
            },
    
            // editStepFour: function () {
            //     this._handleNavigationToStep(3);
            // },
    
            _handleNavigationToStep: function (iStepNumber) {
                this._pDialog.then(function(oDialog){
                    oDialog.open();
                    this._setButtonSetting();
                    this._oWizard.goToStep(this._oWizard.getSteps()[iStepNumber], true);
                }.bind(this));
            },
    
            onDialogNextButton: function () {
                this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
                var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];
    
                if (this._oSelectedStep && !this._oSelectedStep.bLast) {
                    this._oWizard.goToStep(oNextStep, true);
                } else {
                    this._oWizard.nextStep();
                }
    
                this._iSelectedStepIndex++;
                this._oSelectedStep = oNextStep;
                
                this._setButtonSetting();
                this.handleButtonsVisibility();
            },
    
            onDialogBackButton: function () {
                this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
                var oPreviousStep = this._oWizard.getSteps()[this._iSelectedStepIndex - 1];
    
                if (this._oSelectedStep) {
                    this._oWizard.goToStep(oPreviousStep, true);
                } else {
                    this._oWizard.previousStep();
                }
    
                this._iSelectedStepIndex--;
                this._oSelectedStep = oPreviousStep;
                
                this._setButtonSetting();
                this.handleButtonsVisibility();
            },

            _setButtonSetting: function(){
                let sStaText = this.byId("idStaText").getText();
                let sRetText = this.byId("idRetText").getText();
                let sCtyText = this.byId("idCtyText").getText();
                let sColText = this.byId("idColText").getText();
                let sCanum = this.byId("idCanum").getText();
                let sStadateText = this.byId("idStadateText").getText();
                let sStatimeText = this.byId("idStatimeText").getText();
                let sRetdateText = this.byId("idRetdateText").getText();
                let sRettimeText = this.byId("idRettimeText").getText();
                let sInsuranceText = this.byId("idInsurText").getText();
                let sRettotfeeText = this.byId("idRettotfeeText").getText();
                if(sStaText && sRetText && sCtyText && sColText && sCanum && sStadateText && sStatimeText
                     && sRetdateText && sRettimeText && sInsuranceText && sRettotfeeText){
                        this.byId("idSetButton").setEnabled(true);
                    }else{
                        this.byId("idSetButton").setEnabled(false);
                    }
            },
    
            onCancel: function () {
                MessageBox["warning"]("차량 대여를 취소하시겠습니까?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                            
                            if(this.byId("idStaZoneComboBox").getValue()){
                                this.getView().getModel("rentcar").setProperty('/car', []);
                                };
                            this.byId("idStaBranchComboBox").setValue('');
                            this.byId("idStaZoneComboBox").setValue('');
                            this.byId("idStaoz").setVisible(false);
                            this.byId("idRetBranchComboBox").setValue('');
                            this.byId("idRetZoneComboBox").setValue('');
                            this.byId("idRetoz").setVisible(false);
                            this.byId("idStadate").setValue('');
                            this.byId("idStatime").setValue('');
                            this.byId("idRetdate").setValue('');
                            this.byId("idRettime").setValue('');
                            this.byId("idInsuranceComboBox").setValue('');
                            this.byId("idRettotfee").setText('');
                            this.byId("idStaText").setText('');
                            this.byId("idRetText").setText('');
                            this.byId("idCtyText").setText('');
                            this.byId("idColText").setText('');
                            this.byId("idCanum").setText('');
                            this.byId("idStadateText").setText('');
                            this.byId("idStatimeText").setText('');
                            this.byId("idRetdateText").setText('');
                            this.byId("idRettimeText").setText('');
                            this.byId("idInsurText").setText('');
                            this.byId("idRettotfeeText").setText('');
                            this.byId("idCurrency").setVisible(false);
                            this.byId("idStaozText").setText('');
                            this.byId("idRetozText").setText('');
                            
                            this.byId("idRentalDialog").close();

                            this.getView().getModel().setData(Object.assign({}, oData));
                        }
                    }.bind(this)
                });
            },
    
            productWeighStateFormatter: function (oVal) {
                return isNaN(oVal) ? ValueState.Error : ValueState.None;
            },
    
            // discardProgress: function () {
            //     var oModel = this.getView().getModel();
            //     this._oWizard.discardProgress(this.byId("ZoneSelectStep"));
    
            //     var clearContent = function (aContent) {
            //         for (var i = 0; i < aContent.length; i++) {
            //             if (aContent[i].setValue) {
            //                 aContent[i].setValue("");
            //             }
    
            //             if (aContent[i].getContent) {
            //                 clearContent(aContent[i].getContent());
            //             }
            //         }
            //     };
    
            //     oModel.setProperty("/productWeightState", ValueState.Error);
            //     oModel.setProperty("/productNameState", ValueState.Error);
            //     clearContent(this._oWizard.getSteps());
            // }
        });
    });
