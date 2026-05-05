import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { startTransition, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { Brand } from "@/constants/brand";
import { getSubject, type SubjectDetail } from "@/lib/api";

export default function SubjectDetailScreen() {
  const router = useRouter();
  const { subjectSlug } = useLocalSearchParams<{ subjectSlug: string }>();
  const { width } = useWindowDimensions();
  const isWide = width >= 920;
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSubject() {
      if (!subjectSlug) {
        return;
      }

      try {
        const nextSubject = await getSubject(subjectSlug);
        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setSubject(nextSubject);
          setError(null);
          setIsLoading(false);
        });
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        const message = loadError instanceof Error ? loadError.message : "Failed to load subject.";

        startTransition(() => {
          setError(message);
          setIsLoading(false);
        });
      }
    }

    void loadSubject();

    return () => {
      isMounted = false;
    };
  }, [subjectSlug]);

  return (
    <>
      <Stack.Screen options={{ title: subject?.title ?? "Subject" }} />
      <View style={styles.screen}>
        <View pointerEvents="none" style={styles.orb} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.heroShell, isWide ? styles.heroShellWide : null]}>
            <View style={[styles.heroCard, isWide ? styles.heroCardWide : null]}>
              <Text style={styles.eyebrow}>Subject map</Text>
              <Text style={styles.heroTitle}>{subject?.title ?? "Loading subject..."}</Text>
              <Text style={styles.heroCopy}>
                {subject?.description ??
                  "This screen organizes the topic map for the selected subject."}
              </Text>

              {subject ? (
                <View style={styles.summaryRow}>
                  <View style={[styles.summaryCard, styles.summaryCardPrimary]}>
                    <Text style={styles.summaryLabel}>Topics</Text>
                    <Text style={styles.summaryValueLight}>{subject.topics.length}</Text>
                  </View>
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Sequence</Text>
                    <Text style={styles.summaryValueDark}>Core first</Text>
                  </View>
                </View>
              ) : null}
            </View>

            <View style={[styles.sidebarCard, isWide ? styles.sidebarCardWide : null]}>
              <Text style={styles.sidebarTitle}>Recommended path</Text>
              <Text style={styles.sidebarCopy}>
                Start at the top, practice in order, then repeat weak topics.
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Topics in this subject</Text>
            <Text style={styles.sectionCopy}>
              Open a topic and start a focused practice run.
            </Text>
          </View>

          {isLoading ? <Text style={styles.stateText}>Loading topics...</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {!isLoading && !error && subject?.topics.length === 0 ? (
            <Text style={styles.stateText}>No topics are available yet.</Text>
          ) : null}

          {!isLoading && !error ? (
            <View style={[styles.topicGrid, isWide ? styles.topicGridWide : null]}>
              {subject?.topics.map((topic, index) => (
                <Pressable
                  key={topic.id}
                  onPress={() =>
                    router.push({
                      pathname: "/topics/[topicSlug]",
                      params: { topicSlug: topic.slug },
                    })
                  }
                  style={[
                    styles.topicCard,
                    isWide ? styles.topicCardWide : null,
                    index % 2 === 0 ? styles.topicCardAccent : null,
                  ]}
                >
                  <Text style={styles.topicCardMeta}>
                    Step {topic.order_index + 1} | {topic.question_count} questions
                  </Text>
                  <Text style={styles.topicCardTitle}>{topic.title}</Text>
                  <Text style={styles.topicCardCopy}>{topic.description}</Text>
                  <View style={styles.topicCardFooter}>
                    <Text style={styles.topicCardAction}>Open practice</Text>
                    <Text style={styles.topicCardArrow}>+</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.colors.shell,
  },
  orb: {
    position: "absolute",
    top: -90,
    right: -70,
    height: 260,
    width: 260,
    borderRadius: 999,
    backgroundColor: "#d8fff5",
  },
  scrollContent: {
    gap: 18,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 72,
  },
  heroShell: {
    gap: 16,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
  },
  heroShellWide: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  heroCard: {
    gap: 12,
    borderRadius: 34,
    backgroundColor: Brand.colors.ink,
    padding: 24,
    ...Brand.shadow,
  },
  heroCardWide: {
    flex: 1.2,
  },
  eyebrow: {
    color: "#92ddff",
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
  heroCopy: {
    color: "#d5e4f3",
    fontSize: 15,
    lineHeight: 24,
  },
  summaryRow: {
    marginTop: 8,
    gap: 12,
  },
  summaryCard: {
    borderRadius: 24,
    backgroundColor: Brand.colors.surface,
    padding: 18,
  },
  summaryCardPrimary: {
    backgroundColor: Brand.colors.primary,
  },
  summaryLabel: {
    color: "rgba(8, 17, 31, 0.68)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  summaryValueLight: {
    marginTop: 10,
    color: Brand.colors.surface,
    fontSize: 30,
    fontWeight: "800",
  },
  summaryValueDark: {
    marginTop: 10,
    color: Brand.colors.ink,
    fontSize: 24,
    fontWeight: "800",
  },
  sidebarCard: {
    gap: 10,
    borderRadius: 32,
    backgroundColor: Brand.colors.surface,
    padding: 22,
    ...Brand.shadow,
  },
  sidebarCardWide: {
    flex: 0.82,
  },
  sidebarTitle: {
    color: Brand.colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },
  sidebarCopy: {
    color: Brand.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  sectionHeader: {
    gap: 6,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
  },
  sectionTitle: {
    color: Brand.colors.ink,
    fontSize: 28,
    lineHeight: 34,
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
  topicGrid: {
    gap: 14,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
  },
  topicGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  topicCard: {
    gap: 10,
    borderRadius: 28,
    backgroundColor: Brand.colors.surface,
    padding: 22,
    ...Brand.shadow,
  },
  topicCardWide: {
    width: "48.8%",
  },
  topicCardAccent: {
    backgroundColor: "#edf8ff",
  },
  topicCardMeta: {
    color: Brand.colors.primaryDeep,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  topicCardTitle: {
    color: Brand.colors.ink,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },
  topicCardCopy: {
    color: Brand.colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  topicCardFooter: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topicCardAction: {
    color: Brand.colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  topicCardArrow: {
    color: Brand.colors.primary,
    fontSize: 24,
    fontWeight: "700",
  },
});
