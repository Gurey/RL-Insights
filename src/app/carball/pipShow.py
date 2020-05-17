import subprocess
import sys

subprocess.check_call([sys.executable, "-m", "pip", "show", sys.argv[1]])
