import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { Brand } from "@/constants/brand";

const cards = [
  {
    title: "Weak-area radar",
    copy: "Topic accuracy and revision urgency will surface here once quiz attempts are live.",
  },
  {
    title: "Revision queue",
    copy: "Learners will see what needs review today rather than deciding manually what to revisit.",
  },
  {
    title: "Momentum view",
    copy: "Short streaks, mastered topics, and confidence trends will drive the study rhythm.",
  },
];

export default function ProgressScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 920;

  return (
    <View style={styles.screen}>
      <View pointerEvents="none" style={styles.orb} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.heroCard, isWide ? styles.heroCardWide : null]}>
          <Text style={styles.eyebrow}>Progress Intelligence</Text>
          <Text style={styles.title}>Analytics will become your revision control center.</Text>
          <Text style={styles.copy}>
            This section is reserved for topic performance, scheduled review, and exam-readiness
            signals once the quiz session flow starts producing attempt data.
          </Text>
        </View>

        <View style={[styles.cardGrid, isWide ? styles.cardGridWide : null]}>
          {cards.map((card, index) => (
            <View
              key={card.title}
              style={[styles.infoCard, index === 1 ? styles.infoCardAccent : null]}
            >
              <Text style={styles.infoCardTitle}>{card.title}</Text>
              <Text style={styles.infoCardCopy}>{card.copy}</Text>
            </View>
          ))}
        </View>

        <View style={styles.roadmapCard}>
          <Text style={styles.roadmapTitle}>Next implementation sequence</Text>
          <Text style={styles.roadmapStep}>1. Launch answerable quiz sessions</Text>
          <Text style={styles.roadmapStep}>2. Save attempts and correctness outcomes</Text>
          <Text style={styles.roadmapStep}>3. Aggregate per-topic performance</Text>
          <Text style={styles.roadmapStep}>4. Generate revision recommendations</Text>
        </View>
      </ScrollView>
    </View>
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
    left: -70,
    height: 260,
    width: 260,
    borderRadius: 999,
    backgroundColor: "#d9fff5",
  },
  scrollContent: {
    gap: 18,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 128,
  },
  heroCard: {
    gap: 8,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    borderRadius: 32,
    backgroundColor: "#083b88",
    padding: 24,
    ...Brand.shadow,
  },
  heroCardWide: {
    padding: 30,
  },
  eyebrow: {
    color: "#9fd6ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    color: Brand.colors.surface,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
  },
  copy: {
    color: "#d7e6fb",
    fontSize: 15,
    lineHeight: 24,
  },
  cardGrid: {
    gap: 14,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
  },
  cardGridWide: {
    flexDirection: "row",
  },
  infoCard: {
    flex: 1,
    gap: 8,
    borderRadius: 28,
    backgroundColor: Brand.colors.surface,
    padding: 22,
    ...Brand.shadow,
  },
  infoCardAccent: {
    backgroundColor: "#edf6ff",
  },
  infoCardTitle: {
    color: Brand.colors.ink,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
  },
  infoCardCopy: {
    color: Brand.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  roadmapCard: {
    gap: 10,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    borderRadius: 30,
    backgroundColor: Brand.colors.goldSoft,
    padding: 22,
    ...Brand.shadow,
  },
  roadmapTitle: {
    color: "#5b3c05",
    fontSize: 22,
    fontWeight: "800",
  },
  roadmapStep: {
    color: "#7a5209",
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
  },
});
