from collections.abc import Iterable

from app.models.enums import QuestionDifficulty, QuestionType
from app.schemas.learning import (
    QuestionDetail,
    QuestionOption,
    QuestionSummary,
    SubjectDetail,
    SubjectSummary,
    TopicDetail,
    TopicSummary,
)


def _question(
    *,
    id: str,
    topic_slug: str,
    question_type: QuestionType,
    difficulty: QuestionDifficulty,
    stem: str,
    explanation: str,
    hint_levels: list[str],
    options: list[tuple[str, str, str]],
    correct_option_ids: list[str],
    tags: list[str],
) -> dict:
    return {
        "id": id,
        "topic_slug": topic_slug,
        "question_type": question_type,
        "difficulty": difficulty,
        "stem": stem,
        "explanation": explanation,
        "hint_levels": hint_levels,
        "options": [
            {"id": option_id, "label": label, "text": text}
            for option_id, label, text in options
        ],
        "correct_option_ids": correct_option_ids,
        "tags": tags,
    }


SUBJECTS = [
    {
        "id": "subject-python",
        "slug": "python",
        "title": "Python Fundamentals",
        "description": "Functions, collections, and core control-flow thinking.",
    },
    {
        "id": "subject-sql",
        "slug": "sql",
        "title": "SQL and Databases",
        "description": "Query logic, joins, filters, and relational reasoning.",
    },
    {
        "id": "subject-statistics",
        "slug": "statistics",
        "title": "Statistics Essentials",
        "description": "Probability, inference, and hypothesis testing basics.",
    },
    {
        "id": "subject-machine-learning",
        "slug": "machine-learning",
        "title": "Machine Learning Basics",
        "description": "Evaluation, data splitting, and practical model habits.",
    },
    {
        "id": "subject-data-structures",
        "slug": "data-structures",
        "title": "Data Structures",
        "description": "Arrays, stacks, queues, and algorithmic intuition.",
    },
]

TOPICS = [
    {
        "id": "topic-python-functions",
        "subject_slug": "python",
        "slug": "python-functions",
        "title": "Functions",
        "description": "Parameters, returns, scope, and decomposition.",
        "order_index": 1,
    },
    {
        "id": "topic-python-lists",
        "subject_slug": "python",
        "slug": "python-lists",
        "title": "Lists",
        "description": "Indexing, slicing, iteration, and list operations.",
        "order_index": 2,
    },
    {
        "id": "topic-python-dictionaries",
        "subject_slug": "python",
        "slug": "python-dictionaries",
        "title": "Dictionaries",
        "description": "Key-value access, lookup safety, and common patterns.",
        "order_index": 3,
    },
    {
        "id": "topic-sql-select",
        "subject_slug": "sql",
        "slug": "sql-select-basics",
        "title": "SELECT Basics",
        "description": "Filtering, projection, and query order fundamentals.",
        "order_index": 1,
    },
    {
        "id": "topic-sql-joins",
        "subject_slug": "sql",
        "slug": "sql-joins",
        "title": "Joins",
        "description": "Combining tables with inner and outer joins.",
        "order_index": 2,
    },
    {
        "id": "topic-probability-basics",
        "subject_slug": "statistics",
        "slug": "probability-basics",
        "title": "Probability Basics",
        "description": "Independent events, outcomes, and expected value.",
        "order_index": 1,
    },
    {
        "id": "topic-hypothesis-testing",
        "subject_slug": "statistics",
        "slug": "hypothesis-testing",
        "title": "Hypothesis Testing",
        "description": "Null hypotheses, p-values, and significance decisions.",
        "order_index": 2,
    },
    {
        "id": "topic-train-test-split",
        "subject_slug": "machine-learning",
        "slug": "train-test-split",
        "title": "Train/Test Split",
        "description": "Generalization, leakage, and proper evaluation setup.",
        "order_index": 1,
    },
    {
        "id": "topic-classification-metrics",
        "subject_slug": "machine-learning",
        "slug": "classification-metrics",
        "title": "Classification Metrics",
        "description": "Precision, recall, and interpreting model performance.",
        "order_index": 2,
    },
    {
        "id": "topic-arrays-complexity",
        "subject_slug": "data-structures",
        "slug": "arrays-complexity",
        "title": "Arrays and Complexity",
        "description": "Access patterns, insertion cost, and time complexity.",
        "order_index": 1,
    },
    {
        "id": "topic-stacks-queues",
        "subject_slug": "data-structures",
        "slug": "stacks-queues",
        "title": "Stacks and Queues",
        "description": "LIFO, FIFO, and operational behavior.",
        "order_index": 2,
    },
]

QUESTIONS = [
    _question(
        id="q-python-001",
        topic_slug="python-functions",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.EASY,
        stem="What does a Python function return if no explicit return statement is used?",
        explanation="Python returns None when a function finishes without an explicit return value.",
        hint_levels=[
            "Think about the default value of a completed function call.",
            "It is a singleton object used to represent no value.",
            "The default return value is None.",
        ],
        options=[
            ("a", "A", "0"),
            ("b", "B", "An empty string"),
            ("c", "C", "None"),
            ("d", "D", "False"),
        ],
        correct_option_ids=["c"],
        tags=["python", "functions", "returns"],
    ),
    _question(
        id="q-python-002",
        topic_slug="python-functions",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="Which statement about local variables inside a function is correct?",
        explanation="Local variables exist only during the function call unless returned or stored elsewhere.",
        hint_levels=[
            "Think about the variable lifetime after the function finishes.",
            "A local name is scoped to the function body.",
            "It is not directly available outside the function after the call ends.",
        ],
        options=[
            ("a", "A", "They remain globally accessible after the function runs."),
            ("b", "B", "They are scoped to the function call."),
            ("c", "C", "They automatically become object attributes."),
            ("d", "D", "They are shared by every function in the file."),
        ],
        correct_option_ids=["b"],
        tags=["python", "scope", "functions"],
    ),
    _question(
        id="q-python-003",
        topic_slug="python-lists",
        question_type=QuestionType.TRUE_FALSE,
        difficulty=QuestionDifficulty.EASY,
        stem="List slicing in Python creates a new list rather than modifying the original in place.",
        explanation="A slice expression returns a new list object containing the selected elements.",
        hint_levels=[
            "Think about what happens when you assign a slice result to another variable.",
            "The original list remains unchanged unless you assign back into it.",
            "The statement is true.",
        ],
        options=[
            ("a", "A", "True"),
            ("b", "B", "False"),
        ],
        correct_option_ids=["a"],
        tags=["python", "lists", "slicing"],
    ),
    _question(
        id="q-python-004",
        topic_slug="python-lists",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.EASY,
        stem="Which method adds a single element to the end of a list?",
        explanation="append adds one element; extend adds items from another iterable.",
        hint_levels=[
            "Compare append and extend.",
            "One method accepts a single item and adds it as one element.",
            "The correct method is append.",
        ],
        options=[
            ("a", "A", "insert"),
            ("b", "B", "append"),
            ("c", "C", "extend"),
            ("d", "D", "sort"),
        ],
        correct_option_ids=["b"],
        tags=["python", "lists", "methods"],
    ),
    _question(
        id="q-python-005",
        topic_slug="python-dictionaries",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.EASY,
        stem="Which dictionary method is commonly used to read a value without raising a KeyError when the key is missing?",
        explanation="dict.get returns the value when present and a default when absent.",
        hint_levels=[
            "There is a method designed for safer lookup.",
            "It accepts an optional default value.",
            "The correct method is get.",
        ],
        options=[
            ("a", "A", "pop"),
            ("b", "B", "get"),
            ("c", "C", "keys"),
            ("d", "D", "items"),
        ],
        correct_option_ids=["b"],
        tags=["python", "dict", "lookup"],
    ),
    _question(
        id="q-python-006",
        topic_slug="python-dictionaries",
        question_type=QuestionType.MULTI_SELECT,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="Which statements about Python dictionary keys are correct?",
        explanation="Dictionary keys must be hashable and each key appears only once in the mapping.",
        hint_levels=[
            "Think about uniqueness and hashability.",
            "Lists are mutable and not hashable, so they are not valid keys.",
            "Keys must be unique and hashable.",
        ],
        options=[
            ("a", "A", "Keys must be unique within the dictionary."),
            ("b", "B", "Lists are always valid dictionary keys."),
            ("c", "C", "Keys must be hashable."),
            ("d", "D", "A dictionary can only store string keys."),
        ],
        correct_option_ids=["a", "c"],
        tags=["python", "dict", "keys"],
    ),
    _question(
        id="q-sql-001",
        topic_slug="sql-select-basics",
        question_type=QuestionType.SQL_ANALYSIS,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="Which clause filters rows before aggregation in a SQL query?",
        explanation="WHERE filters rows before grouping or aggregation. HAVING filters groups after aggregation.",
        hint_levels=[
            "Compare WHERE and HAVING.",
            "One works on rows before GROUP BY; the other works on grouped results.",
            "The correct clause is WHERE.",
        ],
        options=[
            ("a", "A", "HAVING"),
            ("b", "B", "WHERE"),
            ("c", "C", "ORDER BY"),
            ("d", "D", "LIMIT"),
        ],
        correct_option_ids=["b"],
        tags=["sql", "select", "filtering"],
    ),
    _question(
        id="q-sql-002",
        topic_slug="sql-select-basics",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.EASY,
        stem="Which keyword removes duplicate rows from a SELECT result?",
        explanation="DISTINCT filters the output to unique row combinations.",
        hint_levels=[
            "The keyword appears right after SELECT.",
            "It returns only unique row combinations.",
            "The correct keyword is DISTINCT.",
        ],
        options=[
            ("a", "A", "UNIQUE"),
            ("b", "B", "DISTINCT"),
            ("c", "C", "ONLY"),
            ("d", "D", "GROUP"),
        ],
        correct_option_ids=["b"],
        tags=["sql", "select", "distinct"],
    ),
    _question(
        id="q-sql-003",
        topic_slug="sql-joins",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="What does an INNER JOIN return?",
        explanation="An INNER JOIN returns rows where the join condition matches in both tables.",
        hint_levels=[
            "Think about rows that satisfy the join predicate.",
            "Unmatched rows are not included.",
            "Only matching rows from both tables are returned.",
        ],
        options=[
            ("a", "A", "All rows from the left table only"),
            ("b", "B", "All rows from both tables whether they match or not"),
            ("c", "C", "Rows with matching join keys in both tables"),
            ("d", "D", "Only rows with NULL values"),
        ],
        correct_option_ids=["c"],
        tags=["sql", "joins", "inner-join"],
    ),
    _question(
        id="q-sql-004",
        topic_slug="sql-joins",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="What is the defining behavior of a LEFT JOIN?",
        explanation="A LEFT JOIN keeps all rows from the left table and matches from the right when available.",
        hint_levels=[
            "Focus on which table is preserved.",
            "Rows on the left survive even when there is no right-side match.",
            "All left-table rows are kept.",
        ],
        options=[
            ("a", "A", "It keeps only rows that match in both tables"),
            ("b", "B", "It keeps all rows from the left table"),
            ("c", "C", "It keeps all rows from the right table"),
            ("d", "D", "It removes NULLs automatically"),
        ],
        correct_option_ids=["b"],
        tags=["sql", "joins", "left-join"],
    ),
    _question(
        id="q-stats-001",
        topic_slug="probability-basics",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.EASY,
        stem="For independent events A and B, which formula is correct?",
        explanation="If A and B are independent, P(A and B) = P(A) x P(B).",
        hint_levels=[
            "Think about the multiplication rule for independence.",
            "Joint probability becomes the product of the two probabilities.",
            "Multiply P(A) by P(B).",
        ],
        options=[
            ("a", "A", "P(A and B) = P(A) x P(B)"),
            ("b", "B", "P(A and B) = P(A) + P(B)"),
            ("c", "C", "P(A and B) = 1 - P(A)"),
            ("d", "D", "P(A and B) = P(A | B) + P(B)"),
        ],
        correct_option_ids=["a"],
        tags=["statistics", "probability", "independence"],
    ),
    _question(
        id="q-stats-002",
        topic_slug="probability-basics",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="Expected value is best described as:",
        explanation="Expected value is the weighted average outcome, using each outcome's probability as its weight.",
        hint_levels=[
            "It summarizes the average outcome over many repeated trials.",
            "Probabilities act as weights.",
            "It is a weighted average.",
        ],
        options=[
            ("a", "A", "The largest possible outcome"),
            ("b", "B", "The probability of the most common event"),
            ("c", "C", "A weighted average of possible outcomes"),
            ("d", "D", "The median of all outcomes"),
        ],
        correct_option_ids=["c"],
        tags=["statistics", "probability", "expected-value"],
    ),
    _question(
        id="q-stats-003",
        topic_slug="hypothesis-testing",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="What does a p-value measure?",
        explanation="It measures how compatible the observed data are with the null hypothesis, assuming the null is true.",
        hint_levels=[
            "It is computed under the null hypothesis.",
            "It is not the probability that the null is true.",
            "It measures how extreme the observed data are under the null.",
        ],
        options=[
            ("a", "A", "The probability that the alternative hypothesis is true"),
            ("b", "B", "How extreme the observed data are under the null hypothesis"),
            ("c", "C", "The size of the sample"),
            ("d", "D", "The exact probability of making any error"),
        ],
        correct_option_ids=["b"],
        tags=["statistics", "p-value", "hypothesis-testing"],
    ),
    _question(
        id="q-stats-004",
        topic_slug="hypothesis-testing",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.EASY,
        stem="If the p-value is below the significance threshold alpha, what is the usual decision?",
        explanation="The common decision rule is to reject the null hypothesis when p < alpha.",
        hint_levels=[
            "Compare the p-value to alpha.",
            "Smaller than alpha means statistically significant by the chosen threshold.",
            "Reject the null hypothesis.",
        ],
        options=[
            ("a", "A", "Increase the sample size immediately"),
            ("b", "B", "Accept the null hypothesis as proven"),
            ("c", "C", "Reject the null hypothesis"),
            ("d", "D", "Set alpha equal to the p-value"),
        ],
        correct_option_ids=["c"],
        tags=["statistics", "alpha", "decision-rule"],
    ),
    _question(
        id="q-ml-001",
        topic_slug="train-test-split",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.EASY,
        stem="Why do we keep a test set separate from the training set?",
        explanation="The test set estimates how well the model generalizes to unseen data.",
        hint_levels=[
            "Think about honest model evaluation.",
            "The test set should simulate unseen future data.",
            "It is used to estimate generalization performance.",
        ],
        options=[
            ("a", "A", "To make the training data larger"),
            ("b", "B", "To evaluate performance on unseen data"),
            ("c", "C", "To remove all noisy observations"),
            ("d", "D", "To guarantee perfect accuracy"),
        ],
        correct_option_ids=["b"],
        tags=["ml", "evaluation", "train-test-split"],
    ),
    _question(
        id="q-ml-002",
        topic_slug="train-test-split",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="Which action is a form of data leakage?",
        explanation="Fitting preprocessing on the full dataset before splitting lets test information influence training.",
        hint_levels=[
            "Leakage happens when test information sneaks into training or preprocessing.",
            "Preprocessing should be fit on training data only.",
            "Fitting a scaler on the full dataset before splitting is leakage.",
        ],
        options=[
            ("a", "A", "Using a validation set during model selection"),
            ("b", "B", "Shuffling the rows before splitting"),
            ("c", "C", "Fitting a scaler on the full dataset before the split"),
            ("d", "D", "Evaluating on the test set once at the end"),
        ],
        correct_option_ids=["c"],
        tags=["ml", "leakage", "preprocessing"],
    ),
    _question(
        id="q-ml-003",
        topic_slug="classification-metrics",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="Precision answers which question?",
        explanation="Precision measures how many predicted positives were actually positive.",
        hint_levels=[
            "Focus on the model's positive predictions.",
            "It asks about correctness among predicted positives.",
            "It is true positives divided by all predicted positives.",
        ],
        options=[
            ("a", "A", "Of all actual positives, how many did we find?"),
            ("b", "B", "Of all predicted positives, how many were correct?"),
            ("c", "C", "How many total examples were classified?"),
            ("d", "D", "How often did the model predict the negative class?"),
        ],
        correct_option_ids=["b"],
        tags=["ml", "metrics", "precision"],
    ),
    _question(
        id="q-ml-004",
        topic_slug="classification-metrics",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="Recall is especially important when which type of mistake is costly?",
        explanation="Recall matters when missing true positives is expensive, so false negatives matter most.",
        hint_levels=[
            "Think about the cases the model fails to detect.",
            "Recall focuses on capturing actual positives.",
            "False negatives are the costly mistake here.",
        ],
        options=[
            ("a", "A", "False positives"),
            ("b", "B", "True negatives"),
            ("c", "C", "False negatives"),
            ("d", "D", "Correct predictions"),
        ],
        correct_option_ids=["c"],
        tags=["ml", "metrics", "recall"],
    ),
    _question(
        id="q-ds-001",
        topic_slug="arrays-complexity",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.EASY,
        stem="What is the typical time complexity of indexed access in an array-like structure?",
        explanation="Array indexing is typically O(1) because the address can be computed directly.",
        hint_levels=[
            "Think about direct memory-offset access.",
            "You do not need to scan previous elements.",
            "Indexed access is O(1).",
        ],
        options=[
            ("a", "A", "O(1)"),
            ("b", "B", "O(log n)"),
            ("c", "C", "O(n)"),
            ("d", "D", "O(n log n)"),
        ],
        correct_option_ids=["a"],
        tags=["data-structures", "arrays", "complexity"],
    ),
    _question(
        id="q-ds-002",
        topic_slug="arrays-complexity",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="Why can inserting into the beginning of a dynamic array be expensive?",
        explanation="Elements often need to be shifted to create space at the front, making the operation linear.",
        hint_levels=[
            "Think about what happens to existing elements.",
            "Many elements may need to move one position.",
            "Shifting elements makes the cost O(n).",
        ],
        options=[
            ("a", "A", "Because arrays cannot store numbers"),
            ("b", "B", "Because every insert requires sorting first"),
            ("c", "C", "Because existing elements may need to be shifted"),
            ("d", "D", "Because arrays always duplicate the entire dataset"),
        ],
        correct_option_ids=["c"],
        tags=["data-structures", "arrays", "insertion"],
    ),
    _question(
        id="q-ds-003",
        topic_slug="stacks-queues",
        question_type=QuestionType.MULTIPLE_CHOICE,
        difficulty=QuestionDifficulty.EASY,
        stem="Which data structure follows first-in, first-out order?",
        explanation="A queue removes items in the same order they were inserted: FIFO.",
        hint_levels=[
            "FIFO means the earliest inserted item leaves first.",
            "Stacks are LIFO; queues are FIFO.",
            "The correct structure is a queue.",
        ],
        options=[
            ("a", "A", "Stack"),
            ("b", "B", "Queue"),
            ("c", "C", "Heap"),
            ("d", "D", "Tree"),
        ],
        correct_option_ids=["b"],
        tags=["data-structures", "queue", "fifo"],
    ),
    _question(
        id="q-ds-004",
        topic_slug="stacks-queues",
        question_type=QuestionType.MULTI_SELECT,
        difficulty=QuestionDifficulty.MEDIUM,
        stem="Which operations are standard stack operations?",
        explanation="Stacks use push to add items and pop to remove the most recently added item.",
        hint_levels=[
            "Think LIFO behavior.",
            "Queue terms like enqueue and dequeue do not belong to stacks.",
            "The standard operations are push and pop.",
        ],
        options=[
            ("a", "A", "push"),
            ("b", "B", "pop"),
            ("c", "C", "enqueue"),
            ("d", "D", "dequeue"),
        ],
        correct_option_ids=["a", "b"],
        tags=["data-structures", "stack", "operations"],
    ),
]


def _question_options(raw_options: Iterable[dict[str, str]]) -> list[QuestionOption]:
    return [QuestionOption(**option) for option in raw_options]


def _question_payload(raw_question: dict) -> dict:
    return {
        **raw_question,
        "options": _question_options(raw_question["options"]),
    }


def list_subjects() -> list[SubjectSummary]:
    topic_counts = {subject["slug"]: 0 for subject in SUBJECTS}
    for topic in TOPICS:
        topic_counts[topic["subject_slug"]] += 1

    return [
        SubjectSummary(
            **subject,
            topic_count=topic_counts[subject["slug"]],
        )
        for subject in SUBJECTS
    ]


def get_subject(subject_slug: str) -> SubjectDetail | None:
    subject = next((item for item in SUBJECTS if item["slug"] == subject_slug), None)
    if subject is None:
        return None

    topics = list_topics(subject_slug)
    return SubjectDetail(
        **subject,
        topic_count=len(topics),
        topics=topics,
    )


def list_topics(subject_slug: str | None = None) -> list[TopicSummary]:
    topics = [topic for topic in TOPICS if subject_slug in (None, topic["subject_slug"])]
    question_counts = {topic["slug"]: 0 for topic in topics}
    for question in QUESTIONS:
        if question["topic_slug"] in question_counts:
            question_counts[question["topic_slug"]] += 1

    return [
        TopicSummary(
            **topic,
            question_count=question_counts[topic["slug"]],
        )
        for topic in topics
    ]


def get_topic(topic_slug: str) -> TopicDetail | None:
    topic = next((item for item in TOPICS if item["slug"] == topic_slug), None)
    if topic is None:
        return None

    questions = list_questions(topic_slug)
    return TopicDetail(
        **topic,
        question_count=len(questions),
        questions=questions,
    )


def list_questions(topic_slug: str | None = None) -> list[QuestionSummary]:
    questions = [
        question for question in QUESTIONS if topic_slug in (None, question["topic_slug"])
    ]
    return [QuestionSummary(**_question_payload(question)) for question in questions]


def get_question(question_id: str) -> QuestionDetail | None:
    question = next((item for item in QUESTIONS if item["id"] == question_id), None)
    if question is None:
        return None

    return QuestionDetail(**_question_payload(question))
