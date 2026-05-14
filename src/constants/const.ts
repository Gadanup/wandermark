export const APP_NAME = 'Wandermark'

export const NAV_LABELS = {
  map: 'Map',
  album: 'Album',
  trips: 'Trips',
  profile: 'Profile',
} as const

export const STATS_LABELS = {
  countries: 'Countries',
  cities: 'Cities',
  photos: 'Photos',
} as const

export const RATING_LABELS = {
  food_drink: 'Food & Drink',
  safety: 'Safety',
  beauty: 'Beauty',
  value_for_money: 'Value for Money',
  vibe: 'Vibe',
  ease_of_travel: 'Ease of Travel',
} as const

export const PHOTO_CATEGORY_LABELS = {
  food: 'Food',
  landscape: 'Landscape',
  architecture: 'Architecture',
  people: 'People',
  nightlife: 'Nightlife',
  transport: 'Transport',
  art: 'Art',
  other: 'Other',
} as const

export const EMPTY_STATES = {
  map: 'Add your first place to start your travel journal.',
  places: 'No places logged yet.',
  trips: 'No trips yet. Create your first trip.',
  album: 'No photos yet. Add photos to your places to fill your album.',
  profile: 'Update your profile to personalise your journal.',
} as const

export const PLACEHOLDERS = {
  searchPlace: 'Search for a place…',
  notes: 'Notes about this place…',
  caption: 'Add a caption…',
  tripTitle: 'Trip title…',
  tripDescription: 'Describe this trip…',
  username: 'Username',
  bio: 'Tell us a bit about your travels…',
} as const

export const BUTTON_LABELS = {
  addPlace: 'Add Place',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  createTrip: 'New Trip',
  addPhotos: 'Add Photos',
  signIn: 'Sign In',
  signUp: 'Sign Up',
  signOut: 'Sign Out',
  sendMagicLink: 'Send magic link',
  continue: 'Continue',
  skip: 'Skip for now',
  done: 'Done',
} as const

export const ONBOARDING_LABELS = {
  title: 'Set up your profile',
  subtitle: 'A few quick details to personalise your journal.',
  usernameLabel: 'Username',
  usernameHelp: 'Letters, numbers and underscores only.',
  avatarLabel: 'Profile photo',
  choosePhoto: 'Choose photo',
  completeButton: 'Start exploring',
  usernameMin: 'At least 3 characters',
  usernameMax: 'Max 30 characters',
  usernameFormat: 'Letters, numbers and underscores only',
  usernameRequired: 'Username is required',
} as const

export const AUTH_LABELS = {
  signInTitle: 'Welcome back',
  signUpTitle: 'Start your journal',
  magicLinkTitle: 'Sign in without a password',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  signInSubtitle: 'Sign in to continue your travels.',
  signUpSubtitle: 'Create an account to start logging your travels.',
  magicLinkSubtitle: "We'll send a sign-in link straight to your inbox.",
  magicLinkSentTitle: 'Check your inbox',
  magicLinkSent: 'A sign-in link is on its way. You can close this tab.',
  noAccount: 'No account?',
  hasAccount: 'Already have an account?',
  usePassword: 'Use password instead',
  useMagicLink: 'Or sign in with a magic link',
  passwordMinLength: 'At least 8 characters',
  emailInvalid: 'Invalid email address',
  emailRequired: 'Email is required',
  passwordRequired: 'Password is required',
} as const
