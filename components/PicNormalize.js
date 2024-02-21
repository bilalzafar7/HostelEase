import { Dimensions, Platform, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const referenceScreenWidth = 411; // Chrome phone size

export function pixelNormalize(size) {
  const newSize = (size / referenceScreenWidth) * SCREEN_WIDTH;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
