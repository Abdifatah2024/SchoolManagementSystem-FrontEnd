// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";
// // import { RootState } from "../../Redux/store";
// // const API_BASE = "http://localhost:4000";
// // export interface FinancialReportState {
// //   incomeStatement: any | null;
// //   balanceSheet: any | null;
// //   cashFlow: any | null;
// //   loading: boolean;
// //   error: string | null;
// // }

// // const initialState: FinancialReportState = {
// //   incomeStatement: null,
// //   balanceSheet: null,
// //   cashFlow: null,
// //   loading: false,
// //   error: null,
// // };

// // // Async Thunks
// // export const getIncomeStatement = createAsyncThunk(
// //   "financial/getIncomeStatement",
// //   async (
// //     { month, year }: { month: number; year: number },
// //     { rejectWithValue }
// //   ) => {
// //     try {
// //       const res = await axios.get(
// //         `${API_BASE}/financial/Reports/income-statement`,
// //         {
// //           params: { month, year },
// //         }
// //       );
// //       return res.data;
// //     } catch (err: any) {
// //       return rejectWithValue(
// //         err.response?.data?.message || "Failed to fetch income statement"
// //       );
// //     }
// //   }
// // );

// // export const getBalanceSheet = createAsyncThunk(
// //   "financial/getBalanceSheet",
// //   async (
// //     { month, year }: { month: number; year: number },
// //     { rejectWithValue }
// //   ) => {
// //     try {
// //       const res = await axios.get(
// //         `${API_BASE}/financial/Reports/balance-sheet`,
// //         {
// //           params: { month, year },
// //         }
// //       );
// //       return res.data;
// //     } catch (err: any) {
// //       return rejectWithValue(
// //         err.response?.data?.message || "Failed to fetch balance sheet"
// //       );
// //     }
// //   }
// // );

// // export const getCashFlow = createAsyncThunk(
// //   "financial/getCashFlow",
// //   async (
// //     { month, year }: { month: number; year: number },
// //     { rejectWithValue }
// //   ) => {
// //     try {
// //       const res = await axios.get(`${API_BASE}/financial/Reports/cash-flow`, {
// //         params: { month, year },
// //       });
// //       return res.data;
// //     } catch (err: any) {
// //       return rejectWithValue(
// //         err.response?.data?.message || "Failed to fetch cash flow report"
// //       );
// //     }
// //   }
// // );

// // // Slice
// // const financialSlice = createSlice({
// //   name: "financial",
// //   initialState,
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       // Income Statement
// //       .addCase(getIncomeStatement.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(getIncomeStatement.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.incomeStatement = action.payload;
// //       })
// //       .addCase(getIncomeStatement.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload as string;
// //       })

// //       // Balance Sheet
// //       .addCase(getBalanceSheet.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(getBalanceSheet.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.balanceSheet = action.payload;
// //       })
// //       .addCase(getBalanceSheet.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload as string;
// //       })

// //       // Cash Flow
// //       .addCase(getCashFlow.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(getCashFlow.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.cashFlow = action.payload;
// //       })
// //       .addCase(getCashFlow.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload as string;
// //       });
// //   },
// // });

// // export default financialSlice.reducer;

// // // Selector
// // export const selectFinancialReports = (state: RootState) => state.financial;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { RootState } from "../../Redux/store";

// const API_BASE = "http://localhost:4000";

// export interface IncomeStatement {
//   month: number;
//   year: number;
//   currentIncome: number;
//   previousIncome: number;
//   advanceIncome: number;
//   totalRevenue: number;
//   totalDiscounts: number;
//   totalEmployeeAdvances: number;
//   totalExpenses: number;
//   netIncome: number;
//   netRevenue: number;
// }

// export interface FinancialReportState {
//   incomeStatement: IncomeStatement | null;
//   balanceSheet: any | null;
//   cashFlow: any | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: FinancialReportState = {
//   incomeStatement: null,
//   balanceSheet: null,
//   cashFlow: null,
//   loading: false,
//   error: null,
// };

// // Async Thunks
// export const getIncomeStatement = createAsyncThunk(
//   "financial/getIncomeStatement",
//   async (
//     { month, year }: { month: number; year: number },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/financial/Reports/income-statement`,
//         {
//           params: { month, year },
//         }
//       );
//       return res.data as IncomeStatement;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch income statement"
//       );
//     }
//   }
// );

// export const getBalanceSheet = createAsyncThunk(
//   "financial/getBalanceSheet",
//   async (
//     { month, year }: { month: number; year: number },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/financial/Reports/balance-sheet`,
//         {
//           params: { month, year },
//         }
//       );
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch balance sheet"
//       );
//     }
//   }
// );

// export const getCashFlow = createAsyncThunk(
//   "financial/getCashFlow",
//   async (
//     { month, year }: { month: number; year: number },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await axios.get(`${API_BASE}/financial/Reports/cash-flow`, {
//         params: { month, year },
//       });
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch cash flow report"
//       );
//     }
//   }
// );

// // Slice
// const financialSlice = createSlice({
//   name: "financial",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Income Statement
//       .addCase(getIncomeStatement.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getIncomeStatement.fulfilled, (state, action) => {
//         state.loading = false;
//         state.incomeStatement = action.payload;
//       })
//       .addCase(getIncomeStatement.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Balance Sheet
//       .addCase(getBalanceSheet.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getBalanceSheet.fulfilled, (state, action) => {
//         state.loading = false;
//         state.balanceSheet = action.payload;
//       })
//       .addCase(getBalanceSheet.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Cash Flow
//       .addCase(getCashFlow.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getCashFlow.fulfilled, (state, action) => {
//         state.loading = false;
//         state.cashFlow = action.payload;
//       })
//       .addCase(getCashFlow.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default financialSlice.reducer;

// // Selector
// export const selectFinancialReports = (state: RootState) => state.financial;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../Redux/store";
import { BASE_API_URL } from "../../Constant";

// ===== Types =====
export interface Allocation {
  month: number;
  year: number;
}

export interface StudentPayment {
  studentName: string;
  amountPaid: number;
  discount: number;
  description: string;
  date: string;
  allocations: Allocation[];
}

export interface UserPaymentSummary {
  userId: number;
  fullName: string;
  email: string;
  totalPaid: number;
  totalDiscount: number;
  totalTransactions: number;
  studentPayments: StudentPayment[];
}

export interface IncomeStatement {
  month: number;
  year: number;
  currentIncome: number;
  previousIncome: number;
  advanceIncome: number;
  totalRevenue: number;
  totalDiscounts: number;
  totalEmployeeAdvances: number;
  totalExpenses: number;
  netIncome: number;
  netRevenue: number;
}

export interface FinancialReportState {
  incomeStatement: IncomeStatement | null;
  balanceSheet: any | null;
  cashFlow: any | null;
  usersPaymentSummary: UserPaymentSummary[];
  loading: boolean;
  error: string | null;
}

// ===== Initial State =====
const initialState: FinancialReportState = {
  incomeStatement: null,
  balanceSheet: null,
  cashFlow: null,
  usersPaymentSummary: [],
  loading: false,
  error: null,
};

// ===== Async Thunks =====

// Get Income Statement
export const getIncomeStatement = createAsyncThunk(
  "financial/getIncomeStatement",
  async (
    { month, year }: { month: number; year: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/financial/Reports/income-statement`,
        {
          params: { month, year },
        }
      );
      return res.data as IncomeStatement;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch income statement"
      );
    }
  }
);

// Get Balance Sheet
export const getBalanceSheet = createAsyncThunk(
  "financial/getBalanceSheet",
  async (
    { month, year }: { month: number; year: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/financial/Reports/balance-sheet`,
        {
          params: { month, year },
        }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch balance sheet"
      );
    }
  }
);

// Get Cash Flow
export const getCashFlow = createAsyncThunk(
  "financial/getCashFlow",
  async (
    { month, year }: { month: number; year: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/financial/Reports/cash-flow`,
        {
          params: { month, year },
        }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cash flow report"
      );
    }
  }
);

// Get User Payment Collection Summary (NEW)
export const fetchUserPaymentCollections = createAsyncThunk(
  "financial/fetchUserPaymentCollections",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_API_URL}/fee/payments/collection-summary`
      );
      return res.data as UserPaymentSummary[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch user payment collections"
      );
    }
  }
);

// ===== Slice =====
const financialSlice = createSlice({
  name: "financial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === Income Statement ===
      .addCase(getIncomeStatement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncomeStatement.fulfilled, (state, action) => {
        state.loading = false;
        state.incomeStatement = action.payload;
      })
      .addCase(getIncomeStatement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // === Balance Sheet ===
      .addCase(getBalanceSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBalanceSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.balanceSheet = action.payload;
      })
      .addCase(getBalanceSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // === Cash Flow ===
      .addCase(getCashFlow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCashFlow.fulfilled, (state, action) => {
        state.loading = false;
        state.cashFlow = action.payload;
      })
      .addCase(getCashFlow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // === User Payment Collections ===
      .addCase(fetchUserPaymentCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPaymentCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.usersPaymentSummary = action.payload;
      })
      .addCase(fetchUserPaymentCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default financialSlice.reducer;

// ===== Selector =====
export const selectFinancialReports = (state: RootState) => state.financial;
