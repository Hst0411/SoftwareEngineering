from datetime import datetime
import uuid
from bson.son import SON
from flask.json import jsonify
from pymongo import MongoClient, DESCENDING
from bson.objectid import ObjectId
from uuid import uuid4


import mainDB
import config


def insert_doc(userID, name, incomeOrExpense, category, date, moneyAmount, accountName, budgetName):
    id = str(uuid4())
    doc = {
        "_id": id,
        "userID": userID,
        "name": name,
        "incomeOrExpense": incomeOrExpense,
        "category": category,
        # 日期時間要轉成datetime格式才能查
        "date": datetime(date["year"], date["month"], date["day"], date["hour"], date["minute"]),
        "moneyAmount": moneyAmount,
        "accountName": accountName,
        "budgetName": budgetName,
    }
    return mainDB.DB.get_collection(config.recordCol).insert_one(doc)


def get_before_update_doc(query):
    return mainDB.DB.get_collection(config.recordCol).find_one(query)
def update_doc(query, new_doc):
    # 日期時間要轉成datetime格式才能修改
    new_doc["date"] = datetime(new_doc["date"]["year"], new_doc["date"]["month"], new_doc["date"]["day"],
                               new_doc["date"]["hour"], new_doc["date"]["minute"])
    return mainDB.DB.get_collection(config.recordCol).update_one(query, {"$set": new_doc})


def delete_doc(id, userID):
    query = {
        "userID": userID,
        "_id": id
    }
    return mainDB.DB.get_collection(config.recordCol).find_one_and_delete(query)



def get_docs(userID, incomeOrExpense, date):
    query = dict()
    query["userID"] = userID
    query["_id"] = date
    temp_result = mainDB.DB.get_collection(config.recordCol).find({
        "userID": userID, "incomeOrExpense": incomeOrExpense, "date": {
            # date大於等於此日期的條件($gte:大於等於)
            "$gte": datetime(int(date["year"]), int(date["month"]), int(date["day"])),
            # date小於此日期的條件($lt:小於)
            "$lt": datetime(int(date["year"]), int(date["month"]), int(date["day"])+1)
        }
    })
    # 用find()函式取得的變數(temp_result)是指標，所以要尋訪每個item並塞到list資料結構的變數(result)再回傳
    result = list()
    for item in temp_result:
        result.append(item)
    return result


def account_revise(userID, old_accountName, new_accountName):
    mainDB.DB.get_collection(config.recordCol).update_many(
        {"userID": userID, "accountName": old_accountName}, {"$set": {"accountName": new_accountName}})


def account_delete(userID, accountName):
    mainDB.DB.get_collection(config.recordCol).update_many(
        {"userID": userID, "accountName": accountName}, {"$set": {"accountName": None}})


#傳入舊名字做為索引(新舊一樣就都傳舊名字)
def budget_revise(userID, old_budgetName, new_budgetName, new_start_date, new_end_date):
    mainDB.DB.get_collection(config.recordCol).update_many(
        {"userID": userID, "budgetName": old_budgetName}, {"$set": {"budgetName": new_budgetName}})
    mainDB.DB.get_collection(config.recordCol).update_many({"userID": userID, "budgetName": new_budgetName, "date": {
        "$lt": new_start_date, "$gt": new_end_date}}, {"$set": {"budgetName": None}})


def budget_delete(userID, budgetName):
    mainDB.DB.get_collection(config.recordCol).update_many(
        {"userID": userID, "budgetName": budgetName}, {"$set": {"budgetName": None}})
