sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/core/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Controller, JSONModel, MessageToast, MessageBox, Fragment, CoreLibrary) {
        "use strict";
        var ValueState = CoreLibrary.ValueState,
		oData = {
			reviewButton: false,
			backButtonVisible: false,
		};
        return Controller.extend("ER.zfercustomer.controller.Main", {
            onInit: function () {
                var oModel = new JSONModel(),
				oInitialModelState = Object.assign({}, oData);

			    oModel.setData(oInitialModelState);
			    this.getView().setModel(oModel);
                this.getView().setModel(new JSONModel(), "join");
                this.getView().setModel(new JSONModel(), "login");
                this._defaultSet();
                this.byId("LoginButton").addStyleClass("LoginButton");
                this.byId("JoinButton").addStyleClass("JoinButton");
                this.onAfterRendering();
                
            },
            _defaultSet: function() {
                // odata model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel();
                // json model 변수 세팅
                this.oMainModel = this.getView().getModel("join");
                // table 객체
                this.oTable = this.byId("idTable");
            },
            _onPatternMatched: function(oEvent) {
                // oEvent.getParameters().arguments
                var oArgu = oEvent.getParameter("arguments");
            },

            onAfterRendering: function() {
                var _rootPath = jQuery.sap.getModulePath("ER.zfercustomer").split('/~')[0];
                var style = document.createElement("style");
                style.innerHTML = `
                  .mainPage {
                    background-image: url("${_rootPath}/model/image/background/EReON.png");
                    background-size: 40%;
                    background-position: top;
                    background-repeat: no-repeat;
                  }
                `;
                document.head.appendChild(style);
              },

            onLogin: function() {
                let sId = this.byId("idLoginID").getValue();
                let sName = this.byId("idLoginName").getValue();
                let sPath = this.oModel.createKey("/LoginSet", {
                    Custid : sId,
                    Name : sName
                });
                this.oModel.read(sPath, {
                    success: function(oReturn) {
                        var oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("RouteLogin", {
                            Custid : sId,
                            Name : sName
                        }, true);
                        this.byId("idLoginID").setValue('');
                        this.byId("idLoginName").setValue('');
                    }.bind(this),
                    error: function() {
                        sap.m.MessageToast.show("존재하지 않는 회원입니다!");
                    }
                });
            },            
            onCreate: function() {
                let oCustomer = this.oMainModel.getData();
                let sAdultCheck = this.byId("idAdultCheckReview").getText();
                let sID = this.byId("idIDReview").getText();
                let sName = this.byId("idNameReview").getText();
                let sGender = this.byId("idGenderReview").getText();
                let sBirth = this.byId("idBirthReview").getText();
                let sTelno = this.byId("idTelnoReview").getText();
                let sAddress = this.byId("idAddressReview").getText();
                let sLicnum = this.byId("idLicnumReview").getText();
                let sLicenseCheck = this.byId("idLicenseCheck").getText();
                let sNewDate = new Date();

                if(sAdultCheck === '' || sID === '' || sName === '' || sGender === '' || sBirth === '' ||
                    sTelno === '' || sAddress === '' || sLicnum === '' || sLicenseCheck === '') {
                        sap.m.MessageToast.show("입력되지 않은 정보가 존재합니다.")
                    }else{
                        MessageBox["confirm"]("회원가입하시겠습니까?", {
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.YES) {
                                    this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                                    oCustomer.Birth = new Date(oCustomer.Birth);
                                    oCustomer.Joindate = new Date(sNewDate.setMinutes(sNewDate.getMinutes() - sNewDate.getTimezoneOffset()));
                                    debugger;
                                    this.oModel.create("/CustomerSet", oCustomer, {
                                        success: function() {
                                            sap.m.MessageToast.show("EReON의 회원이 되신 걸 환영합니다!");
                                        },
                                        error: function() {
                                            sap.m.MessageToast.show("회원가입이 정상적으로 이루어지지 않았습니다.");
                                        }
                                    });
                                    this.byId("idDialog").close();
                                    this.getView().getModel().setData(Object.assign({}, oData));
                                }
                            }.bind(this)
                        });
                    };
            },
            onValueChange: function(oEvent) {
                let oControlName = this.byId("idInputName");
                let oControlBirth = this.byId("idBirthDate");
                let oControlTel = this.byId("idInputTel");
                let oControlAdd = this.byId("idInputAdd");
                let oControlLic = this.byId("idInputLic");
                let iName = oControlName.getValue();
                let iBirth = oControlBirth.getValue();
                let iTel = oControlTel.getValue();
                let iAdd = oControlAdd.getValue();
                let iLic = oControlLic.getValue();
                let iGender = this.byId("idGenderSeg").getSelectedKey();
                let iImage = this.byId("idUploader").getValue();

                let currentDate = new Date();
                let birthDate = new Date(iBirth);
                let yearDiff = currentDate.getFullYear() - birthDate.getFullYear();
                let monthDiff = birthDate.getMonth() - currentDate.getMonth();
                let dayDiff = birthDate.getDate() - currentDate.getDate();

                oControlName.setValueState(iName ? 'None' : 'Error');
                oControlName.setValueStateText(iName ? '' : '이름을 입력해주세요.');
               
                if(yearDiff < 18){
                    oControlBirth.setValueState('Error');
                    oControlBirth.setValueStateText('입력할 수 없는 생일입니다.');
                    this.byId("idNextButton").setEnabled(false);
                    // this.getView().getModel().setProperty("/nextButtonEnabled", false);
                }else if(yearDiff === 18){
                    if(monthDiff > 0){
                        oControlBirth.setValueState('Error');
                        oControlBirth.setValueStateText('입력할 수 없는 생일입니다.');
                        this.byId("idNextButton").setEnabled(false);
                        // this.getView().getModel().setProperty("/nextButtonEnabled", false);
                    }else if(monthDiff === 0){
                        if(dayDiff > 0){
                            oControlBirth.setValueState('Error');
                            oControlBirth.setValueStateText('입력할 수 없는 생일입니다.');
                            this.byId("idNextButton").setEnabled(false);
                            // this.getView().getModel().setProperty("/nextButtonEnabled", false);
                        }else{
                            oControlBirth.setValueState(iBirth ? 'None' : 'Error');
                            oControlBirth.setValueStateText(iBirth ? '' : '생년월일을 입력해주세요.');
                            this.byId("idNextButton").setEnabled(true);
                            // this.getView().getModel().setProperty("/nextButtonEnabled", true);    
                        }
                    }else{
                        oControlBirth.setValueState(iBirth ? 'None' : 'Error');
                        oControlBirth.setValueStateText(iBirth ? '' : '생년월일을 입력해주세요.');
                        this.byId("idNextButton").setEnabled(true);
                        // this.getView().getModel().setProperty("/nextButtonEnabled", true);
                    }
                }else{
                    oControlBirth.setValueState(iBirth ? 'None' : 'Error');
                    oControlBirth.setValueStateText(iBirth ? '' : '생년월일을 입력해주세요.');
                    this.byId("idNextButton").setEnabled(true);
                    // this.getView().getModel().setProperty("/nextButtonEnabled", true);
                };
                this.byId("idBdate").setValue(iBirth);
                oControlTel.setValueState(iTel ? 'None' : 'Error');
                oControlTel.setValueStateText(iTel ? '' : '전화번호를 입력해주세요.');
                oControlAdd.setValueState(iAdd ? 'None' : 'Error');
                oControlAdd.setValueStateText(iAdd ? '' : '주소를 입력해주세요.');
                oControlLic.setValueState(iLic ? 'None' : 'Error');
                oControlLic.setValueStateText(iLic ? '' : '면허번호를 입력해주세요.');

                // this.byId("idBDate").setValue(this.byId("idBirthDate").getValue());
                this.byId("idJoinButton").setEnabled(iName && iBirth && iTel && iAdd && iLic && iGender && iImage ? true : false);
                
            },
            // onJoin: function() {

            //     var oRouter = this.getOwnerComponent().getRouter();
            //     oRouter.navTo("RouteJoin", {});
            // },
            
            onJoinEreon: function () {
                var oView = this.getView();                
    
                // create Dialog
                if (!this._pDialog) {
                    this._pDialog = Fragment.load({
                        id: oView.getId(),
                        name: "ER.zfercustomer/view/fragment/Join",
                        controller: this
                    }).then(function(oDialog) {
                        oDialog.attachAfterOpen(this.onDialogAfterOpen, this);
                        oView.addDependent(oDialog);
                        // oDialog.bindElement("/ProductCollection/0");
                        return oDialog;
                    }.bind(this));
                }
                this._pDialog.then(function(oDialog){
                    oDialog.open();
                });

                let today = new Date;         
                this.oModel.read("/CustidSet",{
                    success : function(oReturn){
                        console.log("READ: ", oReturn.results[0]);
                        this.byId("idInputID").setValue(oReturn.results[0].CustidMax);
                    }.bind(this)
                });
            },

            onChangeImage: function () {
                var sValue = this.byId("idUploader").getValue();
                var sImage = "/model/image/"+sValue;
                // this.byId("idImage").setSrc(sImage);
                if(_rootPath){
                    this.byId("idImage").setSrc(_rootPath+sImage);
                }
                if(sValue) {
                    this.byId("idLicenseCheck").setText("예");
                }else {
                    this.byId("idLicenseCheck").setText("아니오");
                };
                
            },
    
            onDialogAfterOpen: function () {
                this._oWizard = this.byId("CreateJoinWizard");
                this._iSelectedStepIndex = 0;
                this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
    
                this.handleButtonsVisibility();
            },
    
            handleButtonsVisibility: function () {
                var oModel = this.getView().getModel();
                switch (this._iSelectedStepIndex){
                    case 0:
                        oModel.setProperty("/nextButtonVisible", true);
                        // oModel.setProperty("/nextButtonEnabled", true);
                        oModel.setProperty("/backButtonVisible", false);
                        oModel.setProperty("/reviewButtonVisible", false);
                        oModel.setProperty("/finishButtonVisible", false);
                        break;
                    case 1:
                        oModel.setProperty("/backButtonVisible", true);
                        oModel.setProperty("/nextButtonVisible", true);
                        oModel.setProperty("/reviewButtonVisible", false);
                        oModel.setProperty("/finishButtonVisible", false);
                        break;
                    case 2:
                        oModel.setProperty("/nextButtonVisible", false);
                        oModel.setProperty("/backButtonVisible", true);
                        oModel.setProperty("/reviewButtonVisible", true);
                        oModel.setProperty("/finishButtonVisible", false);
                        break;
                    case 3:
                        oModel.setProperty("/nextButtonVisible", false);
                        oModel.setProperty("/finishButtonVisible", true);
                        oModel.setProperty("/backButtonVisible", false);
                        oModel.setProperty("/reviewButtonVisible", false);
                        break;
                    default: break;
                }
    
            },
    
            handleNavigationChange: function (oEvent) {
                this._oSelectedStep = oEvent.getParameter("step");
                this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
                this.handleButtonsVisibility();
            },
    
            setAdultCheckFromSegmented: function(oEvent) {
                var oModel = this.getView().getModel();
                var sAdultCheck = oEvent.getParameters().item.getKey();

                if(sAdultCheck === "no") {
                    this.byId("idAdultCheck").setVisible(true);
                    this.byId("idCheckBirth").setVisible(false);
                    // oModel.setProperty("/nextButtonEnabled", false);
                }else{
                    this.byId("idAdultCheck").setVisible(false);
                    this.byId("idCheckBirth").setVisible(true);
                    // oModel.setProperty("/nextButtonEnabled", true);
                    this.byId("idAdultCheckReview").setText("확인");
                };

                // this.getView().getModel().setProperty("/productType", sProductType);
                // this._oWizard.validateStep(this.byId("AdultStep"));
            },

            setGenderFromSegmented: function (oEvent) {
                var sGender = oEvent.getParameters().item.getKey();
                this.getView().getModel("join").setProperty("/Gender", sGender);
                this._oWizard.validateStep(this.byId("AdultStep"));
            },
            
            // Validation 이후 추가 예정

            // additionalInfoValidation: function () {
            //     var oModel = this.getView().getModel(),
            //         sName = this.byId("ProductName").getValue(),
            //         iWeight = parseInt(this.byId("ProductWeight").getValue());
    
            //     this.handleButtonsVisibility();
    
            //     if (isNaN(iWeight)) {
            //         this._oWizard.setCurrentStep(this.byId("CustInfoStep"));
            //         oModel.setProperty("/productWeightState", ValueState.Error);
            //     } else {
            //         oModel.setProperty("/productWeightState", ValueState.None);
            //     }
    
            //     if (sName.length < 6) {
            //         this._oWizard.setCurrentStep(this.byId("CustInfoStep"));
            //         oModel.setProperty("/productNameState", ValueState.Error);
            //     } else {
            //         oModel.setProperty("/productNameState", ValueState.None);
            //     }
    
            //     if (sName.length < 6 || isNaN(iWeight)) {
            //         this._oWizard.invalidateStep(this.byId("CustInfoStep"));
            //         oModel.setProperty("/nextButtonEnabled", false);
            //         oModel.setProperty("/finishButtonVisible", false);
            //     } else {
            //         this._oWizard.validateStep(this.byId("CustInfoStep"));
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
    
            onJoinCancel: function () {
                MessageBox['warning']('회원가입을 취소하시겠습니까?', {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                            this.byId("idBirthDate").setValue('');
                            this.byId("idInputID").setValue('');
                            this.byId("idInputName").setValue('');
                            this.byId("idGenderSeg").setSelectedKey('');
                            this.byId("idBdate").setValue('');
                            this.byId("idInputTel").setValue('');
                            this.byId("idInputAdd").setValue('');
                            this.byId("idJoinDate").setValue('');
                            this.byId("idUploader").setValue('');
                            this.byId("idImage").setSrc('');
                            this.byId("idInputLic").setValue('');
                            this.byId("idAdultCheckReview").setText('');
                            this.byId("idIDReview").setText('');
                            this.byId("idNameReview").setText('');
                            this.byId("idGenderReview").setText('');
                            this.byId("idBirthReview").setText('');
                            this.byId("idTelnoReview").setText('');
                            this.byId("idAddressReview").setText('');
                            this.byId("idLicnumReview").setText('');
                            this.byId("idLicenseCheck").setText('');
                            this.byId("idDialog").close();
                            this.getView().getModel().setData(Object.assign({}, oData));
                        }
                    }.bind(this)
                });
            },
    
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                            this.byId("idDialog").close();
                            this.getView().getModel().setData(Object.assign({}, oData));
                        }
                    }.bind(this)
                });
            },
    
            productWeighStateFormatter: function (oVal) {
                return isNaN(oVal) ? ValueState.Error : ValueState.None;
            },
    
            discardProgress: function () {
                var oModel = this.getView().getModel();
                this._oWizard.discardProgress(this.byId("AdultStep"));
    
                var clearContent = function (aContent) {
                    for (var i = 0; i < aContent.length; i++) {
                        if (aContent[i].setValue) {
                            aContent[i].setValue("");
                        }
    
                        if (aContent[i].getContent) {
                            clearContent(aContent[i].getContent());
                        }
                    }
                };
    
                oModel.setProperty("/productWeightState", ValueState.Error);
                oModel.setProperty("/productNameState", ValueState.Error);
                clearContent(this._oWizard.getSteps());
            }

        });
    });
