from flask import Blueprint

JobDetails_bp = Blueprint(
    "JobDetails",
    __name__
)

from .import routes #prevent circular import