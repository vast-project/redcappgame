from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from settings import DATABASE_URL, debug

engine = create_engine(DATABASE_URL, echo=debug, pool_size=10, max_overflow=20)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
