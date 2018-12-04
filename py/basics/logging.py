# -*- coding: utf-8 -*-
"""logging 内置模块"""

import logging
from logging.handlers import RotatingFileHandler

def create_logger(name):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    Format = logging.Formatter(
       '%(asctime)s - %(name)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

    if not logger.handlers:

        chandler = logging.StreamHandler()
        chandler.setLevel(logging.INFO)
        chandler.setFormatter(Format)
        logger.addHandler(chandler)

        fhandler = logging.FileHandler('./log.log', encoding='utf-8', delay='true')
        fhandler.setFormatter(Format)
        fhandler.setLevel(logging.ERROR)
        logger.addHandler(fhandler)

        rhandler = RotatingFileHandler('./log.txt', maxBytes=1*1024, backupCount=3)
        rhandler.setLevel(logging.INFO)
        rhandler.setFormatter(Format)
        logger.addHandler(rhandler)

        return logger

logger = create_logger('SOURCE_DATA')
logger.info('just is a test')
logger.info('just is a test 465412132')
logger.error('error in this %s', 'jacking')