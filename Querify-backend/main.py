from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from database import SessionLocal, engine
from models import Base, User, Question, Answer, QuestionVote
from schemas import UserCreate, UserOut, Login, QuestionCreate, QuestionOut, AnswerCreate, AnswerOut, QuestionVoteCreate, QuestionVoteResponse, VoteType, AnswerWithQuestionOut
from auth import hash_password, verify_password, create_access_token, decode_token
from fastapi.security import APIKeyHeader
from fastapi import status
from typing import List
from sqlalchemy import or_


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add this **after** you initialize FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@app.post("/register", response_model = UserOut)
def register(user:UserCreate, db : Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    db_username = db.query(User).filter(User.username == user.username).first()
    if db_username:
        raise HTTPException(status_code=400, detail = "Username taken, Choose Another")
    else:

        if db_user:
            raise HTTPException(status_code = 400, detail = "Email already registered")
        else:
            hashed = hash_password(user.password)
            new_user = User(email=user.email, hashed_password = hashed, username = user.username)
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            return new_user

@app.post("/login")
def login(data: Login, db : Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code = 404, detail = "Invalid Credentials")
    
    token = create_access_token({"sub" : user.email})
    return {"access_token" : token}

api_key_header = APIKeyHeader(name = "Authorization")


def get_current_user(token: str = Depends(api_key_header), db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code= 401, detail= "Invalid or expired token")
    
    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=401, detail = "User not found")
    
    return user



@app.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": "Access granted", "user": current_user.email}

@app.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return {
           "id": current_user.id,
           "username": current_user.username,
           "email": current_user.email 
        }


@app.post("/questions", response_model=QuestionOut)
def create_question(
    question: QuestionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_question = Question(
        title=question.title,
        body=question.body,
        owner_id=current_user.id
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


@app.get("/questions", response_model=List[QuestionOut])
def get_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).options(joinedload(Question.owner)).order_by(Question.created_at.desc()).all()
    return questions

@app.get("/questions/{question_id}/", response_model=QuestionOut)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).options(joinedload(Question.owner)).filter(Question.id == question_id).first()
    return question

@app.get("/questions/mine", response_model=List[QuestionOut])
def get_my_question(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    questions = db.query(Question).options(joinedload(Question.owner)).filter(Question.owner_id == current_user.id).order_by(Question.created_at.desc()).all()
    return questions




@app.post("/questions/{question_id}/answers", response_model=AnswerOut)
def create_answer(
    question_id: int,
    answer: AnswerCreate,
    db: Session =Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    db_answer = Answer(body = answer.body, owner_id=current_user.id, question_id = question_id)
    
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

@app.get("/answers/mine", response_model=List[AnswerWithQuestionOut])
def get_my_answers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    answers = (
        db.query(Answer)
        .options(joinedload(Answer.question))  # eager-load related question
        .filter(Answer.owner_id == current_user.id).order_by(Answer.created_at.desc())
        .all()
    )

    # Map the output to match the schema
    return [
        {
            "answer": answer,
            "question": answer.question
        }
        for answer in answers
    ]


@app.get("/questions/{question_id}/answers", response_model=List[AnswerOut])
def get_answers(
    question_id: int,
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == question_id).options(
        joinedload(Question.answers).joinedload(Answer.owner)).first()
    if not question:
        raise HTTPException(status_code = 404, detail = "Question not found")
    answer = db.query(Answer).filter(question_id == Answer.question_id).order_by(Answer.created_at.desc()).all()
    return answer


@app.post("/questions/{question_id}/upvote")
def upvote_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    existing_vote = db.query(QuestionVote).filter_by(
        user_id=current_user.id, question_id=question_id
    ).first()

    if existing_vote:
        if existing_vote.vote_type == VoteType.upvote:
            raise HTTPException(status_code=400, detail="You have already upvoted this question.")
        else:
            raise HTTPException(status_code=400, detail="You have already downvoted this question.")

    vote = QuestionVote(user_id=current_user.id, question_id=question_id, vote_type=VoteType.upvote)
    question.upvotes += 1
    db.add(vote)
    db.commit()
    db.refresh(question)

    return {"message": "Question upvoted", "upvotes": question.upvotes, "downvotes": question.downvotes}


@app.post("/questions/{question_id}/downvote")
def downvote_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    existing_vote = db.query(QuestionVote).filter_by(
        user_id=current_user.id, question_id=question_id
    ).first()

    if existing_vote:
        if existing_vote.vote_type == VoteType.downvote:
            raise HTTPException(status_code=400, detail="You have already downvoted this question.")
        else:
            raise HTTPException(status_code=400, detail="You have already upvoted this question.")

    vote = QuestionVote(user_id=current_user.id, question_id=question_id, vote_type=VoteType.downvote)
    question.downvotes += 1
    db.add(vote)
    db.commit()
    db.refresh(question)

    return {"message": "Question downvoted", "downvotes": question.downvotes}

@app.get("/questions/search", response_model=List[QuestionOut])
def search_questions(q: str = Query(...), db: Session = Depends(get_db)):
    questions = db.query(Question).options(joinedload(Question.owner)).filter(
        or_(
            Question.title.ilike(f"%{q}%"),
            Question.body.ilike(f"%{q}%"),
            Question.answers.any(Answer.body.ilike(f"%{q}%"))
        )
    ).all()
    return questions



@app.post("/question/{answer_id}/like")
def like_answer(
    answer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    answer =db.query(Answer).filter(Answer.id == answer_id).first()
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    
    answer.likes += 1
    db.commit()
    db.refresh(answer)
    return {"message": "Answer liked", "likes": answer.likes}


