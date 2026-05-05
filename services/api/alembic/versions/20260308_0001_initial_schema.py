"""initial schema

Revision ID: 20260308_0001
Revises:
Create Date: 2026-03-08
"""

from alembic import op
import sqlalchemy as sa


revision = "20260308_0001"
down_revision = None
branch_labels = None
depends_on = None


user_role = sa.Enum("student", "instructor", "admin", name="userrole")
question_type = sa.Enum(
    "multiple_choice",
    "multi_select",
    "true_false",
    "short_answer",
    "code_output",
    "sql_analysis",
    name="questiontype",
)
question_difficulty = sa.Enum("easy", "medium", "hard", name="questiondifficulty")
quiz_mode = sa.Enum("practice", "review", "exam", name="quizmode")
attempt_status = sa.Enum(
    "in_progress",
    "completed",
    "abandoned",
    name="attemptstatus",
)


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("role", user_role, nullable=False, server_default="student"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "subjects",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    op.create_index("ix_subjects_slug", "subjects", ["slug"], unique=True)

    op.create_table(
        "topics",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("subject_id", sa.String(length=64), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.ForeignKeyConstraint(["subject_id"], ["subjects.id"]),
    )
    op.create_index("ix_topics_subject_id", "topics", ["subject_id"], unique=False)
    op.create_index("ix_topics_slug", "topics", ["slug"], unique=True)

    op.create_table(
        "questions",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("topic_id", sa.String(length=64), nullable=False),
        sa.Column("question_type", question_type, nullable=False),
        sa.Column("difficulty", question_difficulty, nullable=False),
        sa.Column("stem", sa.Text(), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False),
        sa.Column("hint_level_1", sa.Text(), nullable=False),
        sa.Column("hint_level_2", sa.Text(), nullable=False),
        sa.Column("hint_level_3", sa.Text(), nullable=False),
        sa.Column("options_json", sa.Text(), nullable=True),
        sa.Column("tags_json", sa.Text(), nullable=True),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.ForeignKeyConstraint(["topic_id"], ["topics.id"]),
    )
    op.create_index("ix_questions_topic_id", "questions", ["topic_id"], unique=False)

    op.create_table(
        "quizzes",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("subject_id", sa.String(length=64), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("mode", quiz_mode, nullable=False, server_default="practice"),
        sa.Column("total_questions", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.ForeignKeyConstraint(["subject_id"], ["subjects.id"]),
    )
    op.create_index("ix_quizzes_subject_id", "quizzes", ["subject_id"], unique=False)

    op.create_table(
        "quiz_attempts",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("quiz_id", sa.String(length=64), nullable=False),
        sa.Column("user_id", sa.String(length=64), nullable=False),
        sa.Column(
            "status",
            attempt_status,
            nullable=False,
            server_default="in_progress",
        ),
        sa.Column("score", sa.Integer(), nullable=True),
        sa.Column("total_answered", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "started_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["quiz_id"], ["quizzes.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
    )
    op.create_index("ix_quiz_attempts_quiz_id", "quiz_attempts", ["quiz_id"], unique=False)
    op.create_index("ix_quiz_attempts_user_id", "quiz_attempts", ["user_id"], unique=False)

    op.create_table(
        "analytics_events",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("user_id", sa.String(length=64), nullable=True),
        sa.Column("event_name", sa.String(length=120), nullable=False),
        sa.Column("platform", sa.String(length=64), nullable=False),
        sa.Column("payload_json", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
    )
    op.create_index("ix_analytics_events_user_id", "analytics_events", ["user_id"], unique=False)
    op.create_index("ix_analytics_events_event_name", "analytics_events", ["event_name"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_analytics_events_event_name", table_name="analytics_events")
    op.drop_index("ix_analytics_events_user_id", table_name="analytics_events")
    op.drop_table("analytics_events")

    op.drop_index("ix_quiz_attempts_user_id", table_name="quiz_attempts")
    op.drop_index("ix_quiz_attempts_quiz_id", table_name="quiz_attempts")
    op.drop_table("quiz_attempts")

    op.drop_index("ix_quizzes_subject_id", table_name="quizzes")
    op.drop_table("quizzes")

    op.drop_index("ix_questions_topic_id", table_name="questions")
    op.drop_table("questions")

    op.drop_index("ix_topics_slug", table_name="topics")
    op.drop_index("ix_topics_subject_id", table_name="topics")
    op.drop_table("topics")

    op.drop_index("ix_subjects_slug", table_name="subjects")
    op.drop_table("subjects")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

    bind = op.get_bind()
    attempt_status.drop(bind, checkfirst=True)
    quiz_mode.drop(bind, checkfirst=True)
    question_difficulty.drop(bind, checkfirst=True)
    question_type.drop(bind, checkfirst=True)
    user_role.drop(bind, checkfirst=True)
