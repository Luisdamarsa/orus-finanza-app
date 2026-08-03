import ScreenShell from "./ScreenShell";
import ProfilePage from "./ProfilePage";

/**
 * ProfileScreen.jsx — pantalla de Perfil (RS-3). Extraída de App.jsx.
 */
export default function ProfileScreen({ isDark, t, setScreen }) {
  return (
    <ScreenShell bg={t.bg}>
      <ProfilePage
        onBack={() => setScreen("settings")}
        onSaveSuccess={() => setScreen("settings")}
        setScreen={setScreen}
      />
    </ScreenShell>
  );
}
