import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Alert } from "react-native";

// Define the initial state using that type
const initialState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: null,
  Getboard: null,
  createboard: null,
};

let userAPi = `https://stage8.onrender.com/api/LearderBoard/`;

const Login_Fun_Service = async (data) => {
  let userAPi = `https://stage8.onrender.com/api/login/`;

  try {
    console.log({ data });
    const response = await axios.post(userAPi, data);
    console.log({ data2: response?.data });
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
export const Login_Fun = createAsyncThunk(
  "auth/Login_Fun",
  async (data, thunkAPI) => {
    try {
      // let token = thunkAPI.getState()?.LoginSlice?.data?.token;
      return await Login_Fun_Service(data);
    } catch (error) {
      console.log({ error });

      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      console.log({ message });
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const GetBoard_Service = async (token) => {
  // let userAPi = "http://localhost:5000/api/register";

  try {
    console.log({ token, userAPi });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(userAPi, config);
    console.log({ data2: response?.data });
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
export const GetBoard = createAsyncThunk(
  "auth/REG_Fun",
  async (data, thunkAPI) => {
    try {
      let token = thunkAPI.getState()?.authslice?.logindata?.token;

      return await GetBoard_Service(token);
    } catch (error) {
      console.log({ error });

      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      console.log({ message });
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const Leaderboardslice = createSlice({
  name: "Leaderboard",
  initialState,
  reducers: {
    reset_login: (state) => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(GetBoard.pending, (state) => {
        state.user_isLoading = true;
      })
      .addCase(GetBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.Getboard = action.payload;
      })
      .addCase(GetBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        console.log({ ee: state.message });

        Alert.alert(
          "Alert Title",
          ` ${state.message}`,
          [
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
        state.user = false;
        state.isSuccess = false;
      })
      .addCase(Login_Fun.pending, (state) => {
        state.user_isLoading = true;
        state.null = true;
      })
      .addCase(Login_Fun.fulfilled, (state, action) => {
        state.user_isLoading = false;
        state.isSuccess = true;
        state.user = true;
        state.logindata = action.payload;
      })
      .addCase(Login_Fun.rejected, (state, action) => {
        state.user_isLoading = false;
        state.isError = true;
        state.message = action.payload;
        console.log({ ee: state.message });

        Alert.alert(
          "Alert Title",
          ` ${state.message}`,
          [
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
        state.user = false;
        state.isSuccess = false;
      });
  },
});

export const { reset_login, checkOnboarding } = Leaderboardslice.actions;
export default Leaderboardslice.reducer;
