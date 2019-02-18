# -*- coding: utf-8 -*-

import  os
from win32com import client
#pip instatll win32com
def doc2pdf(doc_name, pdf_name):
    """
    :word文件转pdf
    :param doc_name word文件名称
    :param pdf_name 转换后pdf文件名称
    """
    try:
        powerpoint = client.DispatchEx('PowerPoint.Application')
        # powerpoint.Visible = False
        ppt = powerpoint.Presentations.Open(doc_name, False, False, False)
        # 保存为图片
        # ppt.SaveAs(pdf_path.rsplit('.')[0] + '.jpg', 17)
        # 保存为pdf
        # ppt.SaveAs(pdf_name, 32) # formatType = 32 for ppt to pdf
        ppt.ExportAsFixedFormat(pdf_name, 2, PrintRange=None)
        powerpoint.Quit()
        return pdf_name
    except Exception as e:
        print(str(e))
        return 1

if __name__=='__main__':
    print(789798)
    doc_name = r"E:/Leeing/node/besame/py/doc2pdf/test.pptx"
    ftp_name = r"E:/Leeing/node/besame/py/doc2pdf/test.pdf"
    ret = doc2pdf(doc_name, ftp_name)
    print(ret)
