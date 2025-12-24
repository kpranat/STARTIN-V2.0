from flask import Blueprint

StudentSignup_bp = Blueprint(
    "StudentSignup",
    __name__
)

from . import routes #prevent circular import
