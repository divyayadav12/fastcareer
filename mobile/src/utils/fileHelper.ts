import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, Linking, Platform } from 'react-native';

export const getResumeUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('res.cloudinary.com')) return url.substring(url.indexOf('https://res.cloudinary.com'));
  if (url.includes('/uploads/')) return `http://192.168.29.97:5000/uploads/${url.split('/uploads/')[1]}`;
  if (url.startsWith('http')) return url;
  return `http://192.168.29.97:5000/${url}`;
};

export const viewResume = (url: string) => {
  if (!url) {
    Alert.alert("Error", "Resume not available");
    return;
  }
  const finalUrl = getResumeUrl(url);
  Linking.openURL(finalUrl).catch(() => {
    Alert.alert("Error", "Unable to open resume. Please try again.");
  });
};

export const downloadResume = async (url: string, candidateName: string, setLoading: (s: boolean) => void) => {
  if (!url) {
    Alert.alert("Error", "Resume not available");
    return;
  }
  
  const finalUrl = getResumeUrl(url);
  const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${cleanName}_Resume.pdf`;
  
  try {
    setLoading(true);
    const result = await FileSystem.downloadAsync(finalUrl, FileSystem.documentDirectory + fileName);
    
    if (result && result.uri) {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          Alert.alert("Success", "Resume downloaded successfully.", [
            { text: "OK" },
            { text: "Open/Share", onPress: () => Sharing.shareAsync(result.uri) }
          ]);
        } else {
          Alert.alert("Success", `Resume downloaded successfully to: ${result.uri}`);
        }
      }
    } else {
      Alert.alert("Error", "Resume download failed. Please try again.");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Resume download failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
