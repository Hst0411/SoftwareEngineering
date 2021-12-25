from flask import Flask, Blueprint
from pymongo import MongoClient, DESCENDING
from flask_cors import CORS


import config
import mainDB
from recordModule import appRecord
from recordCategoryModule import appRecordCategory
from budgetModule import appBudget
from accountModule import appAccount
from recordChartModule import appRecordChart


app = Flask(__name__)
CORS(app)
app.debug = True


app.register_blueprint(appRecord)
app.register_blueprint(appRecordCategory)
app.register_blueprint(appBudget)
app.register_blueprint(appAccount)
app.register_blueprint(appRecordChart)


def printAvailableAPIs():
    basic_methods = ["GET", "POST", "PUT", "DELETE"]
    print("")
    print("  {:^40} | {:^15}".format("URL", "METHODS"))
    # Flask app's property "url_map" has a function iter_rules() to loop through all available APIs.
    for p in app.url_map.iter_rules():
        print("  {:<40} | {:<15}".format(str(p), ", ".join(
            set(p.methods).intersection(basic_methods))))
    print("")


def main():

    print(mainDB.connect_db(config.host, config.db))
    printAvailableAPIs()
    app.run(host="0.0.0.0", port=9000, debug=True)


if __name__ == "__main__":
    main()