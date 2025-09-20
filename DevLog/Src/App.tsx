import 'react-native-gesture-handler';
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../Src/Screens/Home";
import { createTables } from "./utils/db";

export default function App() {

  useEffect(() => {
    createTables();
  }, []);
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Home />
    </NavigationContainer>
  );
}
