import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import KeyboardAwareLayout from '../components/KeyboardAwareLayout';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { Step1Personal } from '../components/candidate-profile/Step1Personal';
import { Step2CA } from '../components/candidate-profile/Step2CA';
import { Step3Articleship } from '../components/candidate-profile/Step3Articleship';
import { Step4EducationExperience } from '../components/candidate-profile/Step4EducationExperience';
import { Step5Review } from '../components/candidate-profile/Step5Review';
import api, { uploadFileApi } from '../services/api';
import { updateUser } from '../store/authSlice';

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const totalSteps = 5;
  const steps = ['Personal Details', 'CA Qualification', 'Articleship', 'Education & Experience', 'Review'];
  const scrollLayoutRef = useRef<any>(null);

  const goToStep = (newStep: number) => {
    setStep(newStep);
    // Instant scroll to top when changing steps
    scrollLayoutRef.current?.scrollToTop(false);
  };

  
  const [completion, setCompletion] = useState(0);
  useEffect(() => {
    let score = 20;
    if (user?.resumeUrl) score += 20;
    if (user?.personalDetails?.currentCity) score += 20;
    if (user?.qualifications?.graduation?.completed) score += 20;
    if (user?.experienceInfo?.isExperienced !== undefined) score += 20;
    setCompletion(score);
  }, [user]);

  const [resumeUrl, setResumeUrl] = useState('');
  const [caPortfolio, setCaPortfolio] = useState({});
  const [qualifications, setQualifications] = useState({});
  const [experienceInfo, setExperienceInfo] = useState({});
  const [personal, setPersonal] = useState({
    phone: '', dateOfBirth: '', gender: 'Male', maritalStatus: 'Unmarried',
    currentAddress: '', currentCity: '', currentState: '',
    permanentAddress: '', permanentCity: '', permanentState: '',
    permanentAddressSameAsCurrent: false
  });

  useEffect(() => {
    if (user) {
      const phoneNum = user.phone || user.personalDetails?.phone || '';
      if (user.resumeUrl) setResumeUrl(user.resumeUrl);
      if (user.personalDetails) {
        setPersonal(prev => ({
          ...prev,
          ...user.personalDetails,
          phone: phoneNum || user.personalDetails?.phone || prev.phone,
        }));
      } else if (phoneNum) {
        setPersonal(prev => ({ ...prev, phone: phoneNum }));
      }
      if (user.caPortfolio) setCaPortfolio(prev => ({ ...prev, ...user.caPortfolio }));
      if (user.qualifications) setQualifications(prev => ({ ...prev, ...user.qualifications }));
      if (user.experienceInfo) setExperienceInfo(prev => ({ ...prev, ...user.experienceInfo }));
    }
  }, [user]);

  // Fetch fresh profile on mount to guarantee all fields (phone, city, resume) are populated
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data) {
          dispatch(updateUser(res.data));
          const p = res.data;
          const phoneNum = p.phone || p.personalDetails?.phone || '';
          if (p.resumeUrl) setResumeUrl(p.resumeUrl);
          if (p.personalDetails) {
            setPersonal(prev => ({
              ...prev,
              ...p.personalDetails,
              phone: phoneNum || p.personalDetails?.phone || prev.phone,
            }));
          } else if (phoneNum) {
            setPersonal(prev => ({ ...prev, phone: phoneNum }));
          }
          if (p.caPortfolio) setCaPortfolio(prev => ({ ...prev, ...p.caPortfolio }));
          if (p.qualifications) setQualifications(prev => ({ ...prev, ...p.qualifications }));
          if (p.experienceInfo) setExperienceInfo(prev => ({ ...prev, ...p.experienceInfo }));
        }
      } catch (e) {
        console.log('Profile fetch error:', e);
      }
    };
    fetchLatest();
  }, [dispatch]);

  const handleFileUpload = async (file: any) => {
    setUploading(true);
    try {
      const uploadRes = await uploadFileApi(file, 'resume');
      if (uploadRes && (uploadRes.url || uploadRes.resumeUrl)) {
        const fileUrl = uploadRes.url || uploadRes.resumeUrl;
        setResumeUrl(fileUrl);
        Alert.alert('Success 🎉', 'Resume uploaded successfully!');
      } else {
        Alert.alert('Upload Error', 'Could not upload resume. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProgress = async () => {
    // Basic validation for Step 1
    if (step === 1 && !resumeUrl) {
      Alert.alert('Error', 'Resume is required to proceed.');
      return;
    }
    
    // Move to next step if not last step
    if (step < totalSteps) {
      goToStep(step + 1);
    } else {
      
      try {
        const payload = {
          phone: personal.phone,
          resumeUrl,
          personalDetails: personal,
          caPortfolio,
          qualifications,
          experienceInfo,
          profileCompleted: true,
        };
        const res = await api.put('/users/profile', payload);
        if (res.data) {
          dispatch(updateUser(res.data));
        }
        Alert.alert(
          'Profile Completed! 🎉',
          'Aapka profile successfully complete ho gaya hai! Ab aap jobs search aur apply kar sakte hain.',
          [
            { text: 'Search Jobs', onPress: () => navigation.navigate('Jobs') }
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to save profile.');
      }

    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepperContainer}>
        
<View style={{ marginBottom: 16 }}>
  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 }}>Profile Completion: {completion}%</Text>
  <View style={{ height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
    <View style={{ height: '100%', backgroundColor: completion === 100 ? '#10b981' : '#034b71', width: `${completion}%` }} />
  </View>
</View>
<Text style={styles.stepTitle}>Profile Setup Steps</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepperScroll}>
          {steps.map((stepName, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < step;
            const isCurrent = stepNumber === step;
            return (
              <TouchableOpacity key={index} style={styles.stepItem} onPress={() => isCompleted && goToStep(stepNumber)} disabled={!isCompleted && !isCurrent}>
                <View style={[styles.circle, isCompleted && styles.circleCompleted, isCurrent && styles.circleCurrent]}>
                  <Text style={[styles.circleText, isCompleted && styles.textCompleted, isCurrent && styles.textCurrent]}>
                    {isCompleted ? '✓' : stepNumber}
                  </Text>
                </View>
                <Text style={[styles.stepLabel, isCurrent && styles.labelCurrent]}>{stepName}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <KeyboardAwareLayout 
        ref={scrollLayoutRef}
        resetScrollTrigger={step}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.card}>
          <Text style={styles.heading}>{steps[step - 1]}</Text>
          <Text style={styles.subtext}>Please fill in the details below.</Text>
          
          {step === 1 && (
            <Step1Personal 
              personal={personal} 
              setPersonal={setPersonal} 
              user={user} 
              resumeUrl={resumeUrl} 
              handleFileUpload={handleFileUpload} 
              uploading={uploading} 
            />
          )}
          {step === 2 && (
            <Step2CA caPortfolio={caPortfolio} setCaPortfolio={setCaPortfolio} />
          )}
          {step === 3 && (
            <Step3Articleship caPortfolio={caPortfolio} setCaPortfolio={setCaPortfolio} />
          )}
          {step === 4 && (
            <Step4EducationExperience 
              qualifications={qualifications} setQualifications={setQualifications}
              experienceInfo={experienceInfo} setExperienceInfo={setExperienceInfo}
              personal={personal} setPersonal={setPersonal}
            />
          )}
          {step === 5 && (
            <Step5Review 
              personal={personal} caPortfolio={caPortfolio}
              qualifications={qualifications} experienceInfo={experienceInfo}
              setStep={goToStep} user={user}
            />
          )}
        </View>
      </KeyboardAwareLayout>

      <View style={styles.actionBar}>
        <TouchableOpacity style={[styles.navButton, step === 1 && styles.navButtonDisabled]} disabled={step === 1} onPress={() => goToStep(step - 1)}>
          <Text style={[styles.navButtonText, step === 1 && styles.navButtonTextDisabled]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveProgress}>
          <Text style={styles.primaryButtonText}>{step < totalSteps ? 'Save & Continue' : 'Confirm & Submit'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  stepperContainer: { backgroundColor: '#ffffff', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  stepTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  stepperScroll: { flexDirection: 'row', alignItems: 'center' },
  stepItem: { alignItems: 'center', marginRight: 24, width: 80 },
  circle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  circleCurrent: { borderColor: '#034b71', borderWidth: 2 },
  circleCompleted: { backgroundColor: '#034b71', borderColor: '#034b71' },
  circleText: { fontSize: 14, color: '#94a3b8', fontWeight: 'bold' },
  textCurrent: { color: '#034b71' },
  textCompleted: { color: '#ffffff' },
  stepLabel: { fontSize: 11, color: '#64748b', marginTop: 8, textAlign: 'center' },
  labelCurrent: { color: '#034b71', fontWeight: 'bold' },
  contentContainer: { padding: 12, paddingBottom: 100 },
  card: { backgroundColor: '#ffffff', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  heading: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  subtext: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0', elevation: 10 },
  navButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' },
  navButtonDisabled: { opacity: 0.5 },
  navButtonText: { fontSize: 14, fontWeight: 'bold', color: '#334155' },
  navButtonTextDisabled: { color: '#94a3b8' },
  primaryButton: { backgroundColor: '#034b71', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  primaryButtonText: { fontSize: 14, fontWeight: 'bold', color: '#ffffff' },
});
