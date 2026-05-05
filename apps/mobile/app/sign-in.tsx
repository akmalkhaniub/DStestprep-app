import { Redirect } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { Brand } from "@/constants/brand";
import { useAuth } from "@/providers/auth-provider";

type AuthMode = "sign-in" | "sign-up";
type FeedbackTone = "neutral" | "danger" | "success";

const insightCards = [
  {
    label: "Adaptive revision",
    value: "Daily",
    copy: "Refresh weak areas with short, focused topic loops.",
  },
  {
    label: "Exam confidence",
    value: "Structured",
    copy: "Build from fundamentals into quiz sessions and timed practice.",
  },
  {
    label: "Learning depth",
    value: "Explained",
    copy: "Every attempt is designed to end with feedback, hints, and clarity.",
  },
];

export default function SignInScreen() {
  const {
    isLoading,
    session,
    signInWithPassword,
    signUpWithPassword,
  } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 960;
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmEmailHelp, setShowConfirmEmailHelp] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: FeedbackTone;
    message: string;
  } | null>(null);

  if (!isLoading && session) {
    return <Redirect href="/" />;
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    setShowConfirmEmailHelp(false);

    const result =
      mode === "sign-in"
        ? await signInWithPassword({ email, password })
        : await signUpWithPassword({ email, password });

    if (!result.ok) {
      setFeedback({
        tone: "danger",
        message: result.message ?? "Authentication failed.",
      });
      setShowConfirmEmailHelp(Boolean(result.requiresEmailConfirmation));
      setIsSubmitting(false);
      return;
    }

    if (result.message) {
      setFeedback({
        tone: result.requiresEmailConfirmation ? "danger" : "success",
        message: result.message,
      });
    }

    if (result.requiresEmailConfirmation) {
      setShowConfirmEmailHelp(true);
      setMode("sign-in");
    }

    setIsSubmitting(false);
  };

  return (
    <View style={styles.screen}>
      <View pointerEvents="none" style={styles.topOrb} />
      <View pointerEvents="none" style={styles.bottomOrb} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardShell}
        >
          <View style={[styles.shell, isWide ? styles.shellWide : null]}>
            <View style={[styles.heroPanel, isWide ? styles.heroPanelWide : null]}>
              <Text style={styles.eyebrow}>Professional Learner Experience</Text>
              <Text style={styles.heroTitle}>
                Build real exam readiness for data science, AI, and CS.
              </Text>
              <Text style={styles.heroSubtitle}>
                Structured practice, guided explanations, and high-signal revision loops
                designed for serious undergraduate prep.
              </Text>

              <View style={styles.highlightPanel}>
                <Text style={styles.highlightLabel}>What the first release will deliver</Text>
                <Text style={styles.highlightValue}>Topic practice, quiz sessions, and progress visibility</Text>
              </View>

              <View style={[styles.metricGrid, isWide ? styles.metricGridWide : null]}>
                {insightCards.map((card) => (
                  <View key={card.label} style={styles.metricCard}>
                    <Text style={styles.metricLabel}>{card.label}</Text>
                    <Text style={styles.metricValue}>{card.value}</Text>
                    <Text style={styles.metricCopy}>{card.copy}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.formPanel, isWide ? styles.formPanelWide : null]}>
              <View style={styles.formHeader}>
                <Text style={styles.formEyebrow}>Secure access</Text>
                <Text style={styles.formTitle}>Sign in to your workspace</Text>
                <Text style={styles.formCopy}>
                  Use email and password to continue. For development, the expected flow is
                  immediate access after sign-up with email confirmation turned off in Supabase.
                </Text>
              </View>

              <View style={styles.modeRow}>
                <Pressable
                  onPress={() => setMode("sign-in")}
                  style={[
                    styles.modeButton,
                    mode === "sign-in" ? styles.modeButtonActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.modeButtonLabel,
                      mode === "sign-in" ? styles.modeButtonLabelActive : null,
                    ]}
                  >
                    Sign in
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setMode("sign-up")}
                  style={[
                    styles.modeButton,
                    mode === "sign-up" ? styles.modeButtonActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.modeButtonLabel,
                      mode === "sign-up" ? styles.modeButtonLabelActive : null,
                    ]}
                  >
                    Create account
                  </Text>
                </Pressable>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="name@university.edu"
                  placeholderTextColor={Brand.colors.muted}
                  style={styles.input}
                  value={email}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Password</Text>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor={Brand.colors.muted}
                  secureTextEntry
                  style={styles.input}
                  value={password}
                />
              </View>

              <Pressable
                disabled={isSubmitting || !email || !password}
                onPress={() => void handleSubmit()}
                style={[
                  styles.submitButton,
                  isSubmitting || !email || !password ? styles.submitButtonDisabled : null,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={Brand.colors.surface} />
                ) : (
                  <Text style={styles.submitButtonLabel}>
                    {mode === "sign-in" ? "Enter platform" : "Create learner account"}
                  </Text>
                )}
              </Pressable>

              {feedback ? (
                <View
                  style={[
                    styles.feedbackPanel,
                    feedback.tone === "danger" ? styles.feedbackDanger : null,
                    feedback.tone === "success" ? styles.feedbackSuccess : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.feedbackText,
                      feedback.tone === "danger" ? styles.feedbackTextDanger : null,
                      feedback.tone === "success" ? styles.feedbackTextSuccess : null,
                    ]}
                  >
                    {feedback.message}
                  </Text>
                </View>
              ) : null}

              {showConfirmEmailHelp ? (
                <View style={styles.helpPanel}>
                  <Text style={styles.helpTitle}>Development auth fix</Text>
                  <Text style={styles.helpCopy}>
                    This project still has Supabase email confirmation enabled. Turn off
                    Confirm email in Authentication {"->"} Settings, delete the unconfirmed
                    test user, then create the account again.
                  </Text>
                </View>
              ) : (
                <View style={styles.helpPanelNeutral}>
                  <Text style={styles.helpTitleNeutral}>Development mode note</Text>
                  <Text style={styles.helpCopyNeutral}>
                    The current build assumes direct sign-up and sign-in while we finish the
                    core learner loop. Email confirmation can be reintroduced later once SMTP
                    and production auth flows are ready.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.colors.shell,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardShell: {
    flex: 1,
  },
  shell: {
    flex: 1,
    gap: 20,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  shellWide: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  heroPanel: {
    overflow: "hidden",
    borderRadius: 34,
    backgroundColor: Brand.colors.ink,
    padding: 28,
    ...Brand.shadow,
  },
  heroPanelWide: {
    flex: 1.05,
    minHeight: 640,
  },
  formPanel: {
    borderRadius: 34,
    backgroundColor: Brand.colors.surface,
    padding: 24,
    ...Brand.shadow,
  },
  formPanelWide: {
    flex: 0.9,
    padding: 28,
  },
  topOrb: {
    position: "absolute",
    top: -90,
    right: -40,
    height: 260,
    width: 260,
    borderRadius: 999,
    backgroundColor: "#cfe7ff",
  },
  bottomOrb: {
    position: "absolute",
    bottom: -120,
    left: -60,
    height: 300,
    width: 300,
    borderRadius: 999,
    backgroundColor: "#d7fff2",
  },
  eyebrow: {
    color: "#8fd6ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  heroTitle: {
    marginTop: 14,
    color: Brand.colors.surface,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "800",
  },
  heroSubtitle: {
    marginTop: 14,
    color: "#c4d8ee",
    fontSize: 16,
    lineHeight: 25,
  },
  highlightPanel: {
    marginTop: 24,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 18,
  },
  highlightLabel: {
    color: "#8fd6ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  highlightValue: {
    marginTop: 8,
    color: Brand.colors.surface,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "700",
  },
  metricGrid: {
    marginTop: 18,
    gap: 14,
  },
  metricGridWide: {
    marginTop: "auto",
  },
  metricCard: {
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    padding: 18,
  },
  metricLabel: {
    color: "#8fd6ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  metricValue: {
    marginTop: 8,
    color: Brand.colors.surface,
    fontSize: 26,
    fontWeight: "800",
  },
  metricCopy: {
    marginTop: 6,
    color: "#d2e3f4",
    fontSize: 14,
    lineHeight: 22,
  },
  formHeader: {
    gap: 8,
  },
  formEyebrow: {
    color: Brand.colors.primaryDeep,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  formTitle: {
    color: Brand.colors.text,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },
  formCopy: {
    color: Brand.colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  modeRow: {
    marginTop: 22,
    flexDirection: "row",
    gap: 10,
    borderRadius: 999,
    backgroundColor: Brand.colors.shellAlt,
    padding: 6,
  },
  modeButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 14,
  },
  modeButtonActive: {
    backgroundColor: Brand.colors.surface,
    ...Brand.shadow,
  },
  modeButtonLabel: {
    color: Brand.colors.muted,
    fontSize: 15,
    fontWeight: "700",
  },
  modeButtonLabelActive: {
    color: Brand.colors.ink,
  },
  fieldGroup: {
    marginTop: 18,
    gap: 8,
  },
  fieldLabel: {
    color: Brand.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.colors.line,
    backgroundColor: Brand.colors.surfaceStrong,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: Brand.colors.text,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 22,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Brand.colors.primary,
    paddingVertical: 17,
  },
  submitButtonDisabled: {
    opacity: 0.55,
  },
  submitButtonLabel: {
    color: Brand.colors.surface,
    fontSize: 15,
    fontWeight: "800",
  },
  feedbackPanel: {
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: Brand.colors.shellAlt,
    padding: 16,
  },
  feedbackDanger: {
    backgroundColor: Brand.colors.dangerSoft,
  },
  feedbackSuccess: {
    backgroundColor: Brand.colors.accentSoft,
  },
  feedbackText: {
    color: Brand.colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  feedbackTextDanger: {
    color: Brand.colors.danger,
  },
  feedbackTextSuccess: {
    color: "#0d6b5f",
  },
  helpPanel: {
    marginTop: 18,
    borderRadius: 22,
    backgroundColor: Brand.colors.dangerSoft,
    padding: 18,
  },
  helpTitle: {
    color: Brand.colors.danger,
    fontSize: 14,
    fontWeight: "800",
  },
  helpCopy: {
    marginTop: 8,
    color: Brand.colors.danger,
    fontSize: 14,
    lineHeight: 22,
  },
  helpPanelNeutral: {
    marginTop: 18,
    borderRadius: 22,
    backgroundColor: Brand.colors.goldSoft,
    padding: 18,
  },
  helpTitleNeutral: {
    color: "#6d4c09",
    fontSize: 14,
    fontWeight: "800",
  },
  helpCopyNeutral: {
    marginTop: 8,
    color: "#6d4c09",
    fontSize: 14,
    lineHeight: 22,
  },
});
