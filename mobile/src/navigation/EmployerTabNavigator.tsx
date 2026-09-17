import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { logout } from '../store/authSlice';

import EmployerDashboardScreen from '../screens/EmployerDashboardScreen';
import EmployerJobsScreen from '../screens/EmployerJobsScreen';
import EmployerApplicationsScreen from '../screens/EmployerApplicationsScreen';
import EmployerCandidatesScreen from '../screens/EmployerCandidatesScreen';

const Tab = createBottomTabNavigator();

export default function EmployerTabNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => dispatch(logout());

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#034b71',
        tabBarInactiveTintColor: '#64748b',
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ color, size }) => {
          let iconName = 'bar-chart';
          if (route.name === 'EmployerDash') iconName = 'bar-chart';
          else if (route.name === 'EmployerJobs') iconName = 'briefcase';
          else if (route.name === 'EmployerApps') iconName = 'document-text';
          else if (route.name === 'EmployerCandidates') iconName = 'people';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="EmployerDash" 
        component={EmployerDashboardScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="EmployerJobs" 
        component={EmployerJobsScreen} 
        options={{ title: 'Manage Jobs' }} 
      />
      <Tab.Screen 
        name="EmployerApps" 
        component={EmployerApplicationsScreen} 
        options={{ title: 'Applications' }} 
      />
      <Tab.Screen 
        name="EmployerCandidates" 
        component={EmployerCandidatesScreen} 
        options={{ title: 'Candidates' }} 
      />
    </Tab.Navigator>
  );
}
