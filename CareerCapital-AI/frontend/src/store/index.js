import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Auth store — supports full user accounts AND guest mode
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: false,

      // Guest data — persisted locally until user creates an account
      guestData: {
        goalProfile: null,
        stageProgress: {},
        savedColleges: [],
        savedScholarships: [],
        loanDetails: null,
        chatHistory: [],
        alerts: [],
        profileCompletion: 0,
      },

      // Full account login
      login: (user, token) => set({ user, token, isAuthenticated: true, isGuest: false }),

      // Guest mode — no sign-up required, all stages open
      loginAsGuest: () => set({
        user: { name: 'Guest', email: '', isGuest: true },
        token: null,
        isAuthenticated: true,
        isGuest: true,
      }),

      logout: () => set({ user: null, token: null, isAuthenticated: false, isGuest: false }),

      setUser: (user) => set({ user }),

      // Update guest data (goalProfile, stage progress, etc.)
      updateGuestData: (updates) => set((state) => ({
        guestData: { ...state.guestData, ...updates },
      })),

      // When a guest creates an account, migrate their local data
      migrateGuestData: (user, token) => {
        const { guestData } = get()
        set({ user, token, isAuthenticated: true, isGuest: false })
        return guestData
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
        guestData: state.guestData,
      }),
    }
  )
)

// Dashboard data store
export const useDashboardStore = create((set) => ({
  loanAmount: 0,
  interestRate: 0,
  tenure: 0,
  monthlyPayment: 0,
  setLoanData: (data) => set(data),
  careerProfile: null,
  setCareerProfile: (profile) => set({ careerProfile: profile }),
}))

// College finder store
export const useCollegeStore = create(
  persist(
    (set, get) => ({
      savedCollegeIds: [],
      compareCollegeIds: [],
      recentlyViewedIds: [],
      toggleSavedCollege: (id) =>
        set((state) => ({
          savedCollegeIds: state.savedCollegeIds.includes(id)
            ? state.savedCollegeIds.filter((collegeId) => collegeId !== id)
            : [...state.savedCollegeIds, id],
        })),
      toggleCompareCollege: (id) =>
        set((state) => {
          if (state.compareCollegeIds.includes(id)) {
            return { compareCollegeIds: state.compareCollegeIds.filter((collegeId) => collegeId !== id) }
          }
          if (state.compareCollegeIds.length >= 4) return state
          return { compareCollegeIds: [...state.compareCollegeIds, id] }
        }),
      clearCompare: () => set({ compareCollegeIds: [] }),
      addRecentlyViewed: (id) =>
        set((state) => ({
          recentlyViewedIds: [id, ...state.recentlyViewedIds.filter((collegeId) => collegeId !== id)].slice(0, 6),
        })),
    }),
    { name: 'college-finder-storage' }
  )
)

// Theme store
export const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    { name: 'theme-storage' }
  )
)
