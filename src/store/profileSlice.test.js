import profileReducer, {
  setCurrentAge,
  setTotalDebt,
  addIncome,
  addTemplateGoal,
  resetProfile,
  selectTotalMonthlyIncome,
  selectDebtFreeCountdown,
} from "./profileSlice";

describe("profileSlice", () => {
  const initialState = profileReducer(undefined, { type: "" });

  it("should return the initial state", () => {
    expect(initialState).toBeDefined();
    expect(initialState.currentAge).toEqual(30);
    expect(initialState.incomes.length).toBe(1);
  });

  it("should handle setCurrentAge", () => {
    const actual = profileReducer(initialState, setCurrentAge(35));
    expect(actual.currentAge).toEqual(35);
  });

  it("should handle setTotalDebt", () => {
    const actual = profileReducer(initialState, setTotalDebt(500000));
    expect(actual.totalDebt).toEqual(500000);
  });

  it("should handle addIncome", () => {
    const newIncome = { name: "Freelance", amount: 20000, type: "monthly" };
    const actual = profileReducer(initialState, addIncome(newIncome));
    expect(actual.incomes.length).toBe(2); 
    expect(actual.incomes[1].name).toEqual("Freelance");
  });

  it("should handle addTemplateGoal for emergencyFund", () => {
    const actual = profileReducer(initialState, addTemplateGoal({ type: "emergencyFund", monthlyExpenses: 30000 }));
    
    expect(actual.goals.length).toBe(2); // 1 default goal + 1 new
    expect(actual.goals[1].name).toEqual("Emergency Fund");
    expect(actual.goals[1].targetAmount).toEqual(180000); // 30000 * 6
  });

  it("should handle resetProfile", () => {
    const modifiedState = profileReducer(initialState, setCurrentAge(45));
    const resetState = profileReducer(modifiedState, resetProfile());
    expect(resetState.currentAge).toEqual(30);
  });

  describe("selectors", () => {
    it("selectTotalMonthlyIncome should return total income", () => {
      const state = { profile: initialState };
      // The default state contains 1 income of 100,000
      expect(selectTotalMonthlyIncome(state)).toEqual(100000); 
    });

    it("selectDebtFreeCountdown should calculate correctly", () => {
      const state = {
        profile: {
          ...initialState,
          totalDebt: 100000,
        }
      };
      // Surplus: 100000 (income) - 50000 (default expenses) = 50000
      // Months: 100000 debt / 50000 surplus = 2 months
      expect(selectDebtFreeCountdown(state)).toEqual("2 months");
    });
  });
});