import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import Dashboard from '../screens/Dashboard';
import Exercises from '../screens/Exercises';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import Statistics from '../screens/Statistics';
import UploadDocument from '../screens/UploadDocument';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = size;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Statistics') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'UploadDocument') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            iconSize = 30; // Slightly larger size for center button
          } else if (route.name === 'Exercises') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'layers' : 'layers-outline';
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard}
      />
      <Tab.Screen 
        name="Statistics" 
        component={Statistics}
      />
      <Tab.Screen 
        name="UploadDocument" 
        component={UploadDocument}
      />
      <Tab.Screen 
        name="Exercises" 
        component={Exercises}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
}

