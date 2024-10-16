#---
# To build: uvicorn myapi:app --reload
#---


from fastapi import FastAPI, Path
from typing import Optional
from pydantic import BaseModel

app = FastAPI()

# A quick definition of all possible API requests
# GET - GET AN INFORMATOIN
# POST - CREATE SOMETHING NEW
# PUT - UPDATE
# DELETE - DELETE SOMETHING 

#Creating a students python dictionary??
students ={
    1:{
    "name": "Shadi", 
    "age": "19", 
    "year": "Year 2"
    }
}
class Student(BaseModel):
    name: str
    age: int
    year: str

# Get request
# This creates a get request that is defaulted to just the hosted server: 127.0.0.8000/ where / loads the info
@app.get("/")
def index():
    return students

#Note the app.get(..) is an end-point

@app.get("/get-student/{student_id}")
# Cannot take string or boolean, I don't even think double it will accept but we can test
#Will take int value as end-point parameter
#The will return the corresponding entry in the python dictionary

#Path Parameters cannot have a default value
def get_students(student_id: int):
    return students[student_id]

#Now exploring QUERY PARAMETERS

@app.get("/get-by-name/{student_id}")
# The query parameters are definted inside the function
# The *, allows us to place in any order, OPTIONAL AND REQUIRED QUERY PARAMETER
def get_student(*, student_id : int, name: Optional[str] = None, test: int):
    for student_id in students:
        if students[student_id]["name"] == name:
            return students[student_id]
    return {"Data": "Not found"}

# This is a an END-POINT PARAMETER
# Can also be referenced as a PATH PARAMETER
@app.post("/create-student/{student_id}")
def create(student_id: int, student: Student):
    if student_id in students:
        return {"Error": "Student exists"}

    students[student_id] = student
    return students[student_id]