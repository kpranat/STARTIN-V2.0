from flask import Blueprint

adminAuth_bp = Blueprint(
    "adminAuth",
    __name__,
    url_prefix=""
)

from .import routes