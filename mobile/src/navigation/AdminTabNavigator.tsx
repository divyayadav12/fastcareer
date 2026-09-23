import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminCandidatesScreen from '../screens/AdminCandidatesScreen';
import AdminJobsScreen from '../screens/AdminJobsScreen';
import AdminSettingsScreen from '../screens/AdminSettingsScreen';
import AdminApplicationsScreen from '../screens/AdminApplicationsScreen';
import AdminTestResultsScreen from '../screens/AdminTestResultsScreen';

const Tab = createBottomTabNavigator();

export default function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#034b71',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { color: '#0f172a', fontWeight: 'bold' },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'grid';
          if (route.name === 'Dashboard') iconName = 'grid';
          else if (route.name === 'Jobs') iconName = 'briefcase';
          else if (route.name === 'Apps') iconName = 'document-text';
          else if (route.name === 'TestResults') iconName = 'ribbon';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboardScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Candidates" 
        component={AdminCandidatesScreen} 
        options={({ navigation }) => ({
          title: 'Candidates',
          tabBarItemStyle: { display: 'none' },
          tabBarButton: () => null,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard')}
              style={{ marginLeft: 16, padding: 4 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
          ),
        })} 
      />
      <Tab.Screen name="Jobs" component={AdminJobsScreen} />
      <Tab.Screen 
        name="Apps" 
        component={AdminApplicationsScreen} 
        options={{ title: 'Applications' }} 
      />
      <Tab.Screen 
        name="TestResults" 
        component={AdminTestResultsScreen} 
        options={{ title: 'Test Results' }} 
      />
      <Tab.Screen name="Settings" component={AdminSettingsScreen} />
    </Tab.Navigator>
  );
}
// http://localhost:5000/api/auth/registe