from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    MULTI_SELECT = "multi_select"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    CODE_OUTPUT = "code_output"
    SQL_ANALYSIS = "sql_analysis"


class QuestionDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuizMode(str, Enum):
    PRACTICE = "practice"
    REVIEW = "review"
    EXAM = "exam"


class AttemptStatus(str, Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ABANDONED = "abandoned"
