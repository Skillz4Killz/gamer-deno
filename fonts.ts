export default {
  LatoHeavy: await Deno.readFile("./assets/fonts/lato_heavy.ttf"),
  LatoBold: await Deno.readFile("./assets/fonts/lato_bold.ttf"),
  SFTHeavy: await Deno.readFile("./assets/fonts/SF-Pro-Text-Heavy.otf"),
  SFTLight: await Deno.readFile("./assets/fonts/SF-Pro-Text-Light.otf"),
  SFTBold: await Deno.readFile("./assets/fonts/SF-Pro-Text-Bold.otf"),
  SFTRegular: await Deno.readFile("./assets/fonts/SF-Pro-Text-Regular.otf"),
  SFTMedium: await Deno.readFile("./assets/fonts/SF-Pro-Text-Medium.otf"),
};
