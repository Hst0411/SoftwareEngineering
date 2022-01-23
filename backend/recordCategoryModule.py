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
    if recordCategoryDB.check_name_duplicate(userID, name, incomeOrExpense) != None:
        return jsonify({"Status": "error", "Msg": "名稱不得重複"}), 409
    recordCategoryDB.insert_doc(userID, name, incomeOrExpense)
    return jsonify({"Status": "ok", "Msg": "新增成功"}), 200


@appRecordCategory.route("/recordCategory/update-doc", methods=["PUT"])
@jwt_required()
def update_doc():
    # 前端檢查是否新增名字重複的類別
    body = request.get_json()
    userID = get_jwt_identity()
    old_name = body.get("old_name")
    old_incomeOrExpense = body.get("old_incomeOrExpense")

    new_name = body.get("new_name")

    if recordCategoryDB.check_name_duplicate(userID, new_name, old_incomeOrExpense) != None:
        return jsonify({"Status": "error", "Msg": "名稱不得重複"}), 409
    res = recordCategoryDB.update_doc(
        userID, old_name, old_incomeOrExpense, new_name)
    if res.acknowledged:
        return jsonify({"Status": "ok", "Msg": "編輯成功"}), 200

    return jsonify({"Status": "error", "Msg": "錯誤"}), 500


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

    # 檢查recordCategoryList是否為空
    print(res["recordCategoryList"])
    if len(res["recordCategoryList"]) == 0:
        return jsonify(category_res), 200

    # 將類別名稱拉出來塞到回傳資料
    for item in res["recordCategoryList"]:
        print(item["name"])
        category_res.append(item["name"])
    # 回傳收入或支出的類別名稱
    return jsonify(category_res), 200
