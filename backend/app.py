from fastapi import FastAPI 
import uvicorn 
from pydantic import BaseModel 
from datetime import date
from typing import List 


app = FastAPI()

class Book(BaseModel):
    name:str
    borrow_date:date
    max_borrow_days:int = 60

class Person(BaseModel):
    name:str
    email:str
    phone_number:str
    borrowed_books:List[Book]


@app.get("/")
def home():
    return {"message":"Welcome Home"} 

if __name__ == "__main__":
    uvicorn.run('app:app', port = 8000, host = '0.0.0.0', reload=True) 