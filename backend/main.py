from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List

from parser import reg_to_postfix
from builder import postfix_to_nfa, nfa_to_dict, reset_counter

app = FastAPI()

# THIS SCALE IS GOING TOO FARRR
app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],        
    allow_headers=["*"],        # allow EVERYTHINGGGG
)

# class for what to expect from the frontend
class RegexRequest(BaseModel):
    regex: str

# class to define the transitions
class Transition(BaseModel):
    from_: str = Field(..., alias="from")
    to: str
    symbol: str

# class to define the WHOLE responseee
class NFAResponse(BaseModel):
    states: List[str]
    start: str
    accept: str
    transitions: List[Transition]

@app.post("/generate-nfa", response_model=NFAResponse)
async def generate_nfa(request: RegexRequest):

# @app.post("/", respon

    # at this point in time i realize i've overblown the scale of this project.
    reset_counter()
    
    # Convert regex to postfix
    postfix = reg_to_postfix(request.regex)
    print("post fix is", postfix)
    
    # Convert postfix to NFA
    nfa = postfix_to_nfa(postfix)
    
    # Convert NFA to dictionary format
    nfa_dict = nfa_to_dict(nfa)
    print(nfa_dict)
    
    return NFAResponse(**nfa_dict)
