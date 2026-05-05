from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import QuestionDifficulty, QuestionType


class QuestionOption(BaseModel):
    id: str
    label: str
    text: str


class QuestionSummary(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    id: str
    topic_slug: str
    question_type: QuestionType
    difficulty: QuestionDifficulty
    stem: str
    explanation: str
    hint_levels: list[str]
    options: list[QuestionOption] = Field(default_factory=list)
    correct_option_ids: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)


class QuestionDetail(QuestionSummary):
    pass


class TopicSummary(BaseModel):
    id: str
    subject_slug: str
    slug: str
    title: str
    description: str
    order_index: int
    question_count: int


class TopicDetail(TopicSummary):
    questions: list[QuestionSummary]


class SubjectSummary(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    topic_count: int


class SubjectDetail(SubjectSummary):
    topics: list[TopicSummary]
