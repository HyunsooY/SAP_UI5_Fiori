sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
    "sap/ui/core/library",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, MessageBox, CoreLibrary, Filter) {
        "use strict";

        var ValueState = CoreLibrary.ValueState,
		oData = {
			reviewButton: false,
			backButtonVisible: false,
        };

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
                var oModel = new JSONModel(),
				oInitialModelState = Object.assign({}, oData);
			    oModel.setData(oInitialModelState);

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteLogin").attachPatternMatched(this._onPatternMatched, this);
                this.getView().setModel(new JSONModel(), "login");
                this._defaultSet();

                this.getView().setModel(new JSONModel(), "onzone");
                this.oModel.read('/OnzoneinfoSet', {
                    success: function(oReturn){
                        this.getView().getModel("onzone").setProperty('/list1', oReturn.results);
                        this.getView().getModel("onzone").setProperty('/list2', oReturn.results);
                    }.bind(this)
                });

                this.getView().setModel(new JSONModel(), "charge");
                this.oModel.read('/FeeSet', {
                    success: function(oReturn){
                        this.getView().getModel("charge").setProperty('/fee', oReturn.results);
                    }.bind(this)
                });
                this.oModel.read('/InsuranceSet', {
                    success: function(oReturn){
                        this.getView().getModel("charge").setProperty('/insurance', oReturn.results);
                    }.bind(this)
                });
                this.oModel.read('/GradeSet', {
                    success: function(oReturn){
                        this.getView().getModel("charge").setProperty('/grade', oReturn.results);
                    }.bind(this)
                });
                this.oModel.read('/CustrentalSet', {
                    success: function(oReturn){
                        this.getView().getModel("charge").setProperty('/rentalcount', oReturn.results);
                    }.bind(this)
                })
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
                if(sText === 'Home'){
                    this.byId("idHome").setVisible(true);
                    this.byId("idMyInfo").setVisible(false);
                }else if(sText === '내 정보'){
                    this.byId("idHome").setVisible(false);
                    this.byId("idMyInfo").setVisible(true);
                }else if(sText === '대여 신청'){
                    var oView = this.getView();                
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
                    }
                    this._pDialog.then(function(oDialog){
                        oDialog.open();
                    });
                }else if(sText === '대여 확인'){

                }else if(sText === '대여 이력'){

                }else{
                    this.byId("idHome").setVisible(true);
                    this.byId("idMyInfo").setVisible(false);
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

            onCarSelectChange: function(oEvent) {
                let aRent = oEvent.getSource().getSelectedItems();

                for (var i = 0; i < aRent.length; i++) {
                    var aSelectedData = aRent[i].getCells();
                    var sSelectCarid = oEvent.getSource().getSelectedItems()[i].getCells()[1].getText();
                    var sSelectCtyid = oEvent.getSource().getSelectedItems()[i].getCells()[2].getText();
                    var sSelectColor = oEvent.getSource().getSelectedItems()[i].getCells()[3].getText();
                    var sSelectCanum = oEvent.getSource().getSelectedItems()[i].getCells()[4].getText();
                }
                this.getView().getModel("rentcar").setProperty('/selectcar', {Carid : sSelectCarid});
                this.byId("idCarid").setText(sSelectCarid);
                this.byId("idCtyText").setText(sSelectCtyid);
                this.byId("idColText").setText(sSelectColor);
                this.byId("idCanum").setText(sSelectCanum);
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

            onRetfeeCalc: function() {
                
            },
    
            handleNavigationChange: function (oEvent) {
                this._oSelectedStep = oEvent.getParameter("step");
                this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
                this.handleButtonsVisibility();
            },
            
            // Validation 이후 추가 예정

            // additionalInfoValidation: function () {
            //     var oModel = this.getView().getModel(),
            //         sName = this.byId("ProductName").getValue(),
            //         iWeight = parseInt(this.byId("ProductWeight").getValue());
    
            //     this.handleButtonsVisibility();
    
            //     if (isNaN(iWeight)) {
            //         this._oWizard.setCurrentStep(this.byId("CarSelectStep"));
            //         oModel.setProperty("/productWeightState", ValueState.Error);
            //     } else {
            //         oModel.setProperty("/productWeightState", ValueState.None);
            //     }
    
            //     if (sName.length < 6) {
            //         this._oWizard.setCurrentStep(this.byId("CarSelectStep"));
            //         oModel.setProperty("/productNameState", ValueState.Error);
            //     } else {
            //         oModel.setProperty("/productNameState", ValueState.None);
            //     }
    
            //     if (sName.length < 6 || isNaN(iWeight)) {
            //         this._oWizard.invalidateStep(this.byId("CarSelectStep"));
            //         oModel.setProperty("/nextButtonEnabled", false);
            //         oModel.setProperty("/finishButtonVisible", false);
            //     } else {
            //         this._oWizard.validateStep(this.byId("CarSelectStep"));
            //         oModel.setProperty("/nextButtonEnabled", true);
            //     }
            // },
    
            // optionalStepActivation: function () {
            //     MessageToast.show(
            //         'This event is fired on activate of Step3.'
            //     );
            // },
            // optionalStepCompletion: function () {
            //     MessageToast.show(
            //         'This event is fired on complete of Step3. You can use it to gather the information, and lock the input data.'
            //     );
            // },
    
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
    
                this.handleButtonsVisibility();
            },
    
            handleWizardCancel: function () {
                // this._handleMessageBoxOpen("회원가입을 취소하시겠습니까?", "warning");
                MessageBox["warning"]("차량 대여를 취소하시겠습니까?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
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
