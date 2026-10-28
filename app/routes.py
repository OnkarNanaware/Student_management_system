from flask import (
    Blueprint,
    render_template,
    request,
    jsonify
)

from app import db
from app.models import Complaint


main = Blueprint(
    "main",
    __name__
)


@main.route("/")
def home():

    return render_template("index.html")


@main.route("/health")
def health():

    return jsonify({
        "status": "healthy",
        "service": "smart-campus",
        "version": "1.0"
    })


@main.route("/api/complaints", methods=["GET"])
def get_complaints():

    complaints = Complaint.query.order_by(
        Complaint.id.desc()
    ).all()

    return jsonify([
        complaint.to_dict()
        for complaint in complaints
    ])


@main.route("/api/complaints", methods=["POST"])
def create_complaint():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    student_name = data.get("student_name")
    category = data.get("category")
    description = data.get("description")

    if not student_name:
        return jsonify({
            "error": "Student name is required"
        }), 400

    if not category:
        return jsonify({
            "error": "Category is required"
        }), 400

    if not description:
        return jsonify({
            "error": "Description is required"
        }), 400

    complaint = Complaint(
        student_name=student_name,
        category=category,
        description=description
    )

    db.session.add(complaint)
    db.session.commit()

    return jsonify({
        "message": "Complaint submitted successfully",
        "complaint": complaint.to_dict()
    }), 201


@main.route(
    "/api/complaints/<int:complaint_id>/status",
    methods=["PUT"]
)
def update_status(complaint_id):

    complaint = Complaint.query.get_or_404(
        complaint_id
    )

    data = request.get_json()

    complaint.status = data.get(
        "status",
        complaint.status
    )

    db.session.commit()

    return jsonify({
        "message": "Status updated",
        "complaint": complaint.to_dict()
    })
