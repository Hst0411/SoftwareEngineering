from datetime import datetime
import uuid
from bson.son import SON
from flask.json import jsonify
from pymongo import MongoClient, DESCENDING
from bson.objectid import ObjectId
from uuid import uuid4


import mainDB
import config


def insert_doc(userID, name, incomeOrExpense):
    query = {
        "userID": userID,
    }
    doc = {
        "name": name,
        "incomeOrExpense": incomeOrExpense
    }
    return mainDB.DB.get_collection(config.recordCategoryCol).update_one(query, {"$push": {"recordCategoryList": doc}})


def update_doc(userID, old_name, old_incomeOrExpense, new_name):
    query = {
        "userID": userID,
        "recordCategoryList.name": old_name,
        "recordCategoryList.incomeOrExpense": old_incomeOrExpense
    }
    new_doc = {
        "recordCategoryList.$.name": new_name
    }
    return mainDB.DB.get_collection(config.recordCategoryCol).update_one(query, {"$set": new_doc})


def delete_doc(userID, name, incomeOrExpense):
    query = {
        "userID": userID,
    }
    del_doc = {
        "name": name,
        "incomeOrExpense": incomeOrExpense
    }
    return mainDB.DB.get_collection(config.recordCategoryCol).update_one(query, {"$pull": {"recordCategoryList": del_doc}})


def get_docs(userID, incomeOrExpense):
    #找到指定userID的document,再filter客製化類別名稱list裡的名稱(指定查詢收入或支出)
    pipeline = [
        {"$match": {"userID": userID}},
        {"$project": {
            "recordCategoryList": {"$filter": {
                "input":"$recordCategoryList",
                "as":"item",
                "cond":{"$eq":["$$item.incomeOrExpense", incomeOrExpense]}
            }}
        }}
    ]
    # temp_res為MongoCursor型態
    temp_res = mainDB.DB.get_collection(config.recordCategoryCol).aggregate(pipeline)
    # 將temp_res的第一個物件取出回傳
    for item in temp_res:
        return item
