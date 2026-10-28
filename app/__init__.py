from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from prometheus_flask_exporter import PrometheusMetrics

db = SQLAlchemy()


def create_app():

    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///complaints.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    PrometheusMetrics(
        app,
        group_by="endpoint"
    )

    from app.routes import main

    app.register_blueprint(main)

    with app.app_context():
        db.create_all()

    return app
