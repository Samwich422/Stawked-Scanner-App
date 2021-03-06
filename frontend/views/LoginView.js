import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { StatusBar } from "react-native";
import PushNotification from "react-native-push-notification";
import { TypingAnimation } from "react-native-typing-animation";
import { TouchableOpacity } from "react-native-gesture-handler";

export function LoginView({ route, navigation }) {
  const width = Dimensions.get("screen").width;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, signIn } = useAuth();
  const [typingEmail, setTypingEmail] = useState(false);
  const [typingPassword, setTypingPassword] = useState(false);
  const [failedSignin, setFailedSignin] = useState(false);
  const [failedSigninText, setFailedSigninText] = useState("");

  const animationLogin = new Animated.Value(width - 40);
  const nav = useNavigation();

  const loginAnimation = (active) => {
    if (active) {
      Animated.timing(animationLogin, {
        toValue: 80,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animationLogin, {
        toValue: width - 40,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  };

  const typing = () => {
    return <TypingAnimation dotColor="#e32f45" style={{ marginRight: 25 }} />;
  };

  useEffect(() => {
    // If there is a user logged in, go to the Projects page.
    if (user != null) {
      if (route.params) addNickname();
      nav.reset({ index: 0, routes: [{ name: "Home" }] });
    }
    createChannels(); //mess around with placement
  }, [user]);

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: "test-channel",
      channelName: "Test Channel",
    });
  };

  // The onPressSignIn method calls AuthProvider.signIn with the
  // email/password in state.
  const onPressSignIn = async () => {
    try {
      loginAnimation(true);
      await signIn(email, password);
    } catch (error) {
      loginAnimation(false);
      setTimeout(() => {
        setFailedSignin(true);
        if (email === "" && password === "") {
          setFailedSigninText("Please input an email and password");
        } else if (email === "") {
          setFailedSigninText("Please input an email");
        } else if (password === "") {
          setFailedSigninText("Please input a password");
        } else {
          setFailedSigninText("Wrong email or password");
        }
      }, 101);
    }
  };

  const addNickname = async () => {
    const { nick_name } = route.params;
    try {
      const temp = await user.functions.addNickname(user.id, nick_name); // Change nickname attribute
    } catch (err) {
      console.log(err);
    }
  };

  const animWidth = animationLogin;
  return (
    <View style={myStyles.container}>
      <StatusBar barStyle="light-content" />

      <View style={myStyles.header}>
        <Image source={require("../assets/img/Logo.png")}></Image>
      </View>

      <View style={myStyles.footer}>
        <Text style={[myStyles.title, {}]}>E-mail</Text>

        <View style={myStyles.action}>
          <TextInput
            placeholder="Your Email"
            style={myStyles.textInput}
            onFocus={() => {
              setFailedSignin(false);
              setTypingEmail(true);
              setTypingPassword(false);
            }}
            onBlur={() => {
              setTypingEmail(false);
            }}
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
          />
          {typingEmail ? typing() : null}
        </View>

        <Text style={[myStyles.title, { marginTop: 20 }]}>Password</Text>

        <View style={myStyles.action}>
          <TextInput
            placeholder="Your Password"
            style={myStyles.textInput}
            onFocus={() => {
              setFailedSignin(false);
              setTypingEmail(false);
              setTypingPassword(true);
            }}
            onBlur={() => {
              setTypingPassword(false);
            }}
            onChangeText={(text) => {
              setPassword(text);
            }}
            value={password}
            secureTextEntry
          />
          {typingPassword ? typing() : null}
        </View>
        {failedSignin ? (
          <Text style={myStyles.failedLoginText}>{failedSigninText}</Text>
        ) : null}

        <TouchableOpacity onPress={onPressSignIn} style={{ marginTop: 5 }}>
          <View style={myStyles.button_container}>
            <Animated.View style={[myStyles.animation, { width: animWidth }]}>
              <Text style={myStyles.textLogin}>Login </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>

        <View style={myStyles.signup}>
          <Text style={{ color: "black" }}>New User? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Sign-up")}>
            <Text style={{ color: "royalblue", fontWeight: "bold" }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flex: 1,
    padding: 20,
  },
  imageBG: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTopText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  headerBotText: {
    color: "yellow",
  },
  title: {
    color: "black",
    fontWeight: "bold",
  },
  action: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  textInput: {
    flex: 1,
    marginTop: 5,
    paddingBottom: 5,
    color: "gray",
  },
  button_container: {
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    backgroundColor: "royalblue",
    paddingVertical: 10,
    marginTop: 0,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  textLogin: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  failedLoginText: {
    color: "red",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  signup: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
});
