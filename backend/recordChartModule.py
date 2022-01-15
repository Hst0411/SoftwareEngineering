from flask import Flask, json, request, jsonify, Blueprint
from flask.blueprints import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

import recordChartDB


appRecordChart = Blueprint('appRecordChart', __name__)


@appRecordChart.route("/recordChart/get-months-compare-with-incomeExpense", methods=["GET"])
@jwt_required()
def get_months_compare_with_incomeExpense():
    userID = get_jwt_identity()
    res = recordChartDB.get_months_compare(userID)
    return jsonify(res), 200


@appRecordChart.route("/recordChart/get-category-compare", methods=["GET"])
@jwt_required()
def get_expense_category_compare():
    userID = get_jwt_identity()
    incomeOrExpense = request.args.get("incomeOrExpense")
    startDateYear = request.args.get("startDateYear")
    startDateMonth = request.args.get("startDateMonth")
    startDateDay = request.args.get("startDateDay")
    endDateYear = request.args.get("endDateYear")
    endDateMonth = request.args.get("endDateMonth")
    endDateDay = request.args.get("endDateDay")
    res = recordChartDB.get_category_compare(
        userID, incomeOrExpense, startDateYear, startDateMonth, startDateDay, endDateYear, endDateMonth, endDateDay)
    return jsonify(res), 200
