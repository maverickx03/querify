from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLAlchemyEnum, UniqueConstraint
from datetime import datetime
from sqlalchemy.orm import relationship
import enum


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    username = Column(String, unique=True, index=True)

    # Relationships
    questions = relationship("Question", back_populates="owner")
    answers = relationship("Answer", back_populates="owner")
    votes = relationship("QuestionVote", back_populates="user")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    body = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)

    # Relationships
    owner = relationship("User", back_populates="questions")
    answers = relationship("Answer", back_populates="question")
    votes = relationship("QuestionVote", back_populates="question")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    body = Column(String, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)

    # Relationships
    question = relationship("Question", back_populates="answers")
    owner = relationship("User", back_populates="answers")


class VoteType(enum.Enum):
    upvote = "upvote"
    downvote = "downvote"


class QuestionVote(Base):
    __tablename__ = "question_votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    vote_type = Column(SQLAlchemyEnum(VoteType))

    # Relationships
    user = relationship("User", back_populates="votes")
    question = relationship("Question", back_populates="votes")

    __table_args__ = (
        UniqueConstraint('user_id', 'question_id', name='unique_user_question_vote'),
    )
