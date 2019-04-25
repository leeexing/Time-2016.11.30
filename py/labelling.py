# -*- coding: utf-8 -*-

import os
import wx
import shutil
from datetime import datetime
from pymongo import MongoClient

mongo = MongoClient(host='mongodb://localhost:27017/labellingimage').labellingimage

dest_path = r'E:/Leeing/sd_fls/upload/'

class PlotImage():

    def __init__(self):

        self.path = ''
        self.running = False

        self.app = wx.App()
        self.frame = wx.Frame(None, title='标图小工具', pos = (500, 200), size = (500, 400))

        self.batch_name = wx.TextCtrl(self.frame, pos=(70, 5), size=(240, 24), value='请输入批次号')
        batch_label = wx.StaticText(self.frame, -1, '批次名称：', pos=(8, 8), size=(60, 24)).SetForegroundColour('red')
        open_button = wx.Button(self.frame, label='选择文件夹', pos=(320, 5), size=(100, 24))
        save_button = wx.Button(self.frame, label='运行', pos=(430, 5), size=(50, 24))

        self.content_text = wx.TextCtrl(self.frame, pos = (5, 39), size = (475, 300), value='请输入该批次图像的备注信息')  # wx.TE_MULTILINE可以实现换行功能,若不加此功能文本文档显示为一行显示

        open_button.Bind(wx.EVT_BUTTON, self.selectFolder)
        save_button.Bind(wx.EVT_BUTTON, self.structuralData)

    def show(self):
        self.frame.Show()
        self.app.MainLoop()

    def selectFolder(self, event):
        """选择文件夹"""
        dlg = wx.DirDialog(None, u'选择文件夹', style=wx.DD_DEFAULT_STYLE)
        if dlg.ShowModal() == wx.ID_OK:
            self.path = dlg.GetPath() # 文件夹路径
        dlg.Destroy()

    def alert_msg(self, message):
        """选择文件夹"""
        dlg = wx.Dialog(None, -1, message, size=(300, 100))
        okButton = wx.Button(dlg, wx.ID_OK, "OK", pos=(15, 15))
        okButton.SetDefault()
        cancelButton = wx.Button(dlg, wx.ID_CANCEL, "Cancel", pos=(115, 15))
        result = dlg.ShowModal()
        dlg.Destroy()

    def structuralData(self, event):
        """结构化数据"""

        tagname = self.batch_name.GetValue()
        remark = self.content_text.GetValue()

        if (tagname == '请输入批次号' or tagname == ''):
            self.alert_msg('请输入正确的批次名称')
            return
        if remark == '请输入该批次图像的备注信息':
            self.alert_msg('请输入详细的批次备注信息')
            return
        if not self.path:
            self.alert_msg('请选择文件路径')
            return

        if self.running:
            return
        self.running = True
        tag_id = mongo.tags.save({
            'tag': tagname,
            'remark': remark,
            'createTime': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
        for root, dirs, files in os.walk(self.path):
            print(root, dirs, files)
            for name in files:
                print(os.path.splitext(name))
                basename, ext = os.path.splitext(name)
                dir_uppers = [item.upper() for item in dirs]
                if ext == '.jpg' and 'HELIXSE' in dir_uppers and ('%s.IMG' % basename in files or '%s.img' % basename in files):
                    searchname = os.path.join(root, basename + '.jpg')
                    destdir = os.path.join(dest_path, tagname)
                    if not os.path.exists(destdir):
                        os.makedirs(destdir)
                    destname = os.path.join(destdir, basename + '.jpg')
                    shutil.copyfile(searchname, destname)
                    mongo.images.save({
                        'tag': tagname,
                        'url': destname,
                        'dest': searchname
                    })
        self.running = False

def main():
    plot = PlotImage()
    plot.show()


if __name__ == '__main__':
    main()
