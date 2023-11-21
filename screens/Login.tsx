import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logoRva from "./../assets/logoRva.png";
import parkingBg from "./../assets/parkingBg.png";
import { API_URL } from "../global/Helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, onRegister, authState } = useAuth();
  const [isConnecting,setIsConnecting]=useState(false);

  const login = async () => {
    setIsConnecting(true);
    const result = await onLogin(email, password);

    if (result && result["error"]) {
      setIsConnecting(false);
      setIsConnecting(false);
      Alert.alert("Login", "Echec de connexion vers "+API_URL);
     
      
    }else
    {
      setIsConnecting(false);
    }
  };
  const register = async () => {
    const result = await onRegister!(email, password);
    console.log(result);
    if (result && result.error) {
      Alert.alert("" + result["msg"]);
    } else {
      login();
    }
  };
  return (
    <SafeAreaView style={{marginTop:40}}>
        <ImageBackground
        source={parkingBg}
        resizeMode="cover"
        style={{
            height: "100%",
            width: "100%",
            opacity: 0.9,
            backgroundColor: "white",
        }}
        >
        <View style={styles.container}>
            <View
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            >
            <Image source={logoRva} style={{ height: 80, width: 80 }} />
            <Text style={{ fontSize: 20, fontWeight: "100" }}>
                REGIE DES VOIES AERIENNES
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "700" }}>
                PARKING MODULAIRE
            </Text>
            </View>
            <View>
            <TextInput
                style={styles.input}
                placeholder="Login"
                onChangeText={(text: string) => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                onChangeText={(text: string) => setPassword(text)}
                value={password}
                secureTextEntry={true}
            />
            {
              isConnecting?
                <ActivityIndicator />:
                <TouchableOpacity style={styles.btn} onPress={login}>
                  <Text style={{ textAlign: "center" }}>
                  Connexion
                  </Text>
                </TouchableOpacity>
            }
            
            </View>
            <View>
                <Text>© 2023-RVA</Text>
            </View>
        </View>
        </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderColor: "#FFFFFF",
    width: 280,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 6,
    height: 45,
  },
  btn: {
    width: 280,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 25,
    borderColor: "white",
    fontWeight: "bold",
  },
});
