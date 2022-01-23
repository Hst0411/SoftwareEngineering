from flask import Flask, request, jsonify, Blueprint
from flask.blueprints import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity


import accountDB


appAccount = Blueprint('appAccount', __name__)


@appAccount.route("/account/insert-doc", methods=["POST"])
@jwt_required()
def insert_doc():
    body = request.get_json()
    userID = get_jwt_identity()
    accountName = body.get("accountName")
    leftMoneyAmount = body.get("leftMoneyAmount")
    if accountDB.check_name_duplicate(userID, accountName) != None:
        return jsonify({"Status": "error", "Msg": "名稱不得重複"}), 409
    res = accountDB.insert_doc(userID, accountName, leftMoneyAmount)
    if res.acknowledged:
        return jsonify({"Status": "ok", "Msg": "新增成功"}), 200
    
    return jsonify({"Status": "error", "Msg": "錯誤"}), 500


@appAccount.route("/account/update-doc", methods=["PUT"])
@jwt_required()
def update_doc():
    body = request.get_json()
    id = body.get("id")
    userID = get_jwt_identity()
    accountName = body.get("accountName")

    check = accountDB.check_name_duplicate(userID, accountName)
    if check != None:
        if check["_id"] != id:
            return jsonify({"Status": "error", "Msg": "名稱不得重複"}), 409
    
    res = accountDB.update_doc(id, userID, accountName)
    if res.acknowledged:
        return jsonify({"Status": "ok", "Msg": "編輯成功"}), 200
    return jsonify({"Status": "error", "Msg": "錯誤"}), 500


@appAccount.route("/account/delete-doc", methods=["DELETE"])
@jwt_required()
def delete_doc():
    id = request.args.get("id")
    userID = get_jwt_identity()
    res = accountDB.delete_doc(id, userID)
    if res.acknowledged:
        return "Deleted", 200
    return "Error", 500


@appAccount.route("/account/transfer/get-transferInfo", methods=["GET"])
@jwt_required()
def get_transferInfo():
    userID = get_jwt_identity()
    accountName = request.args.get("accountName")
    res = accountDB.get_oneAccountInfo(userID, accountName)
    return jsonify(res["transferRecord"]), 200


@appAccount.route("/account/transfer/post-doc", methods=["POST"])
@jwt_required()
def post_doc():
    body = request.get_json()
    userID = get_jwt_identity()
    accountName = body.get("accountName")
    transferFromOrTo = body.get("transferFromOrTo")
    targetAccountName = body.get("targetAccountName")
    transferDate = body.get("transferDate")
    transferMoneyAmount = body.get("transferMoneyAmount")
    res1 = accountDB.transfer(userID, accountName, transferFromOrTo,
                              targetAccountName, transferDate, transferMoneyAmount)
    opp_transferFromOrTo = "To" if transferFromOrTo == "From" else "From"
    res2 = accountDB.transfer(userID, targetAccountName, opp_transferFromOrTo,
                              accountName, transferDate, transferMoneyAmount)
    if res1.acknowledged and res2.acknowledged:
        return "Inserted", 200
    return "Error", 500


@appAccount.route("/account/get-name", methods=["GET"])
@jwt_required()
def get_name():
    userID = get_jwt_identity()
    return jsonify(accountDB.get_accountNames(userID)), 200


@appAccount.route("/account/get-docs", methods=["GET"])
@jwt_required()
def get_docs():
    userID = get_jwt_identity()
    res = accountDB.get_docs(userID)
    temp_res = list()
    for item in res:
        temp_res.append(item)
    return jsonify(temp_res), 200
