# import requests
#
# TEST_URL = 'http://iws.danawa.com/prod_img/500000/176/778/desc/prod_7778176/add_1/20191217163006214_EWNX67R5.jpg'
# TEST_URL2 = 'http://iws.danawa.com/prod_img/500000/102/557/desc/prod_6557102/add_2/20190212111505657_Q55HK2PK.jpg'
# API_URL = 'https://t0tqldeywp.apigw.ntruss.com/custom/v1/914/0ecb0061ca8e3dec04be771c3c1251ad8bb68d186878f4d5e3d154a5c8f32a6c/general'
#
# headers = {
#     'Content-Type': 'application/json',
#     'X-OCR-SECRET': 'UlNRV0lLRGl6clZtUGFtVlF6YVVPWkZ5d0lnZlVxRlg=',
# }
#
#
# # def _request_ocr(url, img_type):
# #     body = {
# #         'images': [
# #             {
# #                 'format': img_type,
# #                 'name': 'Test',
# #                 'url': TEST_URL2,
# #             }
# #         ],
# #         'lang': 'ko',
# #         'requestId': 'string',
# #         'resultType': 'string',
# #         'timestamp': 0,
# #         'version': 'V1',
# #     }
# #
# #     import json
# #
# #     res = requests.post(API_URL, data=json.dumps(body), headers=headers)
# #     res = res.json()
# #     images = res['images']
# #     for each in images:
# #         fields = each['fields']
# #
# #     print(res)
# #
# #
# # _request_ocr(TEST_URL, 'jpg')
