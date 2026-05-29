const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

export default {
  name: IS_DEV ? "Head2Head - Development" : IS_PREVIEW ? "Head2Head - Preview" : "Head2Head",
  slug: "h2h",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    bundleIdentifier: IS_DEV ? "com.jasonchoo.my.h2h.dev" : IS_PREVIEW ? "com.jasonchoo.my.h2h.preview" : "com.jasonchoo.my.h2h",
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#151718"
    },
    package: IS_DEV ? "com.jasonchoo.my.h2h.dev" : IS_PREVIEW ? "com.jasonchoo.my.h2h.preview" : "com.jasonchoo.my.h2h",
    softwareKeyboardLayoutMode: "pan"
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  androidStatusBar: {
    hidden: true,
    translucent: false,
  },
  plugins: [
    [
      "expo-build-properties",
      {
        "android": {
          "kotlinVersion": "2.1.21",
          "packagingOptions": {
            "pickFirst": [
              "**/libc++_shared.so"
            ]
          }
        }
      }
    ],
    "expo-router",
    "expo-font",
    "expo-sqlite",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ebebeb",
        image: "./assets/images/splash-icon.png",
        dark: {
          image: "./assets/images/splash-icon.png",
          backgroundColor: "#151718"
        },
        imageWidth: 200
      }
    ],
    [
      "expo-dev-client",
      {
        addGeneratedScheme: !!IS_DEV
      }
    ],
    "./plugins/withWatermelonMain"
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: "5391759a-edf1-48b2-87ee-2dc6abf5f2c7"
    }
  },
  "updates": {
    "url": "https://u.expo.dev/5391759a-edf1-48b2-87ee-2dc6abf5f2c7"
  },
  "runtimeVersion": {
    "policy": "appVersion"
  }
}
