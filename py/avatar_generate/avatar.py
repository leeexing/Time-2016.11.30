# -*- coding: utf-8 -*-
"""图像生成"""

from avatar_generator import render_identicon



if __name__ == '__main__':
    img = render_identicon(100020000, 24)
    img.save('./avatar.png', 'PNG')
