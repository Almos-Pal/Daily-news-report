import { Pressable, StyleSheet, Text } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { RootStackParamList } from './src/navigation';
import { ArchiveScreen } from './src/screens/ArchiveScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { IssueScreen } from './src/screens/IssueScreen';
import { ItemScreen } from './src/screens/ItemScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.hairline,
    primary: colors.accent,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerTintColor: colors.accent,
            headerTitleStyle: { color: colors.text, fontWeight: '600' },
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'This week',
              headerRight: () => (
                <Pressable onPress={() => navigation.navigate('Archive')} hitSlop={8}>
                  <Text style={styles.headerAction}>Archive</Text>
                </Pressable>
              ),
            })}
          />
          <Stack.Screen name="Archive" component={ArchiveScreen} options={{ title: 'Archive' }} />
          <Stack.Screen name="Issue" component={IssueScreen} options={{ title: 'Issue' }} />
          <Stack.Screen name="Item" component={ItemScreen} options={{ title: '' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerAction: {
    color: colors.accent,
    fontSize: 17,
  },
});
