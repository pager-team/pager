from flask import Blueprint, jsonify
import src.pager.models as models

pager = Blueprint("pager", __name__, url_prefix="/pager") 

@pager.route("/<int:id>", methods=["GET"])
def pager_id(id):
    pager = models.get_pager(id)
    return jsonify(pager)

@pager.route("/", methods=["GET"])
def pagers():
    pagers = models.get_pagers()
    return jsonify(pagers)