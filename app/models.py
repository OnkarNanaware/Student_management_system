from app import db


class Complaint(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_name = db.Column(
        db.String(100),
        nullable=False
    )

    category = db.Column(
        db.String(50),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    status = db.Column(
        db.String(30),
        default="Open"
    )

    def to_dict(self):

        return {
            "id": self.id,
            "student_name": self.student_name,
            "category": self.category,
            "description": self.description,
            "status": self.status
        }
