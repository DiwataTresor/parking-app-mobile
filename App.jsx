import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Login from './screens/Login';

const Stack=createNativeStackNavigator();
const App = () => {
  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  )
}

export default App

export const Layout=() =>{
  const {authState,onLogout}=useAuth();
  return (<NavigationContainer>
      <Stack.Navigator>
        {
          authState?.authenticated?(
            <Stack.Screen 
              name='Home' 
              component={Home} 
              options={{title:"",headerRight:()=><Button title='Quitter' 
              onPress={onLogout} />}} />
          ):(
            <Stack.Screen name='Login' component={Login} options={{headerShown:false}} />
          )
        }
      </Stack.Navigator>
  </NavigationContainer>)
}