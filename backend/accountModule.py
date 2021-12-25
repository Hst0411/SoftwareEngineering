from flask import Flask, request, jsonify, Blueprint
from flask.blueprints import Blueprint


import accountDB


appAccount = Blueprint('appAccount', __name__)


@appAccount.route("/account/insert-doc", methods=["POST"])
def insert_doc():
    body = request.get_json()
    userID = body.get("userID")
    accountName = body.get("accountName")
    leftMoneyAmount = body.get("leftMoneyAmount")
    res = accountDB.insert_doc(userID, accountName, leftMoneyAmount)
    if res.acknowledged:
        return "Inserted", 200
    return "Error", 500


@appAccount.route("/account/update-doc", methods=["PUT"])
def update_doc():
    body = request.get_json()
    id = body.get("id")
    userID = body.get("userID")
    accountName = body.get("accountName")
    #leftMoneyAmount = body.get("leftMoneyAmount")
    res = accountDB.update_doc(id, userID, accountName, leftMoneyAmount=None)

    if res.acknowledged:
        return "Updated", 200
    return "Error", 500


@appAccount.route("/account/delete-doc", methods=["DELETE"])
def delete_doc():
    id = request.args.get("id")
    userID = request.args.get("userID")
    res = accountDB.delete_doc(id, userID)
    if res.acknowledged:
        return "Deleted", 200
    return "Error", 500


@appAccount.route("/account/transfer/get-transferInfo", methods=["GET"])
def get_transferInfo():
    userID = request.args.get("userID")
    accountName = request.args.get("accountName")
    res = accountDB.get_oneAccountInfo(userID, accountName)
    return jsonify(res["transferRecord"]), 200


@appAccount.route("/account/transfer/post-doc", methods=["POST"])
def post_doc():
    body = request.get_json()
    userID = body.get("userID")
    accountName = body.get("accountName")
    transferFromOrTo = body.get("transferFromOrTo")
    targetAccountName = body.get("targetAccountName")
    transferDate = body.get("transferDate")
    transferMoneyAmount = body.get("transferMoneyAmount")
    res1 = accountDB.transfer(userID, accountName, transferFromOrTo, targetAccountName, transferDate, transferMoneyAmount)
    opp_transferFromOrTo = "To" if transferFromOrTo == "From" else "From"
    res2 = accountDB.transfer(userID, targetAccountName, opp_transferFromOrTo, accountName, transferDate, transferMoneyAmount)
    if res1.acknowledged and res2.acknowledged:
        return "Inserted", 200
    return "Error", 500


@appAccount.route("/account/get-name", methods=["GET"])
def get_name():
    userID = request.args.get("userID")
    return jsonify(accountDB.get_accountNames(userID)), 200


@appAccount.route("/account/get-docs", methods=["GET"])
def get_docs():
    userID = request.args.get("userID")
    res = accountDB.get_docs(userID)
    temp_res = list()
    for item in res:
        temp_res.append(item)
    return jsonify(temp_res), 200
