

export const initialState = {
    medicineSearch: {
        data: [],
        input: "",
        isLoading: false,
        isNotFound: false,
        valid: false,
        invalid: true,
    },

    goal: {
        input: 0,
        valid: false,
        invalid: true,
    },

    pledge: {
        input: 0,
        valid: false,
        invalid: true,
    },

    unit: {
        input: 0,
        valid: false,
        invalid: true
    },

    total: {
        input: 0,
        invalid: true,
        valid: false
    },

    condition: {
        isCondition: false,
        valid: false,
        invalid: true
    },
    conditionGoal: {
        input1: 0,
        input2: 0,
        valid: false,
        invalid: true
    },

    description: {
        input: "",
        valid: false,
        invalid: true
    },

    date: {
        input: "",
        valid: false,
        invalid: true
    },

    verifyModal: {
        on: false,
        isInfoMissing: false,
        isLoading: false,
        isSubmitSuccess: false,
        isSubmitFail: false
    }
}

export const yeniTeklifReducer = (state, action) => {
    switch (action.type) {
        ////////////////////////////////////////
        // ************ MEDICINE HANDLER ************** //
        ////////////////////////////////////////
        case "SET_MEDICINE_INPUT":
            for (let i = 0; i < state.medicineSearch.data.length; i++) {
                if (action.payload === `${state.medicineSearch.data[i].Product_name}--${state.medicineSearch.data[i].Barcode}` ) {
                    return {
                        ...state,
                        medicineSearch: {
                            ...state.medicineSearch,
                            input: action.payload,
                            valid: true,
                            invalid: false
                        }
                    }
                }
            }
            return {
                ...state,
                medicineSearch: {
                    ...state.medicineSearch,
                    input: action.payload,
                    valid: false,
                    invalid: true
                }
            }
        case "SET_DATA":
            return {
                ...state,
                medicineSearch: {
                    ...state.medicineSearch,
                    data: action.payload,
                    invalid: false,
                }
            }

        case "ISLOADING_TRUE":
            return {
                ...state,
                medicineSearch: {
                    ...state.medicineSearch,
                    isLoading: true,
                    isNotFound: false,
                }
            }
        case "ISLOADING_FALSE":
            return {
                ...state,
                medicineSearch: {
                    ...state.medicineSearch,
                    isLoading: false,
                    isNotFound: false,
                }
            }
        case "MEDICINE_NOT_FOUND":
            return {
                ...state,
                medicineSearch: {
                    ...state.medicineSearch,
                    isLoading: false,
                    isNotFound: true,
                    invalid: true
                }
            }
        ////////////////////////////////////////
        // ************ GOAL HANDLER ************** //
        ////////////////////////////////////////

        case "SET_GOAL_INPUT":
            const goalNum1 = Number(action.payload);
            const pledgeNum1 = Number(state.pledge.input)
            if (goalNum1 <= 0 || pledgeNum1 >= goalNum1) {
                return {
                    ...state,
                    goal: {
                        ...state.goal,
                        input: action.payload,
                        invalid: true,
                        valid: false
                    }
                }
            }
            return {
                ...state,
                goal: {
                    ...state.goal,
                    input: action.payload,
                    invalid: false,
                    valid: true
                }
            }

        
            ////////////////////////////////////////
        // ************ PLEDGE HANDLER ************** //
        ////////////////////////////////////////

        case "SET_PLEDGE_INPUT":
            const pledgeNum = Number(action.payload);
            const goalNum = Number(state.goal.input)
            if (pledgeNum <= 0 || pledgeNum >= goalNum) {
                return {
                    ...state,
                    pledge: {
                        ...state.pledge,
                        input: action.payload,
                        invalid: true,
                        valid: false
                    }
                }
            }
            return {
                ...state,
                pledge: {
                    ...state.pledge,
                    input: action.payload,
                    invalid: false,
                    valid: true
                }
            }

        ////////////////////////////////////////
      // ************ UNIT PRICE HANDLER ************** //
        ////////////////////////////////////////

        case "SET_UNIT_PRICE_INPUT":
            let math2 = action.payload * state.goal.input
            if (action.payload <= 0) {
                return {
                    ...state,
                    unit: {
                        ...state.unit,
                        input: action.payload,
                        invalid: true,
                        valid: false
                    }
                }
            }
            return {
                ...state,
                unit: {
                    ...state.unit,
                    input: action.payload,
                    invalid: false,
                    valid: true
                },
                total: {
                    ...state.total,
                    input: math2.toFixed(2),
                    invalid: false,
                    valid: true
                }
            }
        ////////////////////////////////////////
      // ************ UNIT PRICE HANDLER ************** //
        ////////////////////////////////////////

        case "SET_TOTAL_PRICE_INPUT":
            let math
            if (state.goal.input !== 0 && action.payload !== 0) {
                math = state.goal.input / action.payload
            } else {
                math = 0
            }
            if (action.payload <= 0) {
                return {
                    ...state,
                    total: {
                        ...state.total,
                        input: action.payload,
                        invalid: true,
                        valid: false
                    },
                    unit: {
                        ...state.unit,
                        input: 0,
                        invalid: true,
                        valid: false
                    }
                }
            }
            return {
                ...state,
                total: {
                    ...state.total,
                    input: action.payload,
                    invalid: false,
                    valid: true
                },
                unit: {
                    ...state.unit,
                    input: math.toFixed(2),
                    invalid: false,
                    valid: true
                }
            }

                ////////////////////////////////////////
      // ************ CONDITION HANDLER ************** //
        ////////////////////////////////////////

        case "IS_CONDITION":
            let value
            if (action.payload === "yes") {
                value = true
            } else {
                value = false
            }
            return {
                ...state,
                condition: {
                    ...state.condition,
                    isCondition: value,
                    valid: true,
                    invalid: false
                }
            }
                ////////////////////////////////////////
      // ************ CONDITION GOAL HANDLER ************** //
        ////////////////////////////////////////

        case "SET_CONDITION_GOAL_INPUT1":
            if (action.payload > 0 && state.conditionGoal.input2 > 0) {
                return {
                    ...state,
                    conditionGoal: {
                        ...state.conditionGoal,
                        input1: action.payload,
                        invalid: false,
                        valid: true
                    }
                }
            }
            return {
                ...state,
                conditionGoal: {
                    ...state.conditionGoal,
                    input1: action.payload,
                    invalid: true,
                    valid: false
                }
            }

        case "SET_CONDITION_GOAL_INPUT2":
            if (action.payload > 0 && state.conditionGoal.input1 > 0) {
                return {
                    ...state,
                    conditionGoal: {
                        ...state.conditionGoal,
                        input2: action.payload,
                        invalid: false,
                        valid: true
                    }
                }
            }
            return {
                ...state,
                conditionGoal: {
                    ...state.conditionGoal,
                    input2: action.payload,
                    invalid: true,
                    valid: false
                }
            }

                ////////////////////////////////////////
      // ************ DESCRIPTION HANDLER ************** //
        ////////////////////////////////////////

        case "SET_DESCRIPTION_VALUE":

            if (action.payload === "") {
                return {
                    ...state,
                    description: {
                        valid: false,
                        invalid: true
                    }
                }
            }

            return {
                ...state,
                description: {
                    input: action.payload,
                    valid: true,
                    invalid: false
                }
            }

                    ////////////////////////////////////////
      // ************ DATE HANDLER ************** //
        ////////////////////////////////////////

        case "SET_DATE_INPUT":
            const inputDate = new Date(action.payload);
            const today = new Date();
            if (inputDate.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) {
                return {
                    ...state,
                    date: {
                        ...state.date,
                        invalid: true,
                        valid: false
                    }
                };
            };
            return {
                ...state,
                date: {
                    ...state.date,
                    input: action.payload,
                    invalid: false,
                    valid: true
                }
            };

                ////////////////////////////////////////
      // ************ VERIFY MODAL HANDLER ************** //
        ////////////////////////////////////////

        case "VERIFY_MODAL_TOGGLE":

            const { medicineSearch, goal, pledge, unit, total, condition, description, date } = state;
            let arr
            if (condition.isCondition === false) {
                const stateObj = {
                    medicineSearch,
                    goal,
                    pledge,
                    unit,
                    total,
                    condition,
                    description,
                    date
                }
                arr = Object.values(stateObj)
            } else {
                arr = Object.values(state)
            }
            console.log(arr);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].invalid === true) {
                    console.log("MISSING INFO")
                    return {
                        ...state,
                        verifyModal: {
                            ...state.verifyModal,
                            isInfoMissing: !state.verifyModal.isInfoMissing
                        }
                    }
                }
            }
            console.log('youre good to go!')
            return {
                ...state,
                verifyModal: {
                    on: !state.verifyModal.on
                },
            }
        case "FORM_SUBMIT_LOADING":
            return {
                ...state,
                verifyModal: {
                    ...state.verifyModal,
                    on: false,
                    isLoading: !state.verifyModal.isLoading
                }
            }

        case "SUBMIT_SUCCESS":
            return {
                ...state,
                medicineSearch: {
                    data: [],
                    input: "",
                    isLoading: false,
                    isNotFound: false,
                    valid: false,
                    invalid: true,
                },
            
                goal: {
                    input: 0,
                    valid: false,
                    invalid: true,
                },
            
                pledge: {
                    input: 0,
                    valid: false,
                    invalid: true,
                },
            
                unit: {
                    input: 0,
                    valid: false,
                    invalid: true
                },
            
                total: {
                    input: 0,
                    invalid: true,
                    valid: false
                },
            
                condition: {
                    isCondition: false,
                    valid: false,
                    invalid: true
                },
                conditionGoal: {
                    input1: 0,
                    input2: 0,
                    valid: false,
                    invalid: true
                },
            
                description: {
                    input: "",
                    valid: false,
                    invalid: true
                },
            
                date: {
                    input: "",
                    valid: false,
                    invalid: true
                },
                verifyModal: {
                    ...state.verifyModal,
                    on: false,
                    isSubmitSuccess: !state.verifyModal.isSubmitSuccess
                }
            }

        case "SUBMIT_FAIL":
            return {
                ...state,
                medicineSearch: {
                    data: [],
                    input: "",
                    isLoading: false,
                    isNotFound: false,
                    valid: false,
                    invalid: true,
                },
            
                goal: {
                    input: 0,
                    valid: false,
                    invalid: true,
                },
            
                pledge: {
                    input: 0,
                    valid: false,
                    invalid: true,
                },
            
                unit: {
                    input: 0,
                    valid: false,
                    invalid: true
                },
            
                total: {
                    input: 0,
                    invalid: true,
                    valid: false
                },
            
                condition: {
                    isCondition: false,
                    valid: false,
                    invalid: true
                },
                conditionGoal: {
                    input1: 0,
                    input2: 0,
                    valid: false,
                    invalid: true
                },
            
                description: {
                    input: "",
                    valid: false,
                    invalid: true
                },
            
                date: {
                    input: "",
                    valid: false,
                    invalid: true
                },
                verifyModal: {
                    ...state.verifyModal,
                    on: false,
                    isSubmitFail: !state.verifyModal.isSubmitFail
                }
            }
    


        default:
            return state
    }
}