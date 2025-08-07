# User flow from HOME
Step 0: ZipCodePage        → Enter zip code & get neighborhood
Step 1: CleaningTypePage   → Select cleaning type
Step 2: SpaceSizePage      → Bedrooms, bathrooms, square footage
Step 3: TimingPage         → ASAP vs Scheduled (BRANCHING POINT)

// scheduled path: 
Step 3: TimingPage → Select date/time → Auto-assign cleaner → Step 6
Step 6: BookingPage → Enter address, phone, hours, notes
Step 7: PaymentPage → Payment details & processing
Step 8: ReservationConfirmedPage → Success confirmation

// ASAP path: 
Step 3: TimingPage → Select "ASAP" → Step 4
Step 4: CleanersPage → Browse available cleaners
Step 5: CleanerProfileDetailPage → View cleaner details, book again
Step 6: BookingPage → Enter address, phone, hours, notes  
Step 7: PaymentPage → Payment details & processing
Step 8: ReservationConfirmedPage → Success confirmation
Step 9: ReservationPendingPage → Pending confirmation (if needed)

# Special Navigation Routes:
From BookingPage (Step 6):
Click cleaner profile → Step 5: CleanerProfileDetailPage (Cleaner's about/profile page)
Back navigation preserves previous step
From CleanerProfileDetailPage (Step 5):
Back to previous step → Returns to calling step (e.g., Step 6 BookingPage or Step 4 CleanersPage)
Cross-Step Navigation:
Step 10: BookingDetailPage - Accessible from BookingsScreen (chat interface)
Authentication flow - Guest checkout vs login at payment

# User flow from BOOKING
BookingsScreen → Display confirmed bookings list
├── Empty state → "Add Sample Bookings" (dev button)
├── Booking cards → Show cleaner, status, time, location
└── Click cleaner section → Navigate to BookingDetailPage

BookingDetailPage Navigation:
BookingsScreen 
└── Click any booking's cleaner section
    └── BookingDetailPage (opens on Chat tab by default)
        ├── Tab 1: Receipt → Costs, rates, totals
        ├── Tab 2: Task Info → Booking details, cleaner profile  
        └── Tab 3: Chat → Messages, voice messages, translation
            ├── 🎤 Voice recording → Voice-to-text → Translation
            ├── 🌐 Translation toggle per message
            └── Auto-scroll to bottom

Back Navigation:
BookingDetailPage → Back button → BookingsScreen
├── setSelectedBooking(null)
├── setBookingDetailActive(false)  
└── Show tab bar again

# Global Nav Control
Tab Bar Visibility Logic:
tabBarStyle: isBookingDetailActive ? {
  display: 'none'           // Hidden in BookingDetailPage
} : currentStep === 0 ? {   
  position: 'absolute'      // Visible on ZipCodePage only
} : {
  display: 'none'           // Hidden during booking flow
}


# State Management:
currentStep - Controls Home booking flow (0-10)
selectedBooking - Controls Bookings tab detail view
isBookingDetailActive - Controls tab bar visibility
bookingData - Persists user selections across steps
confirmedBookings - Stored confirmed bookings from AsyncStorage
# Context Switching:
Home → Bookings: Independent navigation, tab bar shows/hides
Booking flow interruption: Can switch tabs, state preserved
BookingDetailPage: Hides tab bar, full-screen experience
Voice messages: Work in both Home flow and Bookings chat
# Key UI Behaviors:
Auto-scroll: Chat messages scroll to bottom automatically
Voice recording: Press & hold for voice-to-text
Translation: Per-message toggle with 🌐 button
Tab persistence: Chat tab opens by default in BookingDetailPage
Guest flow: Authentication check before payment






// new as 8/5/2025
Step 0: ZipCodePage (no change)
Step 1: CleaningTypePage (no change)
Step 2: SpaceSizePage (no change)
Step 3: TimingPage (no change)
Step 4: CleanersPage (was step 6)
Step 5: CleanerProfileDetailPage (was step 7)
Step 6: BookingPage (was step 8)
Step 7: ReservationPendingPage (was step 9)



// old
Step 3: TimingPage
Step 4: SchedulePage
Step 5: TimeSelectionPage 

