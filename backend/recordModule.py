from flask import Flask, request, jsonify, Blueprint
from flask.blueprints import Blueprint


import recordDB
import budgetDB
import accountDB

appRecord = Blueprint('appRecord', __name__)


@appRecord.route("/record/insert-doc", methods=["POST"])
def insert_doc():
    body = request.get_json()
    userID = body.get("userID")
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
    accountDB.record_revise_doc_decrease(userID, accountName, moneyAmount)
    # section for revise budget collection
    overSpend = budgetDB.record_revise_doc_increase(
        userID, budgetName, moneyAmount)

    # 回傳預算名稱及該項是否超支
    return {"budgetName": budgetName, "overSpend": overSpend}, 200


@appRecord.route("/record/update-doc", methods=["PUT"])
def update_doc():
    body = request.get_json()
    # 帳目紀錄ID和使用者ID不會更動，用作query條件
    query = {
        "_id": body.get("id"),
        "userID": body.get("userID")
    }
    userID = body.get("userID")
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

    # 回傳給前端是否超支的變數
    overSpend = False
    # 利用舊資料和新資料檢查是否有修改金額、個人帳戶、預算來執行相對應的個人帳戶及預算項目的修改
    if float(old_moneyAmount) != float(new_moneyAmount):
        if old_accountName != new_accountName:
            print("有修改金額、有修改個人帳戶")
            # section for revise account collection
            accountDB.record_revise_doc_decrease(
                userID, old_accountName, old_moneyAmount)
            accountDB.record_revise_doc_increase(
                userID, new_accountName, new_moneyAmount)
        else:
            print("有修改金額、無修改個人帳戶")
            # section for revise account collection
            accountDB.record_revise_doc_decrease(
                userID, old_accountName, old_moneyAmount)
            accountDB.record_revise_doc_increase(
                userID, old_accountName, new_moneyAmount)

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
                userID, old_accountName, old_moneyAmount)
            accountDB.record_revise_doc_increase(
                userID, new_accountName, old_moneyAmount)

        if old_budgetName != new_budgetName:
            print("無修改金額、有修改個人預算")
            # section for revise budget collection
            budgetDB.record_revise_doc_decrease(
                userID, old_budgetName, old_moneyAmount)
            overSpend = budgetDB.record_revise_doc_increase(
                userID, new_budgetName, old_moneyAmount)

    if res.acknowledged:
        return {"budgetName": new_budgetName, "overSpend": overSpend}, 200

    return "Error", 500


@appRecord.route("/record/delete-doc", methods=["DELETE"])
def delete_doc():
    id = request.args.get("id")
    userID = request.args.get("userID")

    res = recordDB.delete_doc(id, userID)
    # section for revise account collection
    accountDB.record_revise_doc_increase(
        userID, res["accountName"], res["moneyAmount"])
    # section for revise budget collection
    # 需檢查res是否為空?
    budgetDB.record_revise_doc_decrease(
        userID, res["budgetName"], res["moneyAmount"])

    # if res.acknowledged:
    return "Deleted", 200

    # return "Error", 500


@appRecord.route("/record/get-docs", methods=["GET"])
def get_docs():
    args = request.args
    userID = args.get("userID")
    incomeOrExpense = args.get("incomeOrExpense")
    date = dict()
    date = {
        "year": args.get("year"),
        "month": args.get("month"),
        "day": args.get("day"),
    }

    res = recordDB.get_docs(userID, incomeOrExpense, date)

    return jsonify(res), 200
