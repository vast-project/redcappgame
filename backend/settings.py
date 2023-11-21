from os import path

curdir = path.dirname(path.realpath(__file__))
path.curdir = curdir

host = "0.0.0.0"
port = 8000  # Change this if you host any web sites locally

# Make sure that directory paths throughout this project always finish with a slash (/)
static_path = curdir + "/../static/"
data_path = curdir + "/../data/"

db_path = data_path + "redcap-ftm.db"
# DATABASE_URL = "sqlite:///" + db_path + "?check_same_thread=False"
# DATABASE_URL = "postgresql://postgres:xxxxx@localhost/fairytale_cards"
DATABASE_URL = "postgresql://redcapp:ppacder@postgres/fairytale_cards"

debug = True
