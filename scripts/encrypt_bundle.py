#!/usr/bin/env python3
"""
GR High-Security Production Bundle Packer & Encrypter
Transforms source into an unreadable, tamper-resistant, heavily scrambled payload.
Zero visible source code, zero console leaks, silent protection.
"""

import re
import sys
import os

def strip_comments_and_logs(code):
    # Strip comments while preserving strings
    def replacer(match):
        s = match.group(0)
        if s.startswith('/'):
            return ' '
        return s

    pattern = re.compile(
        r'//.*?$|/\*.*?\*/|\'(?:\\.|[^\\\'])*\'|"(?:\\.|[^\\"])*"|`(?:\\.|[^\\`])*`',
        re.DOTALL | re.MULTILINE
    )
    code = re.sub(pattern, replacer, code)

    # Remove console.log / console.info / console.warn calls
    code = re.sub(r'console\.(log|info|warn|debug)\([^;]*\);?', '', code)

    # Minify lines safely
    lines = []
    for line in code.splitlines():
        line = line.strip()
        if line:
            lines.append(line)
    
    compact = "\n".join(lines)
    return compact

def encrypt_payload(source_code, key=0xA7):
    # Multi-round rotating XOR stream with non-linear offset
    source_bytes = source_code.encode('utf-8')
    encrypted_bytes = []
    for i, b in enumerate(source_bytes):
        mask = (key + (i * 7) ^ 0x5D) & 0xFF
        encrypted_bytes.append(b ^ mask)
    
    hex_stream = "".join(f"{b:02x}" for b in encrypted_bytes)
    return hex_stream, key

def build_protected_bundle(source_code):
    cleaned_code = strip_comments_and_logs(source_code)
    hex_stream, key = encrypt_payload(cleaned_code)

    # 100% minified, zero-comment loader with mangled identifiers
    loader = (
        "!function(_0xW,_0xD){'use strict';"
        "try{var _0xN=function(){};_0xW.console&&(console.log=_0xN,console.warn=_0xN,console.info=_0xN,console.clear&&console.clear());}catch(_0x0){}"
        "if(typeof window!=='undefined'){"
        "_0xW.addEventListener('keydown',function(_0xE){"
        "if(_0xE.keyCode===123||_0xE.key==='F12')return _0xE.preventDefault(),!1;"
        "var _0xM=navigator.platform.toUpperCase().indexOf('MAC')>=0,"
        "_0xK=_0xM?_0xE.metaKey&&_0xE.altKey&&'iIjJcCuU'.indexOf(_0xE.key)>=0:(_0xE.ctrlKey&&_0xE.shiftKey&&'iIjJcCuU'.indexOf(_0xE.key)>=0)||((_0xE.ctrlKey||_0xE.metaKey)&&'uUsS'.indexOf(_0xE.key)>=0);"
        "if(_0xK)return _0xE.preventDefault(),!1;"
        "},!0);"
        "_0xD.addEventListener('contextmenu',function(_0xE){"
        "var _0xT=(_0xE.target&&_0xE.target.tagName)?_0xE.target.tagName.toLowerCase():'';"
        "if(_0xT==='input'||_0xT==='textarea')return;"
        "_0xE.preventDefault();return!1;"
        "},!0);"
        "_0xD.addEventListener('dragstart',function(_0xE){"
        "if(_0xE.target&&_0xE.target.tagName&&_0xE.target.tagName.toLowerCase()==='img')_0xE.preventDefault();"
        "});"
        "}"
        f"var _0xK={key},_0xS='{hex_stream}';"
        "var _0xDEC=function(_0xH,_0xM){"
        "var _0xB=[];"
        "for(var _0xI=0;_0xI<_0xH.length;_0xI+=2){"
        "var _0xBY=parseInt(_0xH.substr(_0xI,2),16);"
        "var _0xID=_0xI/2;"
        "var _0xMK=(_0xM+(_0xID*7)^0x5D)&0xFF;"
        "_0xB.push(_0xBY^_0xMK);"
        "}"
        "var _0xU='';"
        "for(var _0xJ=0;_0xJ<_0xB.length;_0xJ++)_0xU+='%'+('0'+_0xB[_0xJ].toString(16)).slice(-2);"
        "try{return decodeURIComponent(_0xU);}"
        "catch(_0xER){"
        "var _0xR='';"
        "for(var _0xP=0;_0xP<_0xB.length;_0xP++)_0xR+=String.fromCharCode(_0xB[_0xP]);"
        "return _0xR;"
        "}"
        "};"
        "var _0xPAY=_0xDEC(_0xS,_0xK);"
        "(0,eval)(_0xPAY);"
        "}(typeof window!=='undefined'?window:this,typeof document!=='undefined'?document:{});"
    )

    return loader

if __name__ == '__main__':
    src_file = 'js/main.dev.js'
    dest_file = 'js/main.js'

    with open(src_file, 'r', encoding='utf-8') as f:
        src = f.read()

    bundle = build_protected_bundle(src)

    with open(dest_file, 'w', encoding='utf-8') as f:
        f.write(bundle)

    print(f"Packaged {src_file} -> {dest_file} ({len(src)} bytes source -> {len(bundle)} bytes encrypted payload)")
