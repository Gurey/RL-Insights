import subprocess
import sys
import os

subEnv = os.environ.copy()
subEnv["PYTHONPATH"] = sys.executable

args = sys.argv[1:]
env = os.environ.copy()
env['PATH'] = "C:\\Users\\Gurey\\AppData\\Roaming\\electron-ts-react\\python;C:\\Users\\Gurey\\AppData\\Roaming\\electron-ts-react\\python\\Scripts"
env['PYTHONPATH'] = "."

subprocess.check_call([sys.executable, "-m", "easy_install", *args])