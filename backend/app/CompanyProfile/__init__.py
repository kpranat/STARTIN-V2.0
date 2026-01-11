from flask import Blueprint

CompanyProfileSetup_bp = Blueprint(
    "CompanyProfile",
    __name__,
    url_prefix=""
)

from . import routes
