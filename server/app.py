from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/users/{user_id}")
def read_user(user_id: int):
    user = {"id": user_id, "name": "John Doe"}
    return user

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)