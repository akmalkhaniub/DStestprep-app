import { useRouter } from "expo-router";
import { startTransition, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { Brand } from "@/constants/brand";
import {
  getCurrentUser,
  getSubjects,
  type CurrentUserResponse,
  type SubjectSummary,
} from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

const promiseCards = [
  {
    label: "Structured topics",
    copy: "Core-first practice instead of random question banks.",
  },
  {
    label: "Feedback-first sessions",
    copy: "Answer, check, explain, move on.",
  },
  {
    label: "Professional prep cadence",
    copy: "Short drills now, exam simulation later.",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 920;
  const [isLoading, setIsLoading] = useState(true);
  const [backendUser, setBackendUser] = useState<CurrentUserResponse["user"] | null>(null);
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        const [me, nextSubjects] = await Promise.all([getCurrentUser(), getSubjects()]);
        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setBackendUser(me.user);
          setSubjects(nextSubjects);
          setError(null);
          setIsLoading(false);
        });
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        const message =
          loadError instanceof Error ? loadError.message : "Failed to load catalog data.";

        startTransition(() => {
          setError(message);
          setIsLoading(false);
        });
      }
    }

    void loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.screen}>
      <View pointerEvents="none" style={styles.heroOrb} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.shell, isWide ? styles.shellWide : null]}>
          <View style={[styles.heroCard, isWide ? styles.heroCardWide : null]}>
            <View style={styles.heroHeader}>
              <View style={styles.heroHeaderCopy}>
                <Text style={styles.eyebrow}>Learner Dashboard</Text>
                <Text style={styles.heroTitle}>Study with direction, not guesswork.</Text>
                <Text style={styles.heroText}>
                  Welcome back, {backendUser?.display_name ?? user?.email ?? "learner"}.
                  Pick a subject, open a topic, and start practicing.
                </Text>
              </View>

              <Pressable onPress={() => void signOut()} style={styles.signOutButton}>
                <Text style={styles.signOutButtonLabel}>Sign out</Text>
              </Pressable>
            </View>

            <View style={[styles.statRow, isWide ? styles.statRowWide : null]}>
              <View style={[styles.statCard, styles.statCardPrimary]}>
                <Text style={styles.statLabel}>Subjects ready</Text>
                <Text style={styles.statValue}>{subjects.length}</Text>
                <Text style={styles.statCopy}>Core catalog is ready to explore.</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Role</Text>
                <Text style={styles.statValueDark}>{backendUser?.role ?? "learner"}</Text>
                <Text style={styles.statCopyDark}>Signed in and connected to the API.</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Mode</Text>
                <Text style={styles.statValueDark}>Core build</Text>
                <Text style={styles.statCopyDark}>Browse, practice, and review topic by topic.</Text>
              </View>
            </View>
          </View>

          <View style={[styles.sideRail, isWide ? styles.sideRailWide : null]}>
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Build focus</Text>
              {promiseCards.map((card) => (
                <View key={card.label} style={styles.promiseCard}>
                  <Text style={styles.promiseTitle}>{card.label}</Text>
                  <Text style={styles.promiseCopy}>{card.copy}</Text>
                </View>
              ))}
            </View>

            <View style={styles.panelAccent}>
              <Text style={styles.panelAccentTitle}>Immediate next feature</Text>
              <Text style={styles.panelAccentHeadline}>Real quiz sessions</Text>
              <Text style={styles.panelAccentCopy}>
                Topic practice now runs one question at a time with feedback.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>Explore catalog</Text>
          <Text style={styles.sectionTitle}>Core subjects</Text>
          <Text style={styles.sectionCopy}>
            Choose a subject and jump straight into topic practice.
          </Text>
        </View>

        {isLoading ? <Text style={styles.stateText}>Loading subjects...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!isLoading && !error && subjects.length === 0 ? (
          <Text style={styles.stateText}>No subjects are available yet.</Text>
        ) : null}

        {!isLoading && !error ? (
          <View style={[styles.subjectGrid, isWide ? styles.subjectGridWide : null]}>
            {subjects.map((subject, index) => (
              <Pressable
                key={subject.id}
                onPress={() =>
                  router.push({
                    pathname: "/subjects/[subjectSlug]",
                    params: { subjectSlug: subject.slug },
                  })
                }
                style={[
                  styles.subjectCard,
                  isWide ? styles.subjectCardWide : null,
                  index % 3 === 0 ? styles.subjectCardAccent : null,
                ]}
              >
                <Text style={styles.subjectCardMeta}>
                  {String(index + 1).padStart(2, "0")} | {subject.topic_count} topics
                </Text>
                <Text style={styles.subjectCardTitle}>{subject.title}</Text>
                <Text style={styles.subjectCardCopy}>{subject.description}</Text>
                <View style={styles.subjectCardFooter}>
                  <Text style={styles.subjectCardAction}>Open subject map</Text>
                  <Text style={styles.subjectCardArrow}>+</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.colors.shell,
  },
  heroOrb: {
    position: "absolute",
    top: -120,
    right: -20,
    height: 280,
    width: 280,
    borderRadius: 999,
    backgroundColor: "#d8edff",
  },
  scrollContent: {
    gap: 22,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 128,
  },
  shell: {
    gap: 18,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
  },
  shellWide: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  heroCard: {
    gap: 22,
    overflow: "hidden",
    borderRadius: 34,
    backgroundColor: Brand.colors.ink,
    padding: 24,
    ...Brand.shadow,
  },
  heroCardWide: {
    flex: 1.35,
  },
  heroHeader: {
    gap: 20,
  },
  heroHeaderCopy: {
    gap: 10,
  },
  eyebrow: {
    color: "#9fd6ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: Brand.colors.surface,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
  },
  heroText: {
    color: "#d4e2f0",
    fontSize: 15,
    lineHeight: 24,
  },
  signOutButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  signOutButtonLabel: {
    color: Brand.colors.surface,
    fontSize: 13,
    fontWeight: "800",
  },
  statRow: {
    gap: 14,
  },
  statRowWide: {
    flexDirection: "row",
  },
  statCard: {
    flex: 1,
    borderRadius: 26,
    backgroundColor: Brand.colors.surface,
    padding: 18,
  },
  statCardPrimary: {
    backgroundColor: "#0c6dfd",
  },
  statLabel: {
    color: "rgba(8, 17, 31, 0.65)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  statValue: {
    marginTop: 10,
    color: Brand.colors.surface,
    fontSize: 34,
    fontWeight: "800",
  },
  statValueDark: {
    marginTop: 10,
    color: Brand.colors.ink,
    fontSize: 28,
    fontWeight: "800",
  },
  statCopy: {
    marginTop: 8,
    color: "#dbe8ff",
    fontSize: 14,
    lineHeight: 22,
  },
  statCopyDark: {
    marginTop: 8,
    color: Brand.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  sideRail: {
    gap: 18,
  },
  sideRailWide: {
    flex: 0.82,
  },
  panel: {
    gap: 14,
    borderRadius: 30,
    backgroundColor: Brand.colors.surface,
    padding: 22,
    ...Brand.shadow,
  },
  panelTitle: {
    color: Brand.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  promiseCard: {
    gap: 6,
    borderRadius: 22,
    backgroundColor: Brand.colors.surfaceStrong,
    padding: 16,
  },
  promiseTitle: {
    color: Brand.colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  promiseCopy: {
    color: Brand.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  panelAccent: {
    gap: 8,
    borderRadius: 30,
    backgroundColor: Brand.colors.goldSoft,
    padding: 22,
    ...Brand.shadow,
  },
  panelAccentTitle: {
    color: "#7a5209",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  panelAccentHeadline: {
    color: "#4e3304",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },
  panelAccentCopy: {
    color: "#7a5209",
    fontSize: 14,
    lineHeight: 22,
  },
  sectionHeader: {
    gap: 6,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
  },
  sectionEyebrow: {
    color: Brand.colors.primaryDeep,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: Brand.colors.ink,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
  },
  sectionCopy: {
    color: Brand.colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  stateText: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    color: Brand.colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  errorText: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    color: Brand.colors.danger,
    fontSize: 15,
    lineHeight: 24,
  },
  subjectGrid: {
    gap: 14,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
  },
  subjectGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subjectCard: {
    gap: 12,
    borderRadius: 30,
    backgroundColor: Brand.colors.surface,
    padding: 22,
    ...Brand.shadow,
  },
  subjectCardWide: {
    width: "31.9%",
  },
  subjectCardAccent: {
    backgroundColor: "#edf6ff",
  },
  subjectCardMeta: {
    color: Brand.colors.primaryDeep,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  subjectCardTitle: {
    color: Brand.colors.ink,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },
  subjectCardCopy: {
    color: Brand.colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  subjectCardFooter: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subjectCardAction: {
    color: Brand.colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  subjectCardArrow: {
    color: Brand.colors.primary,
    fontSize: 24,
    fontWeight: "700",
  },
});
