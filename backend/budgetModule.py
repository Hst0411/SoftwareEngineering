from flask import Flask, request, jsonify, Blueprint
from flask.blueprints import Blueprint
from pymongo import results


import budgetDB


appBudget = Blueprint('appBudget', __name__)


@appBudget.route("/budget/insert-doc", methods=["POST"])
def insert_doc():
    body = request.get_json()
    userID = body.get("userID")
    budgetName = body.get("budgetName")
    startdate = body.get("startDate")
    enddate = body.get("endDate")
    targetMoneyAmount = body.get("targetMoneyAmount")

    res = budgetDB.insert_doc(
        userID, budgetName, startdate, enddate, targetMoneyAmount)

    return "OK", 200


@appBudget.route("/budget/update-doc", methods=["PUT"])
def update_doc():
    body = request.get_json()
    userID = body.get("userID")
    budgetName = body.get("budgetName")
    id = body.get("id")
    startdate = body.get("startDate")
    enddate = body.get("endDate")
    targetMoneyAmount = body.get("targetMoneyAmount")

    res = budgetDB.update_doc(
        userID, budgetName, id, startdate, enddate, targetMoneyAmount)
    # 回傳該預算名稱及是否超支
    return res


@appBudget.route("/budget/delete-doc", methods=["DELETE"])
def delete_doc():
    body = request.args
    userID = body.get("userID")
    id = body.get("id")
    res = budgetDB.delete_doc(id, userID)
    return "ok", 200


@appBudget.route("/budget/get-docs", methods=["GET"])
def get_docs():
    body = request.args
    userID = body.get("userID")
    res = budgetDB.get_docs(userID)
    temp_res = list()
    for item in res:
        temp_res.append(item)
    return jsonify(temp_res), 200


@appBudget.route("/budget/get-available-budget", methods=["GET"])
def get_available_budget_name():
    body = request.args
    userID = body.get("userID")
    year = body.get("year")
    month = body.get("month")
    day = body.get("day")
    temp_res = budgetDB.get_available_budget_name(userID, year, month, day)
    result = list()
    for item in temp_res:
        result.append(item["budgetName"])
    return jsonify(result), 200
