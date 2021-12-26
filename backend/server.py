from flask import Flask, Blueprint, render_template
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

@app.route('/', methods=["GET"])
def index_page():
    return "Hello!!"

@app.route('/home.html', methods=["GET"])
def home_page():
    return render_template("home.html")

@app.route('/category.html', methods=["GET"])
def category_page():
    return render_template("category.html")

@app.route('/account.html', methods=["GET"])
def account_page():
    return render_template("account.html")

@app.route('/barChart.html', methods=["GET"])
def barChart_page():
    return render_template("barChart.html")

@app.route('/register&login.html', methods=["GET"])
def register_login_page():
    return render_template("register&login.html")

@app.route('/selection.html', methods=["GET"])
def selection_page():
    return render_template("selection.html")

@app.route('/setting.html', methods=["GET"])
def setting_page():
    return render_template("setting.html")

@app.route('/testBudget.html', methods=["GET"])
def testBudget_page():
    return render_template("testBudget.html")

@app.route('/testPie.html', methods=["GET"])
def testPie_page():
    return render_template("testPie.html")

@app.route('/transfer.html', methods=["GET"])
def transfer_page():
    return render_template("transfer.html")

@app.route('/transferrecord.html', methods=["GET"])
def transferrecord_page():
    return render_template("transferrecord.html")






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