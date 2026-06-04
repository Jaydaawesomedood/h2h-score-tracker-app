const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

function getAppName() {
  if (IS_DEV) return "Head2Head - Development";
  if (IS_PREVIEW) return "Head2Head - Preview";
  return "Head2Head";
}

function getPackageName() {
  if (IS_DEV) return "com.pyroappstudio.my.h2h.dev";
  if (IS_PREVIEW) return "com.pyroappstudio.my.h2h.preview";
  return "com.pyroappstudio.my.h2h";
}

export default {
  name: getAppName(),
  slug: "h2h",
  version: "1.0.0",
  platforms: [
    "ios",
    "android"
  ],
  orientation: "portrait",
  icon: "./assets/images/logo/h2h-logo-icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/logo/h2h-logo-splash.png",
    resizeMode: "contain",
    backgroundColor: "#3A3B40"
  },
  ios: {
    bundleIdentifier: getPackageName(),
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/logo/h2h-logo-android-adaptive.png",
      backgroundColor: "#3A3B40"
    },
    package: getPackageName(),
    softwareKeyboardLayoutMode: "pan"
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
        backgroundColor: "#3A3B40",
        image: "./assets/images/logo/h2h-logo-splash.png",
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
