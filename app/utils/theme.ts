type ThemeArrayItem = {
  value: string;
  label: string;
  bg: string;
  text: string;
  button: string;
  buttonText: string;
};

type ThemeObject = {
  [key: string]: Omit<ThemeArrayItem, "value" | "label">;
};

function convertThemesArrayToObject(
  themesArray: ThemeArrayItem[]
): ThemeObject {
  return themesArray.reduce((acc: ThemeObject, theme) => {
    acc[theme.value] = {
      bg: theme.bg,
      text: theme.text,
      button: theme.button,
      buttonText: theme.buttonText,
    };
    return acc;
  }, {});
}

export const themesArray = [
  {
    value: "sunset-glow",
    label: "Sunset Glow",
    bg: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#ff7e5f",
  },
  {
    value: "ocean-breeze",
    label: "Ocean Breeze",
    bg: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#00c6ff",
  },
  {
    value: "purple-haze",
    label: "Purple Haze",
    bg: "linear-gradient(135deg, #7b2ff7 0%, #f107a3 100%)",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#7b2ff7",
  },
  {
    value: "morning-sky",
    label: "Morning Sky",
    bg: "linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)",
    text: "#000000",
    button: "#000000",
    buttonText: "#ffb347",
  },
  {
    value: "electric-blue",
    label: "Electric Blue",
    bg: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#43cea2",
  },
  {
    value: "pink-sunset",
    label: "Pink Sunset",
    bg: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#f857a6",
  },
  {
    value: "aurora",
    label: "Aurora",
    bg: "linear-gradient(135deg, #00ffcc 0%, #0066ff 100%)",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#00ffcc",
  },
  {
    value: "mint-breeze",
    label: "Mint Breeze",
    bg: "linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)",
    text: "#000000",
    button: "#000000",
    buttonText: "#a8ff78",
  },
  {
    value: "fire-and-ice",
    label: "Fire & Ice",
    bg: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 50%, #1e3c72 100%)",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#ff416c",
  },
  {
    value: "twilight",
    label: "Twilight",
    bg: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#0f0c29",
  },

  {
    value: "classic-white",
    label: "Classic White",
    bg: "#ffffff",
    text: "#000000",
    button: "#000000",
    buttonText: "#ffffff",
  },
  {
    value: "dark-mode",
    label: "Dark Mode",
    bg: "#1a1a1a",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#000000",
  },
  {
    value: "ocean-blue",
    label: "Ocean Blue",
    bg: "#0077b6",
    text: "#ffffff",
    button: "#00b4d8",
    buttonText: "#ffffff",
  },
  {
    value: "forest-green",
    label: "Forest Green",
    bg: "#2d6a4f",
    text: "#ffffff",
    button: "#40916c",
    buttonText: "#ffffff",
  },
  {
    value: "sunset-orange",
    label: "Sunset Orange",
    bg: "#ff6b6b",
    text: "#ffffff",
    button: "#ff8787",
    buttonText: "#ffffff",
  },
  {
    value: "soft-pink",
    label: "Soft Pink",
    bg: "#ffc6c6",
    text: "#6b0000",
    button: "#ff8787",
    buttonText: "#6b0000",
  },
  {
    value: "neon-green",
    label: "Neon Green",
    bg: "#00ff88",
    text: "#000000",
    button: "#00cc66",
    buttonText: "#000000",
  },
  {
    value: "royal-purple",
    label: "Royal Purple",
    bg: "#7b2ff7",
    text: "#ffffff",
    button: "#9d4edd",
    buttonText: "#ffffff",
  },
  {
    value: "sunny-yellow",
    label: "Sunny Yellow",
    bg: "#ffdd57",
    text: "#000000",
    button: "#ffd93d",
    buttonText: "#000000",
  },
  {
    value: "deep-gray",
    label: "Deep Gray",
    bg: "#2f2f2f",
    text: "#ffffff",
    button: "#4d4d4d",
    buttonText: "#ffffff",
  },
];

export const themesObject = convertThemesArrayToObject(themesArray);
console.log(themesObject);
