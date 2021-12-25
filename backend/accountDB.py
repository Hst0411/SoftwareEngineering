from datetime import datetime
import uuid
from bson.son import SON
from flask.json import jsonify
from pymongo import MongoClient, DESCENDING
from bson.objectid import ObjectId
from uuid import uuid4



import mainDB
import config
import recordDB


# 新增帳戶
def insert_doc(userID, accountName, leftMoneyAmount):
    doc = {
        "_id": str(uuid.uuid4()),
        "userID": userID,
        "accountName": accountName,
        "leftMoneyAmount": leftMoneyAmount,
        "transferRecord": []
    }
    return mainDB.DB.get_collection(config.accountCol).insert_one(doc)


# 更新帳戶資訊
def update_doc(id, userID, accountName, leftMoneyAmount):
    query = {
        "_id": id,
        "userID": userID
    }
    newValue = {
        "accountName": accountName,
        #"leftMoneyAmount": leftMoneyAmount
    }
    # 更新transferRecord、record名稱
    old_accountName = mainDB.DB.get_collection(config.accountCol).find_one(query)["accountName"]
    query2 = {
        "userID": userID,
        "transferRecord.targetAccountName": old_accountName
    }
    """
    for i in get_accountNames(userID):
        temp_ac = get_oneAccountInfo(userID, i)
        for item in temp_ac:
            if item == old_accountName:
                mainDB.DB.get_collection(config.accountCol).update_many(query2, {"$set": {"transferRecord.$.targetAccountName": accountName}})
    """
    mainDB.DB.get_collection(config.accountCol).update_many(query2, {"$set": {"transferRecord.$.targetAccountName": accountName}})
    recordDB.account_revise(userID, old_accountName, accountName)
    return mainDB.DB.get_collection(config.accountCol).update_one(query, {"$set": newValue})


# 刪除帳戶
def delete_doc(id, userID):
    query = {
        "_id": id,
        "userID": userID
    }
    accountName = mainDB.DB.get_collection(config.accountCol).find_one(query)["accountName"]
    #目前刪除此帳戶的話，別的帳戶的轉帳紀錄的此名字會出問題
    #待解決
    recordDB.account_delete(userID, accountName)
    return mainDB.DB.get_collection(config.accountCol).delete_one(query)


# 取得個別帳戶轉帳紀錄
def get_oneAccountInfo(userID, accountName):
    query = {
        "userID": userID,
        "accountName": accountName
    }
    return mainDB.DB.get_collection(config.accountCol).find_one(query, {"_id": 0, "transferRecord": 1})


# 帳戶間轉帳
def transfer(userID, accountName, transferFromOrTo, targetAccountName, transferDate, transferMoneyAmount):
    query = {
        "userID": userID,
        "accountName": accountName
    }
    if transferFromOrTo == "From":
        mainDB.DB.get_collection(config.accountCol).find_one_and_update(query, {"$inc": {"leftMoneyAmount": transferMoneyAmount}})
    else:
        mainDB.DB.get_collection(config.accountCol).find_one_and_update(query, {"$inc": {"leftMoneyAmount": -transferMoneyAmount}})
    doc = {
        "_id": str(uuid.uuid4()),
        "transferFromOrTo": transferFromOrTo,
        "targetAccountName": targetAccountName,
        "transferDate": datetime(transferDate["year"], transferDate["month"], transferDate["day"], transferDate["hour"], transferDate["minute"]),
        "transferMoneyAmount": transferMoneyAmount
    }
    return mainDB.DB.get_collection(config.accountCol).update_one(query, {"$push": {"transferRecord": doc}})


# 取得帳戶名稱
def get_accountNames(userID):
    temp = mainDB.DB.get_collection(config.accountCol).find({"userID": userID}, {"_id": 0, "accountName": 1})
    result = list()
    for item in temp:
        result.append(item["accountName"])
    return result


# 取得某位使用者的所有帳戶資料
def get_docs(userID):
    query = {
        "userID": userID
    }
    return mainDB.DB.get_collection(config.accountCol).find(query)



def record_revise_doc_decrease(userID, old_accountName, old_moneyAmount):
    query = {
        "userID": userID,
        "accountName": old_accountName
    }
    mainDB.DB.get_collection(config.accountCol).update_one(query, {"$inc": {"leftMoneyAmount": -old_moneyAmount}})

def record_revise_doc_increase(userID, new_accountName, new_moneyAmount):
    query = {
        "userID": userID,
        "accountName": new_accountName
    }
    mainDB.DB.get_collection(config.accountCol).update_one(query, {"$inc": {"leftMoneyAmount": new_moneyAmount}})
