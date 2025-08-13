import { StyleSheet, Text, View } from "react-native";

function TitleLogin() {
  return (
    <View className="my-5">
      <Text style={style.textPos}>Welcome Back</Text>
      <Text style={style.textPosb} className="text-gray-500">Sign in to Dressify account</Text>
    </View>
  );
}

export default TitleLogin;

const style = StyleSheet.create({
    textPos: {
        textAlign: "center",
        fontSize: 37,
        fontWeight: "bold",
    },
    textPosb: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "normal",

    },
});