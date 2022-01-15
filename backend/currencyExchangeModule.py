from distutils.command.config import config
from flask import Flask, request, jsonify, Blueprint
from flask.blueprints import Blueprint
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity
import mainDB
import config

appCurrencyExchange = Blueprint('appCurrencyExchange', __name__)


@appCurrencyExchange.route("/currencyExchange/get-exchange-rate", methods=["GET"])
@jwt_required()
def get_exchange_rate():
    userID = get_jwt_identity()
    targetCurrency = request.args.get("targetCurrency")
    mainDB.DB.get_collection(config.memberCol).update_one(
        {"userID": userID}, {"$set": {"selectCurrency": targetCurrency}})
    return str(cal_exchange_rate(targetCurrency))


def cal_exchange_rate(targetCurrency):
    r = requests.get(
        "https://openapi.taifex.com.tw/v1/DailyForeignExchangeRates", verify=True)
    target = r.json()
    if targetCurrency == "TWD":
        return 1
    elif targetCurrency == "EUR":
        return round(float(target[len(target)-1]['EUR/USD'])*float(target[len(target)-1]['USD/NTD']), 2)
    elif targetCurrency == "JPY":
        return round(float(target[len(target)-1]['USD/NTD'])/float(target[len(target)-1]['USD/JPY']), 2)
    elif targetCurrency == "RMB":
        return round(float(target[len(target)-1]['RMB/NTD']), 2)
    elif targetCurrency == "GBP":
        return round(float(target[len(target)-1]['GBP/USD'])*float(target[len(target)-1]['USD/NTD']), 2)
    elif targetCurrency == "AUD":
        return round(float(target[len(target)-1]['AUD/USD'])*float(target[len(target)-1]['USD/NTD']), 2)
    elif targetCurrency == "HKD":
        return round(float(target[len(target)-1]['USD/NTD'])/float(target[len(target)-1]['USD/HKD']), 2)
    elif targetCurrency == "ZAR":
        return round(float(target[len(target)-1]['USD/NTD'])/float(target[len(target)-1]['USD/ZAR']), 2)
    elif targetCurrency == "NZD":
        return round(float(target[len(target)-1]['NZD/USD'])*float(target[len(target)-1]['USD/NTD']), 2)
    elif targetCurrency == "USD":
        return round(float(target[len(target)-1]['USD/NTD']), 2)
