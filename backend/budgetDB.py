from datetime import datetime
import uuid
from bson.son import SON
from flask.json import jsonify
from pymongo import MongoClient, DESCENDING
from bson.objectid import ObjectId
from uuid import uuid4
from pymongo.collection import ReturnDocument


import mainDB
import config
import recordDB


def insert_doc(userID, budgetName, startdate, enddate, targetMoneyAmount):
    id = str(uuid4())
    doc = {
        "_id": id,
        "userID": userID,
        "budgetName": budgetName,
        "startDate": datetime(startdate["year"], startdate["month"], startdate["day"]),
        "endDate": datetime(enddate["year"], enddate["month"], enddate["day"]),
        "targetMoneyAmount": targetMoneyAmount,
        "usedMoneyAmount": 0,
        "overSpend": False
    }
    return mainDB.DB.get_collection(config.budgetCol).insert_one(doc)


def update_doc(userID, budgetName, id, startdate, enddate, targetMoneyAmount):
    query = {
        "userID": userID,
        "_id": id
    }
    doc = {
        "budgetName": budgetName,
        "startDate": datetime(startdate["year"], startdate["month"], startdate["day"]),
        "endDate": datetime(enddate["year"], enddate["month"], enddate["day"]),
        "targetMoneyAmount": targetMoneyAmount
    }
    old_doc = mainDB.DB.get_collection(config.budgetCol).find_one_and_update(
        query, {"$set": doc}, return_document=ReturnDocument.BEFORE)
    recordDB.budget_revise(
        userID, old_doc["budgetName"], budgetName, startdate, enddate)
    if old_doc["usedMoneyAmount"] >= targetMoneyAmount * 0.75:
        mainDB.DB.get_collection(config.budgetCol).update_one(
            query, {"$set": {"overSpend": True}})
        return {"Status": "special", "budgetName": budgetName, "overSpend": True}
    else:
        mainDB.DB.get_collection(config.budgetCol).update_one(
            query, {"$set": {"overSpend": False}})
        return {"Status": "ok", "budgetName": budgetName, "overSpend": False}


def delete_doc(id, userID):
    query = {
        "userID": userID,
        "_id": id
    }
    old_doc = mainDB.DB.get_collection(
        config.budgetCol).find_one_and_delete(query)
    recordDB.budget_delete(userID, old_doc["budgetName"])
    return "OK"


def get_docs(userID):
    query = {
        "userID": userID
    }
    return mainDB.DB.get_collection(config.budgetCol).find(query)


def record_revise_doc_decrease(userID, old_budgetName, old_moneyAmount):
    if old_budgetName == None:
        return False
    query = {
        "userID": userID,
        "budgetName": old_budgetName
    }
    res = mainDB.DB.get_collection(config.budgetCol).find_one_and_update(
        query, {"$inc": {"usedMoneyAmount": -old_moneyAmount}}, return_document=ReturnDocument.AFTER)
    if res["usedMoneyAmount"] >= res["targetMoneyAmount"] * 0.75:
        mainDB.DB.get_collection(config.budgetCol).update_one(
            query, {"$set": {"overSpend": True}})
        return True
    else:
        mainDB.DB.get_collection(config.budgetCol).update_one(
            query, {"$set": {"overSpend": False}})
        return False


def record_revise_doc_increase(userID, new_budgetName, new_moneyAmount):
    if new_budgetName == None:
        return False
    query = {
        "userID": userID,
        "budgetName": new_budgetName
    }
    res = mainDB.DB.get_collection(config.budgetCol).find_one_and_update(
        query, {"$inc": {"usedMoneyAmount": new_moneyAmount}}, return_document=ReturnDocument.AFTER)
    if res["usedMoneyAmount"] >= res["targetMoneyAmount"] * 0.75:
        mainDB.DB.get_collection(config.budgetCol).update_one(
            query, {"$set": {"overSpend": True}})
        return True
    else:
        mainDB.DB.get_collection(config.budgetCol).update_one(
            query, {"$set": {"overSpend": False}})
        return False


def get_available_budget_name(userID, year, month, day):
    pipeline = [
        #{"$project": {"budgetName": 1}},
        {"$match": {"userID": userID, "startDate": {"$lte": datetime(int(year), int(month), int(day))}, "endDate": {
            "$gte": datetime(int(year), int(month), int(day))}}}
    ]
    return mainDB.DB.get_collection(config.budgetCol).aggregate(pipeline)


def check_name_duplicate(userID, budgetName):
    query = {
        "userID": userID,
        "budgetName": budgetName
    }
    return mainDB.DB.get_collection(config.budgetCol).find_one(query)
