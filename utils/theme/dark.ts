import { DefaultTheme } from "@react-navigation/native";

export const dark = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "rgb(1, 1, 1)",
    primary: "rgb(10, 126, 164)",
    card: "rgb(18, 18, 18)",
    text: "rgb(229, 229, 231)",
    border: "rgb(39, 39, 41)",
    notification: "rgb(255, 69, 58)",
  },
};
