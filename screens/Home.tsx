import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList
} from "react-native";
import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import logoRva from "./../assets/logoRva.png";
import { useAuth } from "../context/AuthContext";
import { Feather,Ionicons,EvilIcons,AntDesign,SimpleLineIcons,FontAwesome5 } from "@expo/vector-icons";
import { API_URL, pathPrint } from "../global/Helper";
import * as Print from "expo-print";


const url = "https://jsonplaceholder.typicode.com/todos/";

const Footer = ({ navigation }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "skyblue",
        height: 50,
        alignItems: "center",
        paddingHorizontal: 25,
        width: "100%",
      }}
    >
      <TouchableOpacity style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center"}} onPress={() => navigation.navigate("Accueil")}>
        <AntDesign name="home" size={18} color={"white"} />
        <Text style={{ color: "white", display:"flex", flexDirection:"column" }}>
          Accueil
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center"}} onPress={() => navigation.navigate("EntreeVehicule")}>
        <FontAwesome5 name="car-side" size={18} color={"white"} />
        <Text style={{ color: "white" }}>Entrée</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center"}} onPress={() => navigation.navigate("Parametre")}>
        <EvilIcons name="gear" size={21} color={"white"} />
        <Text style={{ color: "white" }}>Parametre</Text>
      </TouchableOpacity>
    </View>
  );
};

const Accueil = ({ navigation }) => {
  const [lignes, setLignes] = useState([]);
  useEffect(() => {
    //  Alert.alert(`${StatusBar.currentHeight}`)
    fetch(`${url}`)
      .then((r) => r.json())
      .then((r) => {
        console.log(r.length);
        setLignes(r);
      })
      .catch((r) => {
        console.log(r);
      });
  }, []);
  return (
    <SafeAreaView>
      <View
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#5DADE2",
            gap: 10,
          }}
        >
          <View>
            <Image
              source={logoRva}
              style={{ width: 100, height: 100, marginBottom: 30 }}
            />
            <Text
              style={{
                color: "#F8F9F9",
                fontSize: 20,
                fontWeight: "300",
              }}
            >
              Bienvenu
            </Text>
          </View>
          <View
            style={{
              borderRadius: 40,
              backgroundColor: "#E59866",
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                width: "auto",
                fontSize: 18,
                paddingHorizontal: 20,
                paddingVertical: 20,
                color: "white",
                fontWeight: "bold",
              }}
            >
              GESTION DU PARKING MODULAIRE
            </Text>
          </View>
          <View
            style={{
              paddingBottom: 20,
              borderTopWidth: 1,
              borderColor: "#F8F9F9",
              paddingTop: 10,
            }}
          >
            <Text
              style={{ color: "#F8F9F9", fontSize: 20, textAlign: "center" }}
            >
              FZAA-FIH
            </Text>
            <Text style={{ color: "#F8F9F9", fontSize: 20 }}>
              AEROPORT INTERNATIONAL DE NDJILI
            </Text>
          </View>
        </View>
        <View>
          <Footer navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};
const EntreeVehicule = ({ navigation }) => {
  const {
    authState: { id }
  } = useAuth();

  const [vehicule, setVehicule] = useState("");
  const [feedBack, setFeedBack] = useState({
    loading: false,
    content: "",
  });
  const addImmatriculation = () => {
    Alert.alert(
      "Enregistrement",
      "Voulez-vous vraiment enregistrer ce vehicule ?",
      [
        {
          text: "Enregistrer",
          onPress: () => {
            setFeedBack({ ...feedBack, loading: true });
            let dataToSend = new FormData();

            dataToSend.append("qry", "addVehicule");
            dataToSend.append("immatriculation", vehicule);
            dataToSend.append("idUser", id);
            fetch(API_URL, { method: "POST", body: dataToSend })
              .then((r) => r.json())
              .then((r) => {
                console.log(r);
                if (r.success) {
                  setVehicule("");
                  print(r.numFact, vehicule, 89, 56);
                } else {
                  Alert.alert("Echec d'ajout dans l'application");
                }
                setFeedBack({ ...feedBack, loading: false });
              })
              .catch((err) => {
                Alert.alert(
                  "Une erreur s'est produite dans le systeme, veuillez reessayer plutard"
                );
                setFeedBack({ ...feedBack, loading: false });
              });
          },
        },
        {
          text: "Annuler",
        },
      ]
    );
  };

  const print = async (t, i, d, h) => {
    Print.printAsync({
      base64:true,
      html:`
      <html>
        <head>
        </head>
        <body>
        <div style="text-align:center; font-size:65px; font-family:'Arial Narrow'">
        <iframe src="${pathPrint}/root/api/rva_parking2/version2/ticket.php?ticket=${t}" style="width:940px; height:1700px; border:0px;" />
        </div>
        </body>
      </html>
      `,
    });
    
  };
  return (
    <SafeAreaView>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",     
          height: "100%",
          backgroundColor: "rgba(255,255,255, 0.2)",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",

            backgroundColor: "rgba(255,255,255, 0.2)",
          }}
        >
          <KeyboardAvoidingView>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  marginBottom: 30,
                  fontWeight: "bold",
                  color: "#E59866",
                }}
              >
                Saisir l'immatriculation
              </Text>
              <TextInput
                value={vehicule.toUpperCase()}
                onChangeText={(e) => setVehicule(e.toUpperCase())}
                style={styles.Input}
                placeholder="Immatriculation"
              />

              {feedBack.loading ? (
                <ActivityIndicator size={50} color={"blue"} />
              ) : (
                <TouchableOpacity
                  style={styles.Btn}
                  onPress={() => {
                    addImmatriculation();
                  }}
                >
                  <Feather name="check-circle" size={24} color="white" />
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Enregistrer
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
        <View>
          <Footer navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const Parametre = ({ navigation }) => {
  return (
    <SafeAreaView>
      <View style={{display:"flex", flexDirection:"column", justifyContent:"space-between", height:"100%"}}>
        <View style={{flex:1, flexDirection:"column", gap:10, paddingLeft:20, paddingTop:30}}>
          <View style={styles.menu}>
            <TouchableOpacity onPress={()=>navigation.navigate("DerniersVehicules")} style={styles.btn}>
              <SimpleLineIcons name="list" size={24} color="#E59866" />
              <Text style={{color:"#E59866"}}>Derniers vehicules</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menu}>
            <TouchableOpacity onPress={()=>navigation.navigate("CheckAbonnement")} style={styles.btn}>
            <Ionicons name="ios-shield-checkmark-outline" size={24} color="#E59866" />
              <Text style={{color:"#E59866"}}>Verification véhicule abonné</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menu}>
            
            <TouchableOpacity onPress={()=>navigation.navigate("Profil")} style={styles.btn}>
              <AntDesign name="user" size={24} color="#E59866" />
              <Text style={{color:"#E59866"}}>Profil</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex:0}}>
          <Footer navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};
const DerniersVehicules=({navigation})=>{
  const [vehicules,setVehicules]=useState([]);
  
  const getData=()=>{
   
    let formData=new FormData();
    formData.append("qry","dernierVehicules");
    fetch(API_URL,{method:"POST",body:formData}).then(r=>r.json())
    .then(r=>{setVehicules(r) })
    .catch(
      err=>console.log(err)
    );
  }
  
  useEffect(()=>{
    try {
      getData();
    }catch(err)
    {
      console.log(err);
    }
  },[]);
  const renderItem=({item})=>{
    //console.log(item);
    return(
      <View style={{
        backgroundColor:"#CCC", 
        marginBottom:7, 
        borderRadius:5,
        paddingHorizontal:7, 
        paddingVertical:10, 
        width:350, 
        alignItems: "center"
      }}>
          <Text style={{"fontSize":20, "marginBottom":8}}>{item?.immatriculation}</Text>
          <Text style={{fontSize:14, marginBottom:8}}>Heure entrée :{item?.dt} {item?.heure}</Text>
          <TouchableOpacity onPress={()=>print(item?.id,item?.immatriculation)}>
            <Text style={{borderWidth:1,paddingHorizontal:9, paddingVertical:5, borderRadius:20}}>Reimprimer</Text>
          </TouchableOpacity>
      </View>
    )
  }
  const print = async (t,i) => {
    Print.printAsync({
      base64:true,
      html:`
      <html>
        <head>
        </head>
        <body>
        <div style="text-align:center; font-size:65px; font-family:'Arial Narrow'">
          <iframe src="${pathPrint}/root/api/rva_parking2/version2/ticket.php?ticket=${t}" style="width:940px; height:1700px; border:0px;" />
        </div>  
        </body>
      </html>
      `,
     
    });
  }
  return (
    <SafeAreaView>
      <View
        style={{ display: "flex", flexDirection: "column", height: "100%", paddingTop:20 }}
      >
        <View style={{ flex: 1, alignItems:"center" }}>
          <View
            style={{
              alignItems: "center",
              alignContent: "flex-end",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#E59866",
                borderRadius: 40,
                width: 140,
                alignContent: "center",
                alignItems: "center",
                marginTop: 0,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: "white" }} onPress={() => getData()} on>
                Recharger
              </Text>
            </TouchableOpacity>
          </View>
          {vehicules?.length > 0 ? (
            <FlatList data={vehicules} renderItem={renderItem} />
          ) : (
            <View>
              <Text>Aucune donnée trouvé</Text>
            </View>
          )}
        </View>
        <View>
          <Footer navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
}
const CheckAbonnement=({navigation})=>{
 
  const [vehicule, setVehicule] = useState("");
  const [feedBack, setFeedBack] = useState({
    loading: false,
    content: "",
  });
  const [isExist, setIsExist] = useState(false);
  const [reponse, setReponse] = useState("");
  useEffect(() => {}, []);


  const check = () => {
    setIsExist(false);
    setFeedBack({ ...feedBack, loading: true });

    fetch(`${API_URL}?qry=vehiculeAbonne&vehicule=${vehicule}`)
      .then((r) => r.json())
      .then((r) => {
        if (r.success) {
          console.log(r.data[0]);
          setIsExist(true);
          setReponse(r.data[0]);
        } else {
          Alert.alert("Abonnement", "Vehicule non Abonné");
        }
      })
      .catch((err) => {
        Alert.alert(
          "Verification",
          "Une erreur s'est produite dans le systeme"
        );
        console.log(err);
      })
      .finally(() => {
        setFeedBack({ ...feedBack, loading: false });
      });
  };
  return (
    <SafeAreaView>
      <View
        style={{ display: "flex", flexDirection: "column", height: "100%", paddingTop:20 }}
      >
        <KeyboardAvoidingView style={{flex:1}}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 25,
                marginBottom: 30,
                fontWeight: "bold",
                color: "#E59866",
              }}
            >
              Saisir l'immatriculation
            </Text>

            <View>
              <Text style={{ color: isExist?"green":"red",fontSize:15, fontWeight:"bold", textAlign: "center" }}>
                {isExist ? "C'est vehicule est abonné" : ""}
              </Text>
              <Text style={{ color: "green", fontSize:15, fontWeight:"bold", textAlign: "center" }}>
                {isExist && reponse["Nom"]}
              </Text>
            </View>

            <TextInput
              value={vehicule.toUpperCase()}
              onChangeText={(e) => setVehicule(e.toUpperCase())}
              style={styles.Input}
              placeholder="Immatriculation"
            />

            {feedBack.loading ? (
              <ActivityIndicator size={50} color={"blue"} />
            ) : (
              <TouchableOpacity
                style={styles.Btn}
                onPress={() => {
                  check();
                }}
              >
                <Feather name="check-circle" size={24} color="white" />
                <Text style={{ color: "white", textAlign: "center" }}>
                  Verifier
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
        <View>
          <Footer navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const Home = () => {
  const St = createNativeStackNavigator();
  return (
    <St.Navigator>
      <St.Screen
        name="Accueil"
        component={Accueil}
        options={{ headerShown: false }}
      />
      <St.Screen
        options={{ headerShown: false }}
        name="EntreeVehicule"
        component={EntreeVehicule}
      />
      <St.Screen
        options={{ headerShown: false }}
        name="Parametre"
        component={Parametre}
      />
      <St.Screen
        options={{ headerShown: false }}
        name="DerniersVehicules"
        component={DerniersVehicules}
      />
      <St.Screen
        options={{ headerShown: false }}
        name="CheckAbonnement"
        component={CheckAbonnement}
      />
    </St.Navigator>
  );
};

export default Home;

const styles = StyleSheet.create({
  Input: {
    borderColor: "#E59866",
    borderWidth: 1,
    width: 310,
    height: 45,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  Btn: {
    width: 310,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 25,
    borderColor: "white",
    backgroundColor: "#E59866",
    height: 56,
    padding: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    color: "#3498DB",
  },
  btn:{display:"flex", flexDirection:"row", gap:10},
  menu:{borderBottomWidth:0, paddingVertical:20,color:"#E59866", borderWidth:0, borderRadius:10, backgroundColor:"#FFF", paddingHorizontal:10, marginRight:10},

});
