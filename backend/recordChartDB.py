from datetime import datetime
from re import A
from typing import Any
import uuid
from bson.son import SON
from flask.json import jsonify
from pymongo import MongoClient, DESCENDING
from bson.objectid import ObjectId
from uuid import uuid4


import mainDB
import config


def monthdelta(date, delta):
    m, y = (date.month+delta) % 12, date.year + ((date.month)+delta-1) // 12
    if not m:
        m = 12
    d = min(date.day, [31,
                       29 if y % 4 == 0 and (
                           not y % 100 == 0 or y % 400 == 0) else 28,
                       31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m-1])
    return date.replace(day=d, month=m, year=y)


def get_months_compare(userID):
    now = datetime.now()
    currentMonthFirstDay = datetime(
        now.year, now.month, 1)

    query_1 = {
        "$lt":  monthdelta(currentMonthFirstDay, 1),
        "$gte": currentMonthFirstDay
    }
    query_2 = {
        "$lt": currentMonthFirstDay,
        "$gte": monthdelta(currentMonthFirstDay, -1)
    }
    query_3 = {
        "$lt": monthdelta(currentMonthFirstDay, -1),
        "$gte": monthdelta(currentMonthFirstDay, -2)
    }

    pipeline = [
        {"$match": {"userID": userID, "date": query_1, "incomeOrExpense": "支出"}},
        {"$group": {"_id": "$userID", "total_amount": {"$sum": "$moneyAmount"}}}
    ]
    temp_result_1_out = mainDB.DB.get_collection(
        config.recordCol).aggregate(pipeline)
    pipeline = [
        {"$match": {"userID": userID, "date": query_1, "incomeOrExpense": "收入"}},
        {"$group": {"_id": "$userID", "total_amount": {"$sum": "$moneyAmount"}}}
    ]
    temp_result_1_in = mainDB.DB.get_collection(
        config.recordCol).aggregate(pipeline)

    pipeline = [
        {"$match": {"userID": userID, "date": query_2, "incomeOrExpense": "支出"}},
        {"$group": {"_id": "$userID", "total_amount": {"$sum": "$moneyAmount"}}}
    ]
    temp_result_2_out = mainDB.DB.get_collection(
        config.recordCol).aggregate(pipeline)
    pipeline = [
        {"$match": {"userID": userID, "date": query_2, "incomeOrExpense": "收入"}},
        {"$group": {"_id": "$userID", "total_amount": {"$sum": "$moneyAmount"}}}
    ]
    temp_result_2_in = mainDB.DB.get_collection(
        config.recordCol).aggregate(pipeline)

    pipeline = [
        {"$match": {"userID": userID, "date": query_3, "incomeOrExpense": "支出"}},
        {"$group": {"_id": "$userID", "total_amount": {"$sum": "$moneyAmount"}}}
    ]
    temp_result_3_out = mainDB.DB.get_collection(
        config.recordCol).aggregate(pipeline)
    pipeline = [
        {"$match": {"userID": userID, "date": query_3, "incomeOrExpense": "收入"}},
        {"$group": {"_id": "$userID", "total_amount": {"$sum": "$moneyAmount"}}}
    ]
    temp_result_3_in = mainDB.DB.get_collection(
        config.recordCol).aggregate(pipeline)
    item1 = 0.0
    item2 = 0.0
    item3 = 0.0
    item4 = 0.0
    item5 = 0.0
    item6 = 0.0
    for item in temp_result_1_in:
        if item['total_amount']:
            item1 = float(item['total_amount'])
    for item in temp_result_1_out:
        if item['total_amount']:
            item2 = float(item['total_amount'])
    for item in temp_result_2_in:
        if item['total_amount']:
            item3 = float(item['total_amount'])
    for item in temp_result_2_out:
        if item['total_amount']:
            item4 = float(item['total_amount'])
    for item in temp_result_3_in:
        if item['total_amount']:
            item5 = float(item['total_amount'])
    for item in temp_result_3_out:
        if item['total_amount']:
            item6 = float(item['total_amount'])

    result = list()
    result.append(
        {
            "year": currentMonthFirstDay.year,
            "month": currentMonthFirstDay.month,
            "income": item1,
            "expense": item2
        }
    )
    result.append(
        {
            "year": monthdelta(currentMonthFirstDay, -1).year,
            "month": monthdelta(currentMonthFirstDay, -1).month,
            "income": item3,
            "expense": item4
        }
    )
    result.append(
        {
            "year": monthdelta(currentMonthFirstDay, -2).year,
            "month": monthdelta(currentMonthFirstDay, -2).month,
            "income": item5,
            "expense": item6
        }
    )
    return result


def get_category_compare(userID, incomeOrExpense, startDateYear, startDateMonth, startDateDay, endDateYear, endDateMonth, endDateDay):
    date_query = {
        "$gte":  datetime(int(startDateYear), int(startDateMonth), int(startDateDay)),
        "$lte": datetime(int(endDateYear), int(endDateMonth), int(endDateDay), 23, 59, 59)
    }
    # 確認結果是否正確
    pipeline = [
        {"$match": {"userID": userID, "date": date_query, "incomeOrExpense": incomeOrExpense}},
        {"$group": {"_id": "$category", "total_amount": {"$sum": "$moneyAmount"}}}
    ]
    temp_result = mainDB.DB.get_collection(config.recordCol).aggregate(pipeline)
    result = list()
    for item in temp_result:
        result.append(item)
    return result
