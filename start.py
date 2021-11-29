#!/bin/python

import os
from platform import system
from pathlib import Path
from enum import IntEnum
 
class Car():
    def __init__(self, unix, win) -> None:
        self.unix = unix
        self.win = win
    def show(self):
        print("OS: ", self.unix)
        print("OS: ", self.win)
        
os = Car("Linux", "Loh")

def do_add(a, b):
  return float(a) + float(b)

def do_subtract(a, b):
  return float(a) - float(b)

cmds = {
  'ADD': do_add,
  'SUBSTRACT': do_subtract,
}

def process(line):
  cmd, *args = line.split()
  return cmds[cmd](*args)

with open('input.txt') as fd:
  for line in fd:
    print(process(line))
    
if __name__ == "__main__":
    process()

# просто примеры не смотреть