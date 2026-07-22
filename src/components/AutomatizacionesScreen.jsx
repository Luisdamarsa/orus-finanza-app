import ScreenShell from "./ScreenShell";
import AutomatizacionesPage from "./AutomatizacionesPage";

export default function AutomatizacionesScreen({
  isDark,
  t,
  setScreen,
  onPermissions,
  microphoneEnabled,
  setMicrophoneEnabled,
  notificationListenerEnabled,
  setNotificationListenerEnabled,
  iosShortcutsEnabled,
  setIosShortcutsEnabled,
  onOpenAccessibilitySettings,
}) {
  return (
    <ScreenShell bg={t.bg}>
      <AutomatizacionesPage
        isDark={isDark}
        onBack={() => setScreen("settings")}
        onPermissions={onPermissions}
        microphoneEnabled={microphoneEnabled}
        setMicrophoneEnabled={setMicrophoneEnabled}
        notificationListenerEnabled={notificationListenerEnabled}
        setNotificationListenerEnabled={setNotificationListenerEnabled}
        iosShortcutsEnabled={iosShortcutsEnabled}
        setIosShortcutsEnabled={setIosShortcutsEnabled}
        onOpenAccessibilitySettings={onOpenAccessibilitySettings}
      />
    </ScreenShell>
  );
}
