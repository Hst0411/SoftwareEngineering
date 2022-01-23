from flask import Flask, request, jsonify, Blueprint
from flask.blueprints import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity


import recordDB
import budgetDB
import accountDB

appRecord = Blueprint('appRecord', __name__)


@appRecord.route("/record/insert-doc", methods=["POST"])
@jwt_required()
def insert_doc():
    body = request.get_json()
    userID = get_jwt_identity()
    name = body.get("name")
    incomeOrExpense = body.get("incomeOrExpense")
    category = body.get("category")
    date = body.get("date")
    moneyAmount = body.get("moneyAmount")
    accountName = body.get("accountName")
    budgetName = body.get("budgetName")
    res = recordDB.insert_doc(userID, name, incomeOrExpense, category,
                              date, moneyAmount, accountName, budgetName)

    # section for revise account collection
    if incomeOrExpense == "支出":
        accountDB.record_revise_doc_decrease(userID, accountName, moneyAmount)
    else:
        accountDB.record_revise_doc_increase(userID, accountName, moneyAmount)
    # section for revise budget collection
    overSpend = budgetDB.record_revise_doc_increase(
        userID, budgetName, moneyAmount)

    # 回傳預算名稱及該項是否超支
    return {"Status": "special", "budgetName": budgetName, "overSpend": overSpend}, 200


@appRecord.route("/record/update-doc", methods=["PUT"])
@jwt_required()
def update_doc():
    body = request.get_json()
    # 帳目紀錄ID和使用者ID不會更動，用作query條件
    query = {
        "_id": body.get("id"),
        "userID": get_jwt_identity()
    }
    userID = get_jwt_identity()
    # 取得資料欄位
    new_para = dict()
    new_para["name"] = body.get("new_name")
    new_para["category"] = body.get("new_category")
    new_para["date"] = body.get("new_date")
    new_para["moneyAmount"] = body.get("new_moneyAmount")
    new_para["accountName"] = body.get("new_accountName")
    new_para["budgetName"] = body.get("new_budgetName")
    print(new_para)

    # 先取得修改前的資料
    before_update_doc = recordDB.get_before_update_doc(query)
    # 再修改資料為新的資料
    res = recordDB.update_doc(query, new_para)

    old_moneyAmount = before_update_doc["moneyAmount"]
    old_accountName = before_update_doc["accountName"]
    old_budgetName = before_update_doc["budgetName"]
    new_moneyAmount = new_para["moneyAmount"]
    new_accountName = new_para["accountName"]
    new_budgetName = new_para["budgetName"]

    # 根據支出或收入調整傳入帳戶的參數
    if before_update_doc["incomeOrExpense"] == "支出":
        decrease_accountName_para = new_accountName
        decrease_moneyAmount_para = new_moneyAmount
        increase_accountName_para = old_accountName
        increase_moneyAmount_para = old_moneyAmount
    else:
        decrease_accountName_para = old_accountName
        decrease_moneyAmount_para = old_moneyAmount
        increase_accountName_para = new_accountName
        increase_moneyAmount_para = new_moneyAmount
    # 回傳給前端是否超支的變數
    overSpend = False
    # 利用舊資料和新資料檢查是否有修改金額、個人帳戶、預算來執行相對應的個人帳戶及預算項目的修改
    if float(old_moneyAmount) != float(new_moneyAmount):
        if old_accountName != new_accountName:
            print("有修改金額、有修改個人帳戶")
            # section for revise account collection
            accountDB.record_revise_doc_decrease(
                userID, decrease_accountName_para, decrease_moneyAmount_para)
            accountDB.record_revise_doc_increase(
                userID, increase_accountName_para, increase_moneyAmount_para)
        else:
            print("有修改金額、無修改個人帳戶")
            # section for revise account collection
            accountDB.record_revise_doc_decrease(
                userID, decrease_accountName_para, decrease_moneyAmount_para)
            accountDB.record_revise_doc_increase(
                userID, increase_accountName_para, increase_moneyAmount_para)

        if old_budgetName != new_budgetName:
            print("有修改金額、有修改個人預算")
            # section for revise budget collection
            budgetDB.record_revise_doc_decrease(
                userID, old_budgetName, old_moneyAmount)
            overSpend = budgetDB.record_revise_doc_increase(
                userID, new_budgetName, new_moneyAmount)
        else:
            print("有修改金額、無修改個人預算")
            # section for revise budget collection
            budgetDB.record_revise_doc_decrease(
                userID, old_budgetName, old_moneyAmount)
            overSpend = budgetDB.record_revise_doc_increase(
                userID, old_budgetName, new_moneyAmount)
    else:
        if old_accountName != new_accountName:
            print("無修改金額、有修改個人帳戶")
            # section for revise account collection
            accountDB.record_revise_doc_decrease(
                userID, decrease_accountName_para, decrease_moneyAmount_para)
            accountDB.record_revise_doc_increase(
                userID, increase_accountName_para, increase_moneyAmount_para)

        if old_budgetName != new_budgetName:
            print("無修改金額、有修改個人預算")
            # section for revise budget collection
            budgetDB.record_revise_doc_decrease(
                userID, old_budgetName, old_moneyAmount)
            overSpend = budgetDB.record_revise_doc_increase(
                userID, new_budgetName, old_moneyAmount)

    if res.acknowledged:
        return {"Status": "special", "budgetName": new_budgetName, "overSpend": overSpend}, 200

    return "Error", 500


@appRecord.route("/record/delete-doc", methods=["DELETE"])
@jwt_required()
def delete_doc():
    id = request.args.get("id")
    userID = get_jwt_identity()

    res = recordDB.delete_doc(id, userID)

    # section for revise account collection
    if res["incomeOrExpense"] == "支出":
        accountDB.record_revise_doc_increase(
            userID, res["accountName"], res["moneyAmount"])
    else:
        accountDB.record_revise_doc_decrease(
            userID, res["accountName"], res["moneyAmount"])

    # section for revise budget collection
    # 需檢查res是否為空?
    budgetDB.record_revise_doc_decrease(
        userID, res["budgetName"], res["moneyAmount"])

    # if res.acknowledged:
    return "Deleted", 200

    # return "Error", 500


@appRecord.route("/record/get-docs", methods=["GET"])
@jwt_required()
def get_docs():
    args = request.args
    userID = get_jwt_identity()
    incomeOrExpense = args.get("incomeOrExpense")
    date = dict()
    date = {
        "year": args.get("year"),
        "month": args.get("month"),
        "day": args.get("day"),
    }

    res = recordDB.get_docs(userID, incomeOrExpense, date)

    return jsonify(res), 200


@appRecord.route("/record/get-csv", methods=["GET"])
@jwt_required()
def get_csv():
    userID = get_jwt_identity()
    res = recordDB.get_csv(userID)
    return jsonify(res), 200
