import re
import os
import codecs

import smipy

smi = smipy.Smi('./testbb501.smi', debug = True)
smi.to_csv(title = 'testbb501')