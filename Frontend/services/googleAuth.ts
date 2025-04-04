import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../Firebase.config";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

// Initialize WebBrowser for Google Auth
WebBrowser.maybeCompleteAuthSession();

const extractStudentId = (displayName: string | null): string => {
  if (!displayName) return "";
  const matches = displayName.match(/\d+/);
  return matches ? matches[0] : "";
};

export const useGoogleSignIn = () => {
  // Log the Expo project details for debugging
  console.log("Expo Project:", {
    slug: Constants.expoConfig?.slug,
    owner: Constants.expoConfig?.owner,
  });

  // Use Expo's authentication proxy which handles the redirect properly
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "358950265394-18re9ok14ktp43mnona7n1n16lf9enb5.apps.googleusercontent.com", // Web client ID
    androidClientId: "358950265394-18re9ok14ktp43mnona7n1n16lf9enb5.apps.googleusercontent.com",
    iosClientId: "358950265394-1easva6qlh7b24fha6tg28qntesdshs5.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    useProxy: true,
    redirectUri: undefined, // Let Expo handle this automatically
  });

  console.log("Google Sign In Request:", request); // Debug log
  console.log("Redirect URI:", request?.redirectUri); // Log the actual redirect URI being used

  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google Sign In...");
      const result = await promptAsync();
      console.log("Google Sign In Result:", result);

      if (result.type === "success") {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);

        const { user } = userCredential;
        const { email, displayName, photoURL } = user;

        if (!email?.endsWith("@northsouth.edu")) {
          throw new Error("Please use your NSU email (@northsouth.edu)");
        }

        const studentId = extractStudentId(displayName);
        if (!studentId) {
          throw new Error("Could not find student ID in your name");
        }

        const userData = {
          id: Date.now(),
          email,
          first_name: displayName?.split(" ")[0] || "",
          last_name: displayName?.split(" ").slice(1).join(" ") || "",
          student_id: studentId,
          profile_photo: photoURL || "",
          phone_number: "",
          gender: "",
          rating: 5,
          total_rides: 0,
        };

        await AsyncStorage.setItem("user_data", JSON.stringify(userData));
        await AsyncStorage.setItem("access_token", `google_${Date.now()}`);
        await AsyncStorage.setItem("refresh_token", `google_refresh_${Date.now()}`);

        return userData;
      }

      throw new Error("Google sign in was cancelled or failed");
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      throw new Error(error.message || "Google sign in failed");
    }
  };

  return {
    handleGoogleSignIn,
    isLoading: !request, // Only show loading if request is not ready
  };
};
