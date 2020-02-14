from app import db
from datetime import datetime

class ActionForward(db.Model):
    __tablename__ = 'xe_action_forward'
    __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    act = db.Column(db.String(30), primary_key=True, unique=True)
    module = db.Column(db.String(30))
    type = db.Column(db.String(100))

    def __init__(self, act, module,type):
        self.act = act
        self.module = module
        self.type = type


    def __repr__(self):
        return 'act : %s, module : %s, type : %s' % (self.act, self.module, self.type)

    def as_dict(self):
        return {x.name: getattr(self, x.name) for x in self.__table__.columns}
