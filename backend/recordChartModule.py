from flask import Flask, json, request, jsonify, Blueprint
from flask.blueprints import Blueprint

import recordChartDB


appRecordChart = Blueprint('appRecordChart', __name__)


@appRecordChart.route("/recordChart/get-months-compare-with-incomeExpense", methods=["GET"])
def get_months_compare_with_incomeExpense():
    userID = request.args.get("userID")
    res = recordChartDB.get_months_compare(userID)
    return jsonify(res), 200


@appRecordChart.route("/recordChart/get-category-compare", methods=["GET"])
def get_expense_category_compare():
    userID = request.args.get("userID")
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
