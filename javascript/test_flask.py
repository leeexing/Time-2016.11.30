# -*- coding: utf-8 -*-
"""
测试flask request.get_json()
"""
import requests, json

user_info = {'name': 'leeing'}

headers = {'content-type': 'application/json'}

r.requests.post('http://localhost:5002/api/user/register?id=23', data=json.dumps(user_info), headers=headers)

print(r.headers)
print(j.json())