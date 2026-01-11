from flask import Blueprint

StudentProfile_bp = Blueprint(
    "StudentProfile",
    __name__,
    url_prefix=""
)

from . import routes