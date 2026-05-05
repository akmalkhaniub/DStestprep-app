import { Stack, useLocalSearchParams } from "expo-router";
import { startTransition, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Brand } from "@/constants/brand";
import { getTopic, type QuestionSummary, type TopicDetail } from "@/lib/api";

type AnswerRecord = {
  selectedOptionIds: string[];
  isCorrect: boolean;
};

function formatQuestionType(questionType: string) {
  return questionType.replaceAll("_", " ");
}

function arraysMatch(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  const leftSorted = [...left].sort();
  const rightSorted = [...right].sort();
  return leftSorted.every((value, index) => value === rightSorted[index]);
}

export default function TopicDetailScreen() {
  const { topicSlug } = useLocalSearchParams<{ topicSlug: string }>();
  const { width } = useWindowDimensions();
  const isWide = width >= 920;
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [answerRecords, setAnswerRecords] = useState<Record<string, AnswerRecord>>({});
  const [revealedHintCount, setRevealedHintCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadTopic() {
      if (!topicSlug) {
        return;
      }

      try {
        const nextTopic = await getTopic(topicSlug);
        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setTopic(nextTopic);
          setError(null);
          setIsLoading(false);
        });
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        const message = loadError instanceof Error ? loadError.message : "Failed to load topic.";

        startTransition(() => {
          setError(message);
          setIsLoading(false);
        });
      }
    }

    void loadTopic();

    return () => {
      isMounted = false;
    };
  }, [topicSlug]);

  const currentQuestion = topic?.questions[currentIndex] ?? null;
  const currentRecord = currentQuestion ? answerRecords[currentQuestion.id] : undefined;
  const quizComplete = Boolean(topic && quizStarted && currentIndex >= topic.questions.length);
  const answeredCount = Object.keys(answerRecords).length;
  const score = Object.values(answerRecords).filter((record) => record.isCorrect).length;

  function resetQuiz() {
    setQuizStarted(true);
    setCurrentIndex(0);
    setSelectedOptionIds([]);
    setAnswerRecords({});
    setRevealedHintCount(0);
  }

  function handleStartQuiz() {
    resetQuiz();
  }

  function handleOptionPress(question: QuestionSummary, optionId: string) {
    if (currentRecord) {
      return;
    }

    if (question.question_type === "multi_select") {
      setSelectedOptionIds((currentSelection) =>
        currentSelection.includes(optionId)
          ? currentSelection.filter((value) => value !== optionId)
          : [...currentSelection, optionId]
      );
      return;
    }

    setSelectedOptionIds([optionId]);
  }

  function handleSubmitAnswer() {
    if (!currentQuestion || selectedOptionIds.length === 0 || currentRecord) {
      return;
    }

    setAnswerRecords((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: {
        selectedOptionIds,
        isCorrect: arraysMatch(selectedOptionIds, currentQuestion.correct_option_ids),
      },
    }));
  }

  function handleNextQuestion() {
    if (!topic) {
      return;
    }

    setCurrentIndex((current) => current + 1);
    setSelectedOptionIds([]);
    setRevealedHintCount(0);
  }

  function handleRevealHint() {
    if (!currentQuestion) {
      return;
    }

    setRevealedHintCount((currentCount) =>
      Math.min(currentCount + 1, currentQuestion.hint_levels.length)
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: topic?.title ?? "Topic" }} />
      <View style={styles.screen}>
        <View pointerEvents="none" style={styles.orbA} />
        <View pointerEvents="none" style={styles.orbB} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.heroShell, isWide ? styles.heroShellWide : null]}>
            <View style={[styles.heroCard, isWide ? styles.heroCardWide : null]}>
              <Text style={styles.eyebrow}>Practice topic</Text>
              <Text style={styles.heroTitle}>{topic?.title ?? "Loading topic..."}</Text>
              <Text style={styles.heroCopy}>
                {topic?.description ?? "Focused practice with immediate feedback and short review loops."}
              </Text>

              {topic ? (
                <View style={styles.heroStatRow}>
                  <View style={[styles.heroStatCard, styles.heroStatCardPrimary]}>
                    <Text style={styles.heroStatLabel}>Questions</Text>
                    <Text style={styles.heroStatValueLight}>{topic.question_count}</Text>
                  </View>
                  <View style={styles.heroStatCard}>
                    <Text style={styles.heroStatLabel}>Mode</Text>
                    <Text style={styles.heroStatValueDark}>Practice</Text>
                  </View>
                </View>
              ) : null}
            </View>

            <View style={[styles.sideCard, isWide ? styles.sideCardWide : null]}>
              <Text style={styles.sideCardTitle}>Session controls</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{answeredCount} answered</Text>
                </View>
                <View style={[styles.badge, styles.badgeAccent]}>
                  <Text style={styles.badgeText}>{score} correct</Text>
                </View>
              </View>

              <Pressable onPress={handleStartQuiz} style={styles.primaryButton}>
                <Text style={styles.primaryButtonLabel}>
                  {quizStarted ? "Restart practice" : "Start practice"}
                </Text>
              </Pressable>

              <Text style={styles.sideCardCopy}>
                Short, answerable sessions with feedback first. Much less reading up front, much more action.
              </Text>
            </View>
          </View>

          {isLoading ? <Text style={styles.stateText}>Loading questions...</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {!isLoading && !error && topic?.questions.length === 0 ? (
            <Text style={styles.stateText}>No questions are available yet.</Text>
          ) : null}

          {!isLoading && !error && topic && !quizStarted ? (
            <View style={[styles.previewGrid, isWide ? styles.previewGridWide : null]}>
              {topic.questions.map((question, index) => (
                <View
                  key={question.id}
                  style={[styles.previewCard, isWide ? styles.previewCardWide : null]}
                >
                  <Text style={styles.previewMeta}>
                    Q{index + 1} | {formatQuestionType(question.question_type)}
                  </Text>
                  <Text style={styles.previewStem}>{question.stem}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {!isLoading && !error && topic && quizStarted && currentQuestion && !quizComplete ? (
            <View style={[styles.practiceShell, isWide ? styles.practiceShellWide : null]}>
              <View style={[styles.questionCard, isWide ? styles.questionCardWide : null]}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionMeta}>
                    Question {currentIndex + 1} / {topic.questions.length}
                  </Text>
                  <View style={styles.questionTypeBadge}>
                    <Text style={styles.questionTypeBadgeText}>
                      {formatQuestionType(currentQuestion.question_type)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.questionStem}>{currentQuestion.stem}</Text>

                <View style={styles.optionStack}>
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOptionIds.includes(option.id);
                    const isCorrectOption = currentQuestion.correct_option_ids.includes(option.id);
                    const isSubmitted = Boolean(currentRecord);

                    return (
                      <Pressable
                        key={option.id}
                        onPress={() => handleOptionPress(currentQuestion, option.id)}
                        style={[
                          styles.optionCard,
                          isSelected ? styles.optionCardSelected : null,
                          isSubmitted && isCorrectOption ? styles.optionCardCorrect : null,
                          isSubmitted && isSelected && !isCorrectOption
                            ? styles.optionCardIncorrect
                            : null,
                        ]}
                      >
                        <Text style={styles.optionLabel}>{option.label}</Text>
                        <Text style={styles.optionText}>{option.text}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.actionRow}>
                  {!currentRecord ? (
                    <>
                      <Pressable
                        disabled={selectedOptionIds.length === 0}
                        onPress={handleSubmitAnswer}
                        style={[
                          styles.primaryButton,
                          selectedOptionIds.length === 0 ? styles.primaryButtonDisabled : null,
                        ]}
                      >
                        <Text style={styles.primaryButtonLabel}>Submit answer</Text>
                      </Pressable>
                      <Pressable
                        onPress={handleRevealHint}
                        style={styles.secondaryButton}
                      >
                        <Text style={styles.secondaryButtonLabel}>
                          {revealedHintCount > 0 ? "More hint" : "Need a hint?"}
                        </Text>
                      </Pressable>
                    </>
                  ) : (
                    <Pressable onPress={handleNextQuestion} style={styles.primaryButton}>
                      <Text style={styles.primaryButtonLabel}>
                        {currentIndex + 1 === topic.questions.length ? "Finish session" : "Next question"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>

              <View style={[styles.feedbackCard, isWide ? styles.feedbackCardWide : null]}>
                {currentRecord ? (
                  <>
                    <View
                      style={[
                        styles.resultBanner,
                        currentRecord.isCorrect ? styles.resultBannerSuccess : styles.resultBannerDanger,
                      ]}
                    >
                      <Text
                        style={[
                          styles.resultBannerText,
                          currentRecord.isCorrect
                            ? styles.resultBannerTextSuccess
                            : styles.resultBannerTextDanger,
                        ]}
                      >
                        {currentRecord.isCorrect ? "Correct" : "Not quite"}
                      </Text>
                    </View>

                    <Text style={styles.feedbackTitle}>Why</Text>
                    <Text style={styles.feedbackCopy}>{currentQuestion.explanation}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.feedbackTitle}>Before you submit</Text>
                    <Text style={styles.feedbackCopy}>
                      {currentQuestion.question_type === "multi_select"
                        ? "Select every option you believe is correct, then submit."
                        : "Choose one option, then submit to reveal feedback."}
                    </Text>
                  </>
                )}

                {revealedHintCount > 0 ? (
                  <View style={styles.hintStack}>
                    {currentQuestion.hint_levels.slice(0, revealedHintCount).map((hint, index) => (
                      <View key={`${currentQuestion.id}-hint-${index}`} style={styles.hintCard}>
                        <Text style={styles.hintLabel}>Hint {index + 1}</Text>
                        <Text style={styles.hintCopy}>{hint}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}

          {!isLoading && !error && topic && quizComplete ? (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryEyebrow}>Session complete</Text>
              <Text style={styles.summaryTitle}>
                {score} / {topic.questions.length} correct
              </Text>
              <Text style={styles.summaryCopy}>
                Run it again to improve, or go back and pick another topic from the subject map.
              </Text>

              <View style={styles.summaryStatsRow}>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatLabel}>Accuracy</Text>
                  <Text style={styles.summaryStatValue}>
                    {Math.round((score / topic.questions.length) * 100)}%
                  </Text>
                </View>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatLabel}>Questions</Text>
                  <Text style={styles.summaryStatValue}>{topic.questions.length}</Text>
                </View>
              </View>

              <Pressable onPress={resetQuiz} style={styles.primaryButton}>
                <Text style={styles.primaryButtonLabel}>Practice again</Text>
              </Pressable>
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
  orbA: {
    position: "absolute",
    top: -80,
    right: -60,
    height: 240,
    width: 240,
    borderRadius: 999,
    backgroundColor: "#d9f2ff",
  },
  orbB: {
    position: "absolute",
    bottom: -110,
    left: -80,
    height: 280,
    width: 280,
    borderRadius: 999,
    backgroundColor: "#e4ddff",
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
    borderRadius: 30,
    backgroundColor: Brand.colors.ink,
    padding: 24,
    ...Brand.shadow,
  },
  heroCardWide: {
    flex: 1.2,
  },
  sideCard: {
    gap: 14,
    borderRadius: 30,
    backgroundColor: Brand.colors.surface,
    padding: 22,
    ...Brand.shadow,
  },
  sideCardWide: {
    flex: 0.82,
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
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
  },
  heroCopy: {
    color: "#d4e2f0",
    fontSize: 14,
    lineHeight: 22,
  },
  heroStatRow: {
    flexDirection: "row",
    gap: 12,
  },
  heroStatCard: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: Brand.colors.surface,
    padding: 16,
  },
  heroStatCardPrimary: {
    backgroundColor: Brand.colors.primary,
  },
  heroStatLabel: {
    color: "rgba(8, 17, 31, 0.68)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  heroStatValueLight: {
    marginTop: 8,
    color: Brand.colors.surface,
    fontSize: 28,
    fontWeight: "800",
  },
  heroStatValueDark: {
    marginTop: 8,
    color: Brand.colors.ink,
    fontSize: 22,
    fontWeight: "800",
  },
  sideCardTitle: {
    color: Brand.colors.ink,
    fontSize: 22,
    fontWeight: "800",
  },
  sideCardCopy: {
    color: Brand.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  badge: {
    borderRadius: 999,
    backgroundColor: Brand.colors.shellAlt,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  badgeAccent: {
    backgroundColor: Brand.colors.accentSoft,
  },
  badgeText: {
    color: Brand.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  previewGrid: {
    gap: 12,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
  },
  previewGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  previewCard: {
    gap: 8,
    borderRadius: 24,
    backgroundColor: Brand.colors.surface,
    padding: 18,
    ...Brand.shadow,
  },
  previewCardWide: {
    width: "48.8%",
  },
  previewMeta: {
    color: Brand.colors.primaryDeep,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  previewStem: {
    color: Brand.colors.ink,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "700",
  },
  practiceShell: {
    gap: 16,
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
  },
  practiceShellWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  questionCard: {
    gap: 16,
    borderRadius: 30,
    backgroundColor: Brand.colors.surface,
    padding: 22,
    ...Brand.shadow,
  },
  questionCardWide: {
    flex: 1.2,
  },
  feedbackCard: {
    gap: 14,
    borderRadius: 30,
    backgroundColor: "#f9fbff",
    padding: 22,
    ...Brand.shadow,
  },
  feedbackCardWide: {
    flex: 0.82,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  questionMeta: {
    color: Brand.colors.primaryDeep,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  questionTypeBadge: {
    borderRadius: 999,
    backgroundColor: Brand.colors.shellAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  questionTypeBadgeText: {
    color: Brand.colors.text,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  questionStem: {
    color: Brand.colors.ink,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },
  optionStack: {
    gap: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.colors.line,
    backgroundColor: Brand.colors.surfaceStrong,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionCardSelected: {
    borderColor: Brand.colors.primary,
    backgroundColor: "#e8f1ff",
  },
  optionCardCorrect: {
    borderColor: "#0f9f8b",
    backgroundColor: Brand.colors.accentSoft,
  },
  optionCardIncorrect: {
    borderColor: Brand.colors.danger,
    backgroundColor: Brand.colors.dangerSoft,
  },
  optionLabel: {
    color: Brand.colors.primaryDeep,
    fontSize: 13,
    fontWeight: "800",
  },
  optionText: {
    flex: 1,
    color: Brand.colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: Brand.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonLabel: {
    color: Brand.colors.surface,
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: Brand.colors.shellAlt,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  secondaryButtonLabel: {
    color: Brand.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  resultBanner: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resultBannerSuccess: {
    backgroundColor: Brand.colors.accentSoft,
  },
  resultBannerDanger: {
    backgroundColor: Brand.colors.dangerSoft,
  },
  resultBannerText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  resultBannerTextSuccess: {
    color: "#0d6b5f",
  },
  resultBannerTextDanger: {
    color: Brand.colors.danger,
  },
  feedbackTitle: {
    color: Brand.colors.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  feedbackCopy: {
    color: Brand.colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  hintStack: {
    gap: 10,
  },
  hintCard: {
    borderRadius: 18,
    backgroundColor: Brand.colors.goldSoft,
    padding: 14,
  },
  hintLabel: {
    color: "#7a5209",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  hintCopy: {
    marginTop: 6,
    color: "#7a5209",
    fontSize: 14,
    lineHeight: 21,
  },
  summaryCard: {
    gap: 14,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    borderRadius: 32,
    backgroundColor: Brand.colors.surface,
    padding: 24,
    ...Brand.shadow,
  },
  summaryEyebrow: {
    color: Brand.colors.primaryDeep,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  summaryTitle: {
    color: Brand.colors.ink,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
  },
  summaryCopy: {
    color: Brand.colors.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  summaryStatsRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryStat: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: Brand.colors.surfaceStrong,
    padding: 16,
  },
  summaryStatLabel: {
    color: Brand.colors.muted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  summaryStatValue: {
    marginTop: 8,
    color: Brand.colors.ink,
    fontSize: 24,
    fontWeight: "800",
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
});
