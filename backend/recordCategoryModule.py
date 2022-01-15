from flask import Flask, request, jsonify, Blueprint
from flask.blueprints import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

import recordCategoryDB


appRecordCategory = Blueprint('appRecordCategory', __name__)


@appRecordCategory.route("/recordCategory/insert-doc", methods=["POST"])
@jwt_required()
def insert_doc():
    # 前端檢查是否新增名字重複的類別
    body = request.get_json()
    userID = get_jwt_identity()
    name = body.get("name")
    incomeOrExpense = body.get("incomeOrExpense")
    recordCategoryDB.insert_doc(userID, name, incomeOrExpense)
    return "OK", 200


@appRecordCategory.route("/recordCategory/update-doc", methods=["PUT"])
@jwt_required()
def update_doc():
    # 前端檢查是否新增名字重複的類別
    body = request.get_json()
    userID = get_jwt_identity()
    old_name = body.get("old_name")
    old_incomeOrExpense = body.get("old_incomeOrExpense")

    new_name = body.get("new_name")
    res = recordCategoryDB.update_doc(
        userID, old_name, old_incomeOrExpense, new_name)
    if res.acknowledged:
        return "Updated!", 200

    return "Error", 500


@appRecordCategory.route("/recordCategory/delete-doc", methods=["DELETE"])
@jwt_required()
def delete_doc():
    # 前端檢查是否新增名字重複的類別
    userID = get_jwt_identity()
    name = request.args.get("name")
    incomeOrExpense = request.args.get("incomeOrExpense")
    res = recordCategoryDB.delete_doc(userID, name, incomeOrExpense)
    if res.acknowledged:
        return "Deleted", 200

    return "Error", 500



@appRecordCategory.route("/recordCategory/get-docs", methods=["GET"])
@jwt_required()
def get_docs():
    userID = get_jwt_identity()
    incomeOrExpense = request.args.get("incomeOrExpense")
    res = recordCategoryDB.get_docs(userID, incomeOrExpense)
    category_res = []
    # 預設類別名稱
    if incomeOrExpense == "支出":
        category_res = ["飲食", "交通", "娛樂", "購物", "生活", "學習", "其他"]
    elif incomeOrExpense == "收入":
        category_res = ["薪水", "獎金", "投資", "利息", "錢包", "其他"]

    # 轉換成list(array)形式，僅回傳收入或支出的類別名稱
    if len(list(res)) == 0:
        return jsonify(category_res), 200
    for item in list(res).pop(0)["recordCategoryList"]:
        category_res.append(item["name"])
    return jsonify(category_res), 200
