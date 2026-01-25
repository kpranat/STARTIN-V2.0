from flask import Blueprint

universityDbUpdate_bp = Blueprint(
    "universityDbUpdate",
    __name__,
    url_prefix=""
)

from . import routes  # prevent circular import