from flask import Blueprint

CompanySignup_bp = Blueprint(
    "CompanySignup",
    __name__
)

from . import routes #prevent circular import