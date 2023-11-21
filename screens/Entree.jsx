import { StyleSheet, Text, View,TextInput,TouchableOpacity, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useStateContext } from '../../context/ContextProvider';
// import * as Print from "expo-print";
import { pathPrint,api } from '../../utils/global';



const Entree = () => {
  const {idUser}=useStateContext();
  const [vehicule,setVehicule]=useState("");
  const [feedBack,setFeedBack]=useState({
    loading:false,
    content:""
  });
  useEffect(()=>{
    
  },[]);
  //$resultat = ["success" => true, "numFact" => $ticket, "dtAcc" => $_dtA, "heureAcc" => $heure];

  const addImmatriculation=()=>{
    Alert.alert("Enregistrement","Voulez-vous vraiment enregistrer ce vehicule ?",
    [
      {
        text: 'Enregistrer',
        onPress: () => {
          setFeedBack({...feedBack,loading:true});
          let dataToSend =new FormData();
          
          dataToSend.append("qry","addVehicule");
          dataToSend.append("immatriculation",vehicule);
          dataToSend.append("idUser",idUser);
          fetch(api,{method:"POST",body:dataToSend}).then(r=>r.json()).then(r=>{
            console.log(r);
            if(r.success) {
              setVehicule("");
              print(r.numFact,vehicule,89,56);
            }else {
                Alert.alert("Echec d'ajout dans l'application");
            }
            setFeedBack({...feedBack,loading:false});
          }).catch(err=>{
            Alert.alert("Une erreur s'est produite dans le systeme, veuillez reessayer plutard");
            setFeedBack({...feedBack,loading:false});
          });
        }
      },
      {
        text: 'Annuler'
      }
    ],
    
    );
  }

  const print = async (t,i,d,h) => {
    // Print.printAsync({
    //   base64:true,
    //   html:`
    //   <html>
    //     <head>
    //     </head>
    //     <body>
    //     <div style="text-align:center; font-size:65px; font-family:'Arial Narrow'">
    //     <iframe src="${pathPrint}/root/api/rva_parking2/version2/ticket.php?ticket=${t}" style="width:940px; height:1700px; border:0px;" />
       
    //     </div>  
    //     </body>
    //   </html>
    //   `,
     
    // });
   
    
    
    
    // Print.printAsync({
    //   base64:true,
    //   html:`
    //   <html>
    //     <head>
    //     </head>
    //     <body>
    //     <div style="text-align:center; font-size:65px; font-family:'Arial Narrow'">
    //       Régie des voies Aériennes<br />
    //       Aéroport International de Ndjili <br /> 
    //       FIH <br />    
    //       Ticket ID : ${t}<br />
    //       Plaque : ${i}<br />
    //       Date et Heure : <br /> ${d} ${h}<br />
       
    //     </div>  
    //     </body>
    //   </html>
    //   `,
     
    // });
  };


  return (
    <SafeAreaView>
      <View style={styles.Container}>
        <KeyboardAvoidingView>
        <View style={{display:"flex", flexDirection:"column", gap:10,justifyContent:"center",alignItems:"center"}}>
            <Text style={{fontSize:25, marginBottom:30, fontWeight:"bold", color:"#E59866"}}>Saisir l'immatriculation</Text>
            <TextInput value={vehicule.toUpperCase()} onChangeText={(e)=>setVehicule(e.toUpperCase())} style={styles.Input} placeholder='Immatriculation' />
            
            {
              feedBack.loading ?
              <ActivityIndicator size={50} color={"blue"} /> :
              <TouchableOpacity style={styles.Btn} onPress={()=>{
                  addImmatriculation()
              }}>
                <Feather name="check-circle" size={24} color="white" />
                  <Text style={{color:"white", textAlign:"center"}}>Enregistrer</Text>
              </TouchableOpacity>
            }
        </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default Entree

const styles = StyleSheet.create({
  Container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor:"rgba(255,255,255, 0.2)"
  },
  Input:{
    borderColor:"#E59866",
    borderWidth:1,
    width:310,
    height:45,
    marginBottom:10,
    backgroundColor:"white",
    borderRadius:25,
    paddingVertical:6,
    paddingHorizontal:6,
},
Btn:{
    width:310,
    borderWidth:1,
    paddingVertical:10,
    borderRadius:25,
    borderColor: "white",
    backgroundColor: "#E59866",
    height:56,
    padding:"auto",
    display: "flex",
    flexDirection:"row",
    alignItems: "center",
    justifyContent:"center",
    gap:5,
    color: "#3498DB",
}
})