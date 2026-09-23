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

import JobFairScreen from '../screens/JobFairScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import ReferFriendScreen from '../screens/ReferFriendScreen';
import CompaniesRegisteredScreen from '../screens/CompaniesRegisteredScreen';
import WantToChangeJobScreen from '../screens/WantToChangeJobScreen';
import ShareJobScreen from '../screens/ShareJobScreen';
import ImpDownloadsScreen from '../screens/ImpDownloadsScreen';
import ResumeDownloadsScreen from '../screens/ResumeDownloadsScreen';
import ResumeViewScreen from '../screens/ResumeViewScreen';
import FastSelectionTestScreen from '../screens/FastSelectionTestScreen';

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
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { color: '#0f172a', fontWeight: 'bold' },
        headerTintColor: '#034b71',
      }}
    >
      <Stack.Screen 
        name="MenuRoot" 
        component={CandidateMenuScreen} 
        options={{ title: 'More Features' }} 
      />
      <Stack.Screen 
        name="FastSelection" 
        component={FastSelectionTestScreen} 
        options={{ title: 'Fast Selection Test' }} 
      />
      <Stack.Screen 
        name="JobFair" 
        component={JobFairScreen} 
        options={{ title: 'Job Fairs & Drives' }} 
      />
      <Stack.Screen 
        name="Feedback" 
        component={FeedbackScreen} 
        options={{ title: 'Feel it, Say it!' }} 
      />
      <Stack.Screen 
        name="ReferFriend" 
        component={ReferFriendScreen} 
        options={{ title: 'Refer a Friend' }} 
      />
      <Stack.Screen 
        name="CompaniesRegistered" 
        component={CompaniesRegisteredScreen} 
        options={{ title: 'Registered Recruiters' }} 
      />
      <Stack.Screen 
        name="WantToChangeJob" 
        component={WantToChangeJobScreen} 
        options={{ title: 'Want to Change a Job?' }} 
      />
      <Stack.Screen 
        name="ShareJob" 
        component={ShareJobScreen} 
        options={{ title: 'Share Job Opportunities' }} 
      />
      <Stack.Screen 
        name="ImpDownloads" 
        component={ImpDownloadsScreen} 
        options={{ title: 'Important Downloads' }} 
      />
      <Stack.Screen 
        name="ResumeDownloads" 
        component={ResumeDownloadsScreen} 
        options={{ title: 'Resume Templates' }} 
      />
      <Stack.Screen 
        name="ResumeView" 
        component={ResumeViewScreen} 
        options={{ title: 'My CA Resume' }} 
      />
      <Stack.Screen 
        name="CandidateFeature" 
        component={CandidateFeatureScreen} 
        options={({ route }: any) => ({ title: route.params?.title || 'Feature' })} 
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
      <Tab.Screen 
        name="Menu" 
        component={MenuStack} 
        options={{ title: 'More', headerShown: false }} 
      />
    </Tab.Navigator>
  );
}
