import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerNavigationProp,
  useDrawerStatus,
} from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RootDrawerParamList, RootTabParamList } from "../Types/navigation";
import AddLog from "./AddLog";

// --- Placeholder Screens ---
function TodaysTasks() {
  return (
    <View style={styles.screen}>
      <Text>Today's Tasks</Text>
    </View>
  );
}
function DailyTasks() {
  return (
    <View style={styles.screen}>
      <Text>Daily Tasks</Text>
    </View>
  );
}
function HistoryScreen() {
  return (
    <View style={styles.screen}>
      <Text>📜 History</Text>
    </View>
  );
}
function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text>👤 Profile</Text>
    </View>
  );
}
function AllLogsScreen() {
  return (
    <View style={styles.screen}>
      <Text>📑 All Logs</Text>
    </View>
  );
}
function PendingLogsScreen() {
  return (
    <View style={styles.screen}>
      <Text>⏳ Pending Logs</Text>
    </View>
  );
}
function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text>⚙️ Settings</Text>
    </View>
  );
}

// --- Helpers ---
const getFormattedDate = () => {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
};

// --- Tab & Drawer ---
const Tab = createBottomTabNavigator<RootTabParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

// --- Tabs inside Home ---
type HomeTabsProps = {
  drawerNav: DrawerNavigationProp<RootDrawerParamList>;
};

function HomeTabs({ drawerNav }: HomeTabsProps) {
  const drawerStatus = useDrawerStatus();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={route.name === "Today's Tasks" ? "checkmark-circle-outline" : "calendar-outline"}
              size={size}
              color={color}
            />
          ),
          headerShown: false,
        })}
      >
        <Tab.Screen name="Today's Tasks" component={TodaysTasks} />
        <Tab.Screen name="Daily Tasks" component={DailyTasks} />
      </Tab.Navigator>

      {/* Floating + Button */}
      {drawerStatus !== "open" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => drawerNav.navigate("AddLog")}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// --- Custom Drawer with date ---
function CustomDrawer(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList
        {...props}
        state={{
          ...props.state,
          routeNames: props.state.routeNames.map((name: string) =>
            name === "Home" ? `${name} (${getFormattedDate()})` : name
          ),
        }}
      />
    </DrawerContentScrollView>
  );
}

// --- Main Home Component ---
export default function Home() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      {/* Pass drawerNav explicitly to Tabs */}
      <Drawer.Screen name="Home">
        {(props: { navigation: DrawerNavigationProp<RootDrawerParamList> }) => (
          <HomeTabs drawerNav={props.navigation} />
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="AllLogs"
        component={AllLogsScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="PendingLogs"
        component={PendingLogsScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="reader-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }}
      />
      {/* Hidden AddLog screen */}
      <Drawer.Screen
        name="AddLog"
        component={AddLog}
        options={{ drawerItemStyle: { display: "none" }, title: "Add Log" }}
      />
    </Drawer.Navigator>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  fab: {
    position: "absolute",
    right: 30,
    bottom: 90,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: { color: "white", fontSize: 30, fontWeight: "bold" },
});
