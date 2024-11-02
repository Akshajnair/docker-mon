import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Theme = "dark" | "light"

export interface IUserPreferenceState {
    theme: Theme
}

const initialState: IUserPreferenceState = {
    theme: "light",
}

export const userPreferenceSlice = createSlice({
    name: 'userPreference',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setTheme } = userPreferenceSlice.actions

export default userPreferenceSlice.reducer