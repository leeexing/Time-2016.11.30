# -*- coding: utf-8 -*-

from sqlalchemy import Column, String, create_engine, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):

    __tablename__ = 'user'

    id = Column(String(20), primary_key=True)
    name = Column(String(20))

    books = relationship('Book', backref='user')

    def __repr__(self):
        return f'<User {self.name}>'


class Book(Base):
    """书籍"""
    __tablename__ = 'book'

    id = Column(String(20), primary_key=True)
    name = Column(String(20))

    user_id = Column(String(20), ForeignKey('user.id'), default='1')


# 初始化数据库连接:
engine = create_engine('mysql+mysqlconnector://root:123456@localhost:3306/flask')
# 创建DBSession类型:
DBSession = sessionmaker(bind=engine)

def init_db():
    # 创建表到数据库中
    Base.metadata.create_all(engine)

# 执行创建表
# init_db()


def add_new_user():
    """添加用户"""
    session = DBSession()
    new_user = User(id='1', name='leeing')
    session.add(new_user)
    session.commit()
    session.close()


def add_new_book():
    """添加新书籍"""
    session = DBSession()
    new_book = Book(id='1', name='react掘金小册', user_id='1')
    session.add(new_book)
    session.commit()
    session.close()


def fetch_user():
    """查询用户"""
    session = DBSession()
    user = session.query(User).first()
    # data = User.query().all()
    print(user)
    print(user.books)
    print(user.books.first())
    session.close()


def fetch_book():
    """查询书籍"""
    session = DBSession()
    book = session.query(Book).first()
    print(book)
    print(book.user)
    print(book.user.name)
    session.close()


def fetch_user_join_book():
    """查询书籍"""
    session = DBSession()
    data = session.query(User).join(Book).all()
    print(data)
    session.close()


def main():
    """入口"""
    # add_new_user()
    # add_new_book()
    # fetch_user()
    # fetch_book()
    fetch_user_join_book()


if __name__ == '__main__':
    main()
