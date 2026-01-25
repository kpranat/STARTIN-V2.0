from flask import Blueprint

CompanyManagement_bp = Blueprint('CompanyManagement', __name__)

from . import routes
