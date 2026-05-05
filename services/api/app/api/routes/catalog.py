from fastapi import APIRouter, HTTPException, status

from app.schemas.learning import QuestionDetail, QuestionSummary, SubjectDetail, SubjectSummary, TopicDetail, TopicSummary
from app.services.catalog import get_question, get_subject, get_topic, list_questions, list_subjects, list_topics

router = APIRouter()


@router.get("/subjects", response_model=list[SubjectSummary])
def get_subjects() -> list[SubjectSummary]:
    return list_subjects()


@router.get("/subjects/{subject_slug}", response_model=SubjectDetail)
def get_subject_detail(subject_slug: str) -> SubjectDetail:
    subject = get_subject(subject_slug)
    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found.",
        )

    return subject


@router.get("/subjects/{subject_slug}/topics", response_model=list[TopicSummary])
def get_subject_topics(subject_slug: str) -> list[TopicSummary]:
    subject = get_subject(subject_slug)
    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found.",
        )

    return list_topics(subject_slug)


@router.get("/topics/{topic_slug}", response_model=TopicDetail)
def get_topic_detail(topic_slug: str) -> TopicDetail:
    topic = get_topic(topic_slug)
    if topic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found.",
        )

    return topic


@router.get("/topics/{topic_slug}/questions", response_model=list[QuestionSummary])
def get_topic_questions(topic_slug: str) -> list[QuestionSummary]:
    topic = get_topic(topic_slug)
    if topic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found.",
        )

    return list_questions(topic_slug)


@router.get("/questions/{question_id}", response_model=QuestionDetail)
def get_question_detail(question_id: str) -> QuestionDetail:
    question = get_question(question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found.",
        )

    return question
