// theme/mantineTheme.ts
import { createTheme } from '@mantine/core';

export const mantineTheme = createTheme({
   fontFamily: "var(--font-quicksand), sans-serif",
  /** Yeh default gradient poore app mein variant="gradient" pe use hoga */
  defaultGradient: {
    from: 'grape.5',   // starting color (Mantine ke built-in colors ya custom)
    to: 'red.4',       // ending color
    deg: 45,          // gradient direction in degrees (0-360)
  },

  /** Optional: Primary color ko bhi gradient ke hisab se match karo */
  primaryColor: 'grape',

  /** Agar aur customization chahiye, jaise custom colors add karna */
  // colors: {
  //   'brand-gradient': ['#your-color1', '#your-color2', ...], // 10 shades
  // },
});