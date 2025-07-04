import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Interfaces
interface StudentVerification {
  id: number;
  fullname: string;
}

interface AttendanceDetails {
  id: number;
  studentId: number;
  studentName: string;
  present: boolean;
  remark: string;
  date: string;
}

interface AttendanceState {
  loading: boolean;
  error: string | null;
  success: string | null;
  attendanceDetails: AttendanceDetails | null;
  studentVerification: StudentVerification | null;
}

const initialState: AttendanceState = {
  loading: false,
  error: null,
  success: null,
  attendanceDetails: null,
  studentVerification: null,
};

// Helper function to get token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("Access_token");
};

// Async Thunks
export const updateAttendance = createAsyncThunk(
  "attendance/update",
  async (
    data: { studentId: number; present: boolean; remark: string; attedenceId: number },
    { rejectWithValue }
  ) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("Access token missing");
      }

      const res = await axios.put(
        "http://localhost:4000/student/updateAttednce",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Attendance updated successfully");
      return res.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to update attendance";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteAttendance = createAsyncThunk(
  "attendance/delete",
  async (attedenceId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("Access token missing");
      }

      const res = await axios.delete(
        `http://localhost:4000/attendance/${attedenceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success(res.data.message || "Attendance deleted successfully");
      return res.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to delete attendance";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const verifyStudent = createAsyncThunk(
  "attendance/verifyStudent",
  async (studentId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("Access token missing");
      }

      const res = await axios.get(`http://localhost:4000/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return {
        id: res.data.id,
        fullname: res.data.fullname,
      };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Student verification failed";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const getAttendanceDetails = createAsyncThunk(
  "attendance/getDetails",
  async (attendanceId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("Access token missing");
      }

      const res = await axios.get(`http://localhost:4000/attendance/${attendanceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return res.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to fetch attendance details";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Slice
const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceState: (state) => {
      state.error = null;
      state.success = null;
    },
    clearStudentVerification: (state) => {
      state.studentVerification = null;
    },
    clearAttendanceDetails: (state) => {
      state.attendanceDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Attendance
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        if (state.attendanceDetails?.id === action.payload.id) {
          state.attendanceDetails = {
            ...state.attendanceDetails,
            ...action.payload,
          };
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Attendance
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteAttendance.fulfilled, (state) => {
        state.loading = false;
        state.attendanceDetails = null;
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Verify Student
      .addCase(verifyStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.studentVerification = action.payload;
      })
      .addCase(verifyStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.studentVerification = null;
      })

      // Get Attendance Details
      .addCase(getAttendanceDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceDetails = action.payload;
      })
      .addCase(getAttendanceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.attendanceDetails = null;
      });
  },
});

export const { 
  clearAttendanceState, 
  clearStudentVerification,
  clearAttendanceDetails 
} = attendanceSlice.actions;

export default attendanceSlice.reducer;