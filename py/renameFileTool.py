# -*- coding: utf-8 -*-
"""图像重命名小工具"""

import os
import wx
import shutil

helixNames = ['helix', 'helixse']

class PlotImage():

    def __init__(self):

        self.path = ''
        self.running = False

        self.app = wx.App()
        self.frame = wx.Frame(None, title='图像命名小工具', pos = (500, 200), size = (500, 400))

        # 命名前缀
        batch_label = wx.StaticText(self.frame, -1, '前缀名称：', pos=(8, 8), size=(80, 24), style=wx.ALIGN_CENTER)
        batch_label.SetForegroundColour('red')
        self.batch_name = wx.TextCtrl(self.frame, pos=(100, 5), size=(240, 24), value='test')

        # 开始序号
        index_label = wx.StaticText(self.frame, -1, '开始序号：', pos=(8, 42), size=(80, 24), style=wx.ALIGN_CENTER)
        index_label.SetForegroundColour('red')
        self.index_name = wx.TextCtrl(self.frame, pos=(100, 40), size=(240, 24), value='1')

        # 文件路径
        open_button = wx.Button(self.frame, label='选择文件夹', pos=(5, 80), size=(80, 24))
        open_button.SetForegroundColour('red')
        self.path_name = wx.TextCtrl(self.frame, pos=(100, 80), size=(240, 24), style=wx.TE_READONLY)

        # 运行
        save_button = wx.Button(self.frame, label='运行', pos=(380, 36), size=(80, 40))

        # 日志
        self.content_text = wx.TextCtrl(self.frame, pos = (5, 120), size = (475, 200), value='日志输出:', style=wx.TE_MULTILINE)

        # 清除日志
        clear_button = wx.Button(self.frame, label='清除日志', pos=(10, 325), size=(60, 24))

        # 绑定事件
        open_button.Bind(wx.EVT_BUTTON, self.selectFolder)
        save_button.Bind(wx.EVT_BUTTON, self.start)
        clear_button.Bind(wx.EVT_BUTTON, self.clearLogo)

    def show(self):
        """GUI显示"""
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
        """弹框信息"""
        dlg = wx.Dialog(None, -1, message, size=(300, 100))
        okButton = wx.Button(dlg, wx.ID_OK, "OK", pos=(15, 15))
        okButton.SetDefault()
        cancelButton = wx.Button(dlg, wx.ID_CANCEL, "Cancel", pos=(115, 15))
        result = dlg.ShowModal()
        dlg.Destroy()

    def get_batch_remark(self):
        """获取批次、备注信息"""
        self.prefix_name = self.batch_name.GetValue()
        self.index_value = self.index_name.GetValue()

    def clearLogo(self, event):
        """清空日志"""
        self.content_text.SetValue('日志输出:')

    def resetStatus(self):
        """重置"""
        self.path_name.SetValue('')
        self.path = ''

    def start(self, event):
        """结构化数据"""
        self.get_batch_remark()

        if (self.prefix_name == '请输入批次号' or self.prefix_name == ''):
            self.alert_msg('请输入正确的批次名称')
            return
        if not self.index_value:
            self.alert_msg('请选择文件开始序列号')
            return
        if not self.path:
            self.alert_msg('请选择文件路径')
            return
        if self.running:
            return

        self.running = True
        self.rename_file()
        self.running = False
        self.resetStatus()
        self.alert_msg('批量命名已完成！')

    def rename_file(self):
        """开始批量命名"""
        dirCount = int(self.index_value)
        for currentDir in os.listdir(self.path):
            dirNewName = '{}{:0>4d}'.format(self.prefix_name, dirCount)
            try:
                files = os.listdir(os.path.join(self.path, currentDir))
                for fileName in files:
                    filePath = os.path.join(self.path, currentDir)
                    if not os.path.isdir(os.path.join(filePath, fileName)):  # 文件
                        fileExtensionIndex = fileName.rfind('.')
                        fileExtension = fileName[fileExtensionIndex:]

                        if fileExtension == '.jpg' and 'OB' in fileName[:2]:
                            continue

                        # 对于以pi、db、raw结尾的文件不进行处理
                        if fileExtension not in ['.pi', '.db', '.raw']:
                            if fileName.find('_') != -1:  # 名字中带有'_'
                                indexToChange = fileName.find('_')
                                print('change name contains [ _ ] : ', fileName)
                                self.content_text.AppendText('\nchange name contains [ _ ] : ' + fileName)
                                newName = dirNewName + fileName[indexToChange:]
                                os.rename(filePath + '\\' + fileName, filePath + '\\' + newName)
                            else:
                                print('change name directly:', fileName)
                                self.content_text.AppendText('\nchange name directly : ' + fileName)
                                newName = dirNewName + fileExtension
                                os.rename(filePath + '\\' + fileName, filePath + '\\' + newName)

                    else: # 只处理Helix和HelixSE文件夹
                        if fileName.lower() in helixNames:
                            filePath = filePath + '\\' + fileName
                            helixFiles = os.listdir(filePath)
                            for helixFileName in helixFiles:
                                helixIndexToChange = helixFileName.find('_')
                                print('change helix file name:', helixFileName)
                                self.content_text.AppendText('\nchange helix file name : ' + helixFileName)
                                helixNewName = dirNewName + helixFileName[helixIndexToChange:]
                                os.rename(filePath + '\\' + helixFileName, filePath + '\\' + helixNewName)
            except Exception as err:
                print('Error happend:%s' % str(err))
                self.content_text.AppendText('\nError happend: ' + helixFileName)
                # continue

            os.rename(self.path + '\\' + currentDir, self.path + '\\' + dirNewName)
            dirCount += 1
            self.index_name.SetValue(str(dirCount))


def main():
    plot = PlotImage()
    plot.show()


if __name__ == '__main__':
    main()
