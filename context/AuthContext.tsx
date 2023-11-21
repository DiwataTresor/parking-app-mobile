import axios from "axios";
import React, { createContext,useContext,useEffect,useState } from "react";
import * as SecureStore from "expo-secure-store"
import { Alert } from "react-native";
import { API_URL } from "../global/Helper";

interface AuthPropos{
    authState?:{token:string|null; authenticated:boolean|null};
    onRegister?:(email:string, password:string) => Promise<any>;
    onLogin?:(email:string, password:string) => Promise<any>;
    onLogout?:() => Promise<any>;
    id?:number;
}

const TOKEN_KEY="my-jwt";
// export const API_URL="http://192.168.0.102/root/api/authentificationjwt/api.php";
const AuthContext=createContext<AuthPropos>({});

export const useAuth=() => {
    return useContext(AuthContext);
}

export const AuthProvider=({children}:any) => {
    
    const [authState,setAuthState]=useState<{
        token:string |null,
        authenticated:boolean | null;
        id:0
    }>({
        token:null,
        authenticated:null,
        id:0
    });
    useEffect(()=>{
        const loadToken =async()=>{
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log("stored",token);
            
            if(token){
                axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
                setAuthState({
                    token:token,
                    authenticated:true
                })
            }
        }
        loadToken();
    },[]);
    const register=async (email:string,password:string) => {
        try {
            const fd=new FormData();
            fd.append("qry","addUser");
            fd.append("email",email);
            fd.append("password",password);
            const result =await fetch(`${API_URL}`,{method:"POST",body:fd}).then(response=>response.json());
            setAuthState({
                token:result?.data?.Id?.toString(),
                authenticated:result.success
            })
        } catch (error) {
            return {error: true,msg:(error as any).response.data.msg}
        }
    }
    const login=async (email:string,password:string) => {
        try {
            // return await axios.post(`${API_URL}`,{email,password})
           
            const fd=new FormData();
            fd.append("qry","login");
            fd.append("login",email);
            fd.append("password",password);
            const result =await fetch(API_URL,{method:"POST",body:fd})
            .then(response=>response.json());
            setAuthState({
                token:result?.data?.Id?.toString(),
                authenticated:result.success,
                id:result?.data?.Id
            })
            // axios.defaults.headers.common['Authorization'] =`Bearer ${result.data.id}`;
            await SecureStore.setItemAsync(TOKEN_KEY,result?.data?.Id?.toString() || "");
           
            
            return result;
        } catch (error) {
            return {error: true,msg:"erreur : " + (error as any)?.message}
        }
    }
    const logout=async () => {
        Alert.alert("Deconnexion en cours");
        SecureStore.deleteItemAsync(TOKEN_KEY);
        // axios.defaults.headers.common['Authorization']='';
        setAuthState({
            token:null,
            authenticated:false,
            id:0
        })
    }
    const value={
        onRegister:register,
        onLogin:login,
        onLogout:logout,
        authState

    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}