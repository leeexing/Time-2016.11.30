# -*- coding: utf-8 -*-
"""获取原始密码
    werkzeug.security
    <failure>
"""

from werkzeug.security import generate_password_hash, check_password_hash

pwhash = generate_password_hash('123456')

print(pwhash)

method, salt, hashval = pwhash.split("$", 2)

print('===', method, salt, hashval)

ret = check_password_hash(pwhash, '123456')

print(ret)

