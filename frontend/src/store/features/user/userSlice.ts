import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/store/services/api";

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  avatar?: string;
  grade?: string;
  points?: number;
  rank?: number;
  streakDays?: number;
  badges?: Badge[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

interface UserState {
  profile: UserProfile | null;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
  isLoading: boolean;
}

const initialState: UserState = {
  profile: null,
  preferences: {
    notifications: true,
    darkMode: false,
    language: "en",
  },
  isLoading: false,
};

// Extend the api slice to include user endpoints
export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (data) => ({
        url: "/user/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: "/user/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UserState["preferences"]>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.getUserProfile.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        userApi.endpoints.getUserProfile.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.profile = action.payload;
        }
      )
      .addMatcher(userApi.endpoints.getUserProfile.matchRejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setProfile, updatePreferences, clearProfile } =
  userSlice.actions;
export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadAvatarMutation,
} = userApi;
export default userSlice.reducer;
