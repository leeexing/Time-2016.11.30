# -*- coding: utf-8 -*-

import os
import wx
import shutil
from datetime import datetime
from pymongo import MongoClient

mongo = MongoClient(host='mongodb://localhost:27017/labellingimage').labellingimage

dest_path = 'E:\\Leeing\\sd_fls\\upload'

class PlotImage():

    def __init__(self):

        self.path = ''
        self.running = False

        self.app = wx.App()
        self.frame = wx.Frame(None, title='标图小工具', pos = (500, 200), size = (500, 400))

        batch_label = wx.StaticText(self.frame, -1, '批次名称：', pos=(8, 8), size=(80, 24), style=wx.ALIGN_CENTER)
        batch_label.SetForegroundColour('red')
        self.batch_name = wx.TextCtrl(self.frame, pos=(100, 5), size=(240, 24), value='请输入批次号')

        open_button = wx.Button(self.frame, label='选择文件夹', pos=(5, 40), size=(80, 24))
        open_button.SetForegroundColour('red')
        self.path_name = wx.TextCtrl(self.frame, pos=(100, 40), size=(240, 24), style=wx.TE_READONLY)

        save_button = wx.Button(self.frame, label='运行', pos=(380, 16), size=(80, 40))

        self.content_text = wx.TextCtrl(self.frame, pos = (5, 80), size = (475, 270), value='请输入该批次图像的备注信息', style=wx.TE_MULTILINE)

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
            self.path_name.SetValue(self.path)
        dlg.Destroy()

    def alert_msg(self, message):
        """选择文件夹"""
        dlg = wx.Dialog(None, -1, message, size=(300, 100))
        okButton = wx.Button(dlg, wx.ID_OK, "OK", pos=(15, 15))
        okButton.SetDefault()
        cancelButton = wx.Button(dlg, wx.ID_CANCEL, "Cancel", pos=(115, 15))
        result = dlg.ShowModal()
        dlg.Destroy()

    def get_batch_remark(self):
        """获取批次、备注信息"""
        tagname = self.batch_name.GetValue()
        remark = self.content_text.GetValue()
        return tagname, remark

    def resetStatus(self):
        """重置"""
        self.batch_name.SetValue('')
        self.path_name.SetValue('')
        self.content_text.SetValue('')

    def structuralData(self, event):
        """结构化数据"""

        batchname, remark = self.get_batch_remark()

        if (batchname == '请输入批次号' or batchname == ''):
            self.alert_msg('请输入正确的批次名称')
            return
        if remark == '请输入该批次图像的备注信息':
            self.alert_msg('请输入详细的批次备注信息')
            return
        if not self.path:
            self.alert_msg('请选择文件路径')
            return
        batch = mongo.batch.find_one({'name': batchname})
        if batch:
            self.alert_msg('批次名称已存在')
            return

        if self.running:
            return
        self.running = True
        batch_id = mongo.batch.save({
            'name': batchname,
            'remark': remark,
            'createTime': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
        batch_id = str(batch_id)
        for root, dirs, files in os.walk(self.path):
            # print(root, dirs, files)
            for name in files:
                basename, ext = os.path.splitext(name)
                dir_uppers = [item.upper() for item in dirs]
                if ext == '.jpg' and 'HELIXSE' in dir_uppers and ('%s.IMG' % basename in files or '%s.img' % basename in files):
                    searchname = os.path.join(root, basename + '.jpg')
                    print(searchname)
                    destdir = os.path.join(dest_path, batch_id)
                    if not os.path.exists(destdir):
                        os.makedirs(destdir)
                    destname = os.path.join(destdir, basename + '.jpg')
                    shutil.copyfile(searchname, destname)
                    mongo.image.save({
                        'url': destname,
                        'dest': root,
                        'batchID': batch_id,
                        'plot': False
                    })
        self.running = False
        self.resetStatus()
        self.alert_msg('图像数据结构化已完成！')


def main():
    plot = PlotImage()
    plot.show()


if __name__ == '__main__':
    main()
