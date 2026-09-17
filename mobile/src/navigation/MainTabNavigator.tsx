import React from 'react';
import { TouchableOpacity, Text, View, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { logout } from '../store/authSlice';

import HomeScreen from '../screens/HomeScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyApplicationsScreen from '../screens/MyApplicationsScreen';
import CandidateMenuScreen from '../screens/CandidateMenuScreen';
import CandidateFeatureScreen from '../screens/CandidateFeatureScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
    </Stack.Navigator>
  );
}

function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuRoot" component={CandidateMenuScreen} />
      <Stack.Screen 
        name="CandidateFeature" 
        component={CandidateFeatureScreen} 
        options={({ route }: any) => ({ headerShown: true, title: route.params?.title || 'Feature', headerBackTitleVisible: false })} 
      />
    </Stack.Navigator>
  );
}

export default function MainTabNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => dispatch(logout());
  const { user } = useSelector((state: RootState) => state.auth);

  // Check if candidate profile is complete
  const isProfileComplete = Boolean(
    user?.profileCompleted ||
    user?.qualifications?.graduation?.courseName ||
    user?.qualifications?.graduation?.completed
  );

  return (
    <Tab.Navigator
      initialRouteName={isProfileComplete ? "Jobs" : "Profile"}
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#034b71',
        tabBarInactiveTintColor: '#64748b',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { color: '#0f172a', fontWeight: 'bold' },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
             <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ color, size }) => {
          let iconName = 'briefcase';
          if (route.name === 'Jobs') iconName = 'search';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'MyApps') iconName = 'document-text';
          else if (route.name === 'Menu') iconName = 'menu';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Jobs" 
        component={HomeStack} 
        options={{ title: 'Jobs' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isProfileComplete) {
              e.preventDefault();
              Alert.alert(
                'Complete Profile First',
                'Job search aur apply karne ke liye pehle apna 5-step profile complete karein.',
                [{ text: 'Complete Profile', onPress: () => navigation.navigate('Profile') }]
              );
            }
          },
        })}
      />
      <Tab.Screen 
        name="MyApps" 
        component={MyApplicationsScreen} 
        options={{ title: 'Applications' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isProfileComplete) {
              e.preventDefault();
              Alert.alert(
                'Complete Profile First',
                'Applications dekhne ke liye pehle apna 5-step profile complete karein.',
                [{ text: 'Complete Profile', onPress: () => navigation.navigate('Profile') }]
              );
            }
          },
        })}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Tab.Screen name="Menu" component={MenuStack} options={{ title: 'More' }} />
    </Tab.Navigator>
  );
}
