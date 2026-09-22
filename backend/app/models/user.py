from sqlalchemy import Column,Integer,String,Boolean,DateTime,ForeignKey
from app.database.database import Base

class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)
    full_name=Column(String,nullable=False)
    email=Column(String,unique=True,index=True,nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="user")
    department_id=Column(Integer,ForeignKey("departments.id"), nullable=True,)
    is_active = Column(Boolean, default=True)