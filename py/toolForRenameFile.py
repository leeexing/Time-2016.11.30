# coding=utf-8
import codecs
import os
import shutil

srcDir = r"F:\首都新机场\首都新机场\secure\TFNCH-VIII-160003\2019\0126"
# srcDir = r"G:\英国卢顿\14\1401"
#srcDir = "G:\\hao\\06-lixi"
dirs = os.listdir(srcDir)
helixName = "helix"
helixSEName = "helixse"

def main():
    """处理图像"""

    dirCount = 953
    for currentDir in dirs:
        dirNewName = "bjsf_safe%04d" % dirCount
        try:
            files = os.listdir(os.path.join(srcDir, currentDir))
            for fileName in files:
                # filePath = srcDir + "\\" + currentDir
                filePath = os.path.join(srcDir, currentDir)
                if not os.path.isdir(os.path.join(filePath, fileName)):  # 文件
                    fileExtensionIndex = fileName.rfind('.')
                    fileExtension = fileName[fileExtensionIndex:]

                    if fileExtension == '.jpg' and 'OB' in fileName[:2]:
                        continue
                    # 对于以pi、db、raw结尾的文件不进行处理
                    if fileExtension != '.pi' and fileExtension != '.db' and fileExtension != '.raw':
                        if fileName.find('_') != -1:  # 名字中带有'_'
                            indexToChange = fileName.find('_')
                            print("change name contains '_':", fileName)
                            newName = dirNewName + fileName[indexToChange:]
                            os.rename(filePath + "\\" + fileName,
                                    filePath + "\\" + newName)
                        else:
                            print('change name directly:', fileName)
                            newName = dirNewName + fileExtension
                            os.rename(filePath + "\\" + fileName,
                                    filePath + "\\" + newName)

                else:
                    # 只处理Helix和HelixSE文件夹
                    if fileName.lower() == helixName or fileName.lower() == helixSEName:
                        filePath = filePath + "\\" + fileName
                        helixFiles = os.listdir(filePath)
                        for helixFileName in helixFiles:
                            helixIndexToChange = helixFileName.find('_')
                            print('change helix file name:', helixFileName)
                            helixNewName = dirNewName + \
                                helixFileName[helixIndexToChange:]
                            os.rename(filePath + "\\" + helixFileName,
                                    filePath + "\\" + helixNewName)
        except Exception as ex:
            print('Error happend:%s' % str(ex))
            # continue

        os.rename(srcDir + "\\" + currentDir, srcDir + "\\" + dirNewName)
        dirCount += 1

if __name__ == '__main__':
    main()
