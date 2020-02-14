from sqlalchemy import DateTime, Column, func
from app import db


class Base(db.Model):
    __abstract__ = True
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    def __init__(self, *args):
        if len(args) != 0:
            self.__dict__.update(args[0])

    def as_dict(self):
        return {x.name: getattr(self, x.name) for x in self.__table__.columns}


    def update_with_dict(self,d):
        for key, value in d.items():
            setattr(self, key, value)