export const ArrowUpRight = ({ color = "currentColor" }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 13L13 3M13 3H5M13 3V11" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CopyIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="5" y="5" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 10V4a1 1 0 0 1 1-1h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const ChiliLogo = (props) => (
  <svg viewBox="0 0 62 71" fill="none" aria-hidden="true" {...props}>
    <path
      d="M19.3 18.83C21.63 17.41 23.5 16.51 25.04 16.02C28.11 15.04 30.06 15.86 31.21 17.78C32.84 20.65 32.7 25.66 33.39 31.25C33.86 34.95 34.67 38.84 36.46 42.38C38.9 46.7 49.2 52.4 54.46 57.64C55.3 58.6 55.6 59.6 55.3 60.27C54.2 61.2 36.7 56.6 29.16 50.73C18.3 42 9.6 30.5 19.3 18.83Z"
      fill="#E44C63"
      fillOpacity=".57"
      stroke="#69D4E2"
    />
    <path
      d="M26.95 13.77C25.02 13.07 22.94 12.87 20.9 13.16L20.25 13.26C19.29 13.4 18.36 13.72 17.51 14.19L15.62 15.25L14.32 17.51C13.57 18.8 13.21 20.28 13.26 21.77L13.28 22.36C13.29 22.77 13.26 23.18 13.17 23.58L12.8 25.32L12.26 26.51L15.28 23.36L17.99 23.98L20.16 19.25L26.53 18.44L25.17 15.61L29.94 16L31.66 15.35L30.5 15.39L29.32 14.85L26.95 13.77Z"
      fill="#69D4E2"
    />
    <path
      d="M14.5 12.45C16.33 14.87 15.1 18.89 16.07 18.16C17.04 17.42 18.29 12 16.46 9.59C14.63 7.17 11.48 6.47 10.52 7.2C9.55 7.94 12.67 10.04 14.5 12.45Z"
      fill="#69D4E2"
    />
  </svg>
);

const tileIcon = (paths) => () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {paths}
  </svg>
);

export const TileIcons = {
  food: tileIcon(
    <>
      <path d="M4 11h16a8 8 0 0 1-16 0Z" />
      <path d="M8 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5M16 7c0-1.5 1-2 1-3.5" />
    </>,
  ),
  cat: tileIcon(
    <>
      <path d="M5 20v-9l-1-6 4 3h8l4-3-1 6v9Z" />
      <path d="M9 14h.01M15 14h.01M11 17h2" />
    </>,
  ),
  music: tileIcon(
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>,
  ),
  books: tileIcon(<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5" />),
  movies: tileIcon(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18M8 5v4M16 5v4" />
    </>,
  ),
  places: tileIcon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5Z" />
    </>,
  ),
  people: tileIcon(
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16 14.2c2.8.3 5 2.6 5 5.8" />
    </>,
  ),
};
