# -*- coding: utf-8 -*-
"""图像生成
    workon test_env
"""

import pagan


inpt = 'leeing'

img = pagan.Avatar(inpt, pagan.SHA512)

img.save('./', 'test')

