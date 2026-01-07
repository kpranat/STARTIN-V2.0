from flask import Blueprint

CompanySignin_bp = Blueprint(
    "CompanySignin",
    __name__
)

from . import routes #prevent circular import
