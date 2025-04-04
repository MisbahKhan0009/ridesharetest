import { Stack } from 'expo-router';

export default function ReportLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="create-incident" 
        options={{ 
          title: 'Report Incident',
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          headerBackTitleVisible: false,
        }} 
      />
    </Stack>
  );
}