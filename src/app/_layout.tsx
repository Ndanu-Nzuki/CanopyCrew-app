import '@/global.css';

import Constants from 'expo-constants';
import {
  SourceSerif4_400Regular_Italic,
  SourceSerif4_600SemiBold,
  SourceSerif4_700Bold,
  useFonts,
} from '@expo-google-fonts/source-serif-4';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Newly } from '@newly/sdk-react-native';

import { ThemeSwitchHost } from '@/components/theme-switch-host';
import { AuthProvider } from '@/contexts/AuthContext';
import { WorkspaceSync } from '@/features/canopy/components/workspace-sync';
import { hideExpoDeveloperUi } from '@/lib/dev-menu';
import generatedAnalytics from '@/lib/newly-analytics.json';
import { Uniwind } from 'uniwind';

// Canopy Crew is designed as a light field-guide palette only.
Uniwind.setTheme('light');

type NewlyAnalyticsExtra = {
  newlyAnalyticsEnabled?: unknown;
  newlyAnalyticsSamplingRate?: unknown;
  newlyApiUrl?: unknown;
  newlyIngestKey?: unknown;
};

// Newly writes this project's own analytics settings into src/lib/newly-analytics.json,
// which ships empty. They are deliberately NOT in app.json `expo.extra`: everything under
// `extra` is a native input, so a per-project value there gives the project its own
// fingerprint and costs it a full native build instead of the shared pre-built shell.
// Projects scaffolded before the move still carry the four keys in `extra`, so that stays
// the fallback.
const generated = generatedAnalytics as {
  ingestKey?: string;
  apiUrl?: string;
  enabled?: boolean;
  samplingRate?: number | null;
};
const analyticsExtra = (Constants.expoConfig?.extra ?? {}) as NewlyAnalyticsExtra;
const analytics = generated.ingestKey
  ? {
      ingestKey: generated.ingestKey,
      apiUrl: generated.apiUrl,
      enabled: generated.enabled,
      sampling: generated.samplingRate,
    }
  : {
      ingestKey: analyticsExtra.newlyIngestKey,
      apiUrl: analyticsExtra.newlyApiUrl,
      enabled: analyticsExtra.newlyAnalyticsEnabled,
      sampling: analyticsExtra.newlyAnalyticsSamplingRate,
    };

const newlyIngestKey = typeof analytics.ingestKey === 'string' ? analytics.ingestKey : '';
const newlyApiUrl = typeof analytics.apiUrl === 'string' ? analytics.apiUrl : '';
const newlyAnalyticsSampling = typeof analytics.sampling === 'number' ? analytics.sampling : undefined;

// Expo's floating gear and developer menu belong to whoever is debugging Expo, not to
// the person looking at their own app. See src/lib/dev-menu.ts for why this is JS and
// not an app.json plugin option.
hideExpoDeveloperUi();

if (analytics.enabled !== false && newlyIngestKey && newlyApiUrl) {
  Newly.init({
    ingestKey: newlyIngestKey,
    apiUrl: newlyApiUrl,
    sampling: newlyAnalyticsSampling,
  });
}

// Color scheme is driven by app.json `userInterfaceStyle` (automatic / light / dark) —
// set by the design system at lock time. Uniwind follows the system color scheme by
// default (adaptive themes), so the HeroUI/Uniwind design tokens switch light/dark on
// their own; we only mirror it into React Navigation's theme here.
//
// KeyboardProvider (react-native-keyboard-controller) is mounted once at the root so any
// screen can use KeyboardAwareScrollView / keyboard hooks for proper form handling — this
// is the keyboard library the design system mandates over RN's KeyboardAvoidingView. It is
// pre-baked into the scaffold (along with MMKV for persistence and Skia for charts) so the
// native module set is fixed up front and screen work hot-reloads without a native rebuild.
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SourceSerif4_400Regular_Italic,
    SourceSerif4_600SemiBold,
    SourceSerif4_700Bold,
  });
  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <HeroUINativeProvider>
          <ThemeProvider value={DefaultTheme}>
            <ThemeSwitchHost>
              <AuthProvider>
                <WorkspaceSync />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="sign-in" options={{ presentation: 'modal' }} />
                </Stack>
              </AuthProvider>
            </ThemeSwitchHost>
          </ThemeProvider>
        </HeroUINativeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
