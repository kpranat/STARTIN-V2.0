from flask import Blueprint

StudentSignin_bp = Blueprint(
    "StudentSignin",
    __name__
)

from . import routes #prevent circular import
