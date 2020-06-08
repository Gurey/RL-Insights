import carball
from carball.json_parser.game import Game
from carball.analysis.analysis_manager import AnalysisManager
import sys
import os
import json

_json_name = output_path = sys.argv[2]+'.tmp'

_json = carball.decompile_replay(
    sys.argv[1], _json_name, overwrite=True)

game = Game()
game.initialize(loaded_json=_json)

analysis = AnalysisManager(game)
analysis.create_analysis(calculate_intensive_events=False)

_output_tmp_name = sys.argv[2] + "-" + 'tmp' + ".json"
with open(_output_tmp_name, 'w') as out:
    analysis.write_json_out_to_file(out)

with open(_output_tmp_name) as tmp:
    data = json.load(tmp)
    time = data['gameMetadata']['time']
    _output_name = sys.argv[2] + "-" + time + ".json"

os.rename(_output_tmp_name, _output_name)

if os.path.exists(_json_name):
    os.remove(_json_name)
else:
    print("The file do not exist")

print(_output_name)
