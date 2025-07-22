from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum


class VoteType(str, Enum):
    upvote = "upvote"
    downvote = "downvote"


class QuestionVoteCreate(BaseModel):
    question_id: int
    vote_type: VoteType


class QuestionVoteResponse(BaseModel):
    id: int
    question_id: int
    vote_type: VoteType
    user_id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email : EmailStr
    password : str
    username : str
    
class UserOut(BaseModel):
    id : int
    email : EmailStr
    username : str
    
    class Config:
        from_attributes : True
        
class Login(BaseModel):
    email : EmailStr
    password : str
    
class QuestionCreate(BaseModel):
    title: str
    body: str
    
class UserOutSmall(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True
        
        
class QuestionOut(BaseModel):
    id: int
    title: str
    body: str
    created_at: datetime
    owner: UserOutSmall 
    upvotes : int
    downvotes : int 
    
    class Config:
        from_attributes = True
        
class AnswerCreate(BaseModel):
    body: str
    
class AnswerOut(BaseModel):
    id : int
    body: str
    created_at: datetime
    question_id: int
    owner: UserOutSmall
    
    class Config:
        from_attributes = True
        
  
class QuestionOutSmall(BaseModel):
    id: int
    title: str
    body: str

    class Config:
        from_attributes = True

class AnswerWithQuestionOut(BaseModel):
    answer: AnswerOut
    question: QuestionOutSmall      

