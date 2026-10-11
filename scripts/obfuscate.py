#!/usr/bin/env python3
"""
Obfuscator & JavaScript Encrypter for GR Personal Portfolio
Transforms clean developer source code into a heavily encrypted,
obfuscated, and minified production bundle without using eval()
(preserving 100% compatibility with strict Content Security Policy).
"""

import sys
import re
import os

def hex_encode_string(s):
    """Encodes a string into hex escapes: \\x.. or unicode \\u...."""
    res = []
    for c in s:
        code = ord(c)
        if code < 128 and (c.isalnum() or c in ' _-.,!?:;/@()[]{}<>=+*#'):
            res.append(f"\\x{code:02x}")
        elif code < 256:
            res.append(f"\\x{code:02x}")
        else:
            res.append(f"\\u{code:04x}")
    return "".join(res)

def obfuscate_js(source_code):
    # Step 1: Remove single-line comments (except those inside strings)
    # and multi-line comments
    def strip_comments(text):
        def replacer(match):
            s = match.group(0)
            if s.startswith('/'):
                return " "
            else:
                return s
        pattern = re.compile(
            r'//.*?$|/\*.*?\*/|\'(?:\\.|[^\\\'])*\'|"(?:\\.|[^\\"])*"',
            re.DOTALL | re.MULTILINE
        )
        return re.sub(pattern, replacer, text)

    clean_code = strip_comments(source_code)

    # Step 2: Extract string literals and replace with decoder calls
    # Tokenize strings
    string_pattern = re.compile(r"'(?:\\.|[^\\'])*'|\"(?:\\.|[^\\\"])*\"")
    
    unique_strings = []
    string_to_id = {}

    def string_collector(match):
        raw_str = match.group(0)
        # unquote
        quote = raw_str[0]
        content = raw_str[1:-1]
        
        # Unescape standard escapes to get actual string
        try:
            val = bytes(content, 'utf-8').decode('unicode_escape')
        except Exception:
            val = content

        # Keep very short strings or directives (like 'use strict') as-is
        if val in ['use strict', '', 'x', 'y', 'r']:
            return raw_str

        if val not in string_to_id:
            idx = len(unique_strings)
            string_to_id[val] = idx
            unique_strings.append(val)
        else:
            idx = string_to_id[val]

        return f"_0x5c({hex(idx)})"

    obfuscated_body = string_pattern.sub(string_collector, clean_code)

    # Step 3: Shift/Rotate array for polymorphic protection
    shift_offset = 0x8b
    rotated_strings = unique_strings[shift_offset % len(unique_strings):] + unique_strings[:shift_offset % len(unique_strings)]
    
    # Recalculate IDs for rotated array
    lookup_table = []
    for s in rotated_strings:
        # hex encode the string
        lookup_table.append(f"'{hex_encode_string(s)}'")

    array_name = "_0x1b4f"
    decoder_name = "_0x5c"

    header_code = f"""/* GR PROTECTED ASSET - LEGEA 8/1996 - ENCRYPTED PRODUCTION BUNDLE */
'use strict';
(function(){{
var {array_name} = [{','.join(lookup_table)}];
(function(_0x1,_0x2){{
  var _0x3 = function(_0x4){{
    while(--_0x4){{
      _0x1['push'](_0x1['shift']());
    }}
  }};
  _0x3(++_0x2);
}})({array_name}, {shift_offset});

var {decoder_name} = function(_0x1){{
  var _0x2 = parseInt(_0x1, 16);
  return {array_name}[_0x2];
}};
"""

    footer_code = "\n})();"

    full_code = header_code + obfuscated_body + footer_code

    # Step 4: Minify whitespace safely (collapse multiple spaces, trim lines)
    lines = [line.strip() for line in full_code.split('\n') if line.strip()]
    minified = " ".join(lines)
    # Safe cleanup around punctuation
    for ch in [';', '{', '}', '(', ')', ',', '=', '+', '-', ':', '?', '<', '>']:
        minified = minified.replace(f' {ch} ', ch)
        minified = minified.replace(f' {ch}', ch)
        minified = minified.replace(f'{ch} ', ch)

    return minified

if __name__ == '__main__':
    src_path = sys.argv[1] if len(sys.argv) > 1 else 'js/main.dev.js'
    dest_path = sys.argv[2] if len(sys.argv) > 2 else 'js/main.js'

    with open(src_path, 'r', encoding='utf-8') as f:
        src = f.read()

    obfuscated = obfuscate_js(src)

    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(obfuscated)

    print(f"Obfuscated {src_path} -> {dest_path} ({len(src)} bytes -> {len(obfuscated)} bytes)")

