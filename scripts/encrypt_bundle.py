#!/usr/bin/env python3
"""
GR Cryptographic Bundle Packer & Obfuscator
Encrypts js/main.dev.js into an encrypted, tamper-protected payload for js/main.js
"""

import sys
import os

def encrypt_code(source_code, key=0x7B):
    # XOR each character with a rotating key offset
    encrypted_bytes = []
    source_bytes = source_code.encode('utf-8')
    for i, b in enumerate(source_bytes):
        k = (key + (i % 37)) & 0xFF
        encrypted_bytes.append(b ^ k)

    # Convert to hex string
    hex_stream = "".join(f"{b:02x}" for b in encrypted_bytes)
    return hex_stream, key

def build_protected_bundle(source_code):
    hex_payload, key = encrypt_code(source_code)

    loader = f"""/* =========================================================================
 * 🛡️ SISTEM DE PROTECȚIE & CRIPTARE ACTIV — PORTOFOLIU GHEORGHEȘ RAREȘ (GR)
 * LEGEA NR. 8/1996 PRIVIND DREPTUL DE AUTOR ȘI DREPTURILE CONEXE
 * ACEST SCRIPT ESTE CRIPTAT & PROTEJAT ÎMPOTRIVA INSPECȚIEI NEAUTORIZATE
 * ========================================================================= */
(function(_0xRoot) {{
  'use strict';

  // 1. Alertă Securitate în DevTools Console
  try {{
    var _0xStyle1 = 'color: #f59e0b; font-size: 16px; font-weight: bold; background: #161618; padding: 8px 16px; border-radius: 4px; border: 1px solid #d97706;';
    var _0xStyle2 = 'color: #a1a1aa; font-size: 12px; line-height: 1.6; margin-top: 4px;';
    console.log('%c🔒 ZONĂ SECURIZATĂ — PORTOFOLIU GHEORGHEȘ RAREȘ (GR)', _0xStyle1);
    console.log('%cConținutul multimedia, montajele video și codul sursă sunt protejate prin drepturi de autor conform Legii nr. 8/1996.\\nInspectarea și extragerea neautorizată de active sunt restricționate.', _0xStyle2);
  }} catch (_0xE) {{}}

  // 2. Blocare comenzi de tastatură (F12, Inspect Element, View Source, Save)
  if (typeof window !== 'undefined') {{
    window.addEventListener('keydown', function(_0xE) {{
      if (_0xE.key === 'F12' || _0xE.keyCode === 123) {{
        _0xE.preventDefault();
        if (window.afiseazaToast) window.afiseazaToast('🛡️ Accesul la consola de dezvoltare este restricționat.');
        return false;
      }}
      var _0xMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      var _0xDev = _0xMac
        ? (_0xE.metaKey && _0xE.altKey && (_0xE.key === 'i' || _0xE.key === 'I' || _0xE.key === 'j' || _0xE.key === 'J' || _0xE.key === 'c' || _0xE.key === 'C'))
        : (_0xE.ctrlKey && _0xE.shiftKey && (_0xE.key === 'i' || _0xE.key === 'I' || _0xE.key === 'j' || _0xE.key === 'J' || _0xE.key === 'c' || _0xE.key === 'C'));
      if (_0xDev) {{
        _0xE.preventDefault();
        if (window.afiseazaToast) window.afiseazaToast('🛡️ Inspectarea elementelor este dezactivată pentru protecția codului.');
        return false;
      }}
      if ((_0xE.ctrlKey && (_0xE.key === 'u' || _0xE.key === 'U')) || (_0xMac && _0xE.metaKey && _0xE.altKey && (_0xE.key === 'u' || _0xE.key === 'U'))) {{
        _0xE.preventDefault();
        if (window.afiseazaToast) window.afiseazaToast('🛡️ Vizualizarea codului sursă brut este restricționată.');
        return false;
      }}
      if ((_0xE.ctrlKey || _0xE.metaKey) && (_0xE.key === 's' || _0xE.key === 'S')) {{
        _0xE.preventDefault();
        return false;
      }}
    }}, true);

    // 3. Blocare Right-Click (Context Menu)
    document.addEventListener('contextmenu', function(_0xE) {{
      var _0xTag = (_0xE.target && _0xE.target.tagName) ? _0xE.target.tagName.toLowerCase() : '';
      if (_0xTag === 'input' || _0xTag === 'textarea') return;
      _0xE.preventDefault();
      if (window.afiseazaToast) window.afiseazaToast('🛡️ Conținutul și codul sursă sunt protejate prin drepturi de autor.');
      return false;
    }});

    // 4. Blocare Tragere Imagini
    document.addEventListener('dragstart', function(_0xE) {{
      if (_0xE.target && _0xE.target.tagName && _0xE.target.tagName.toLowerCase() === 'img') {{
        _0xE.preventDefault();
      }}
    }});
  }}

  // 5. Motor Criptografic de Decodificare & Execuție Securizată
  var _0xK = {key};
  var _0xStream = '{hex_payload}';

  var _0xDecrypt = function(_0xHex, _0xKey) {{
    var _0xBytes = [];
    for (var _0xI = 0; _0xI < _0xHex.length; _0xI += 2) {{
      var _0xByte = parseInt(_0xHex.substr(_0xI, 2), 16);
      var _0xIdx = _0xI / 2;
      var _0xMask = (_0xKey + (_0xIdx % 37)) & 0xFF;
      _0xBytes.push(_0xByte ^ _0xMask);
    }}
    // Decodare UTF-8
    var _0xEscaped = '';
    for (var _0xJ = 0; _0xJ < _0xBytes.length; _0xJ++) {{
      _0xEscaped += '%' + ('0' + _0xBytes[_0xJ].toString(16)).slice(-2);
    }}
    try {{
      return decodeURIComponent(_0xEscaped);
    }} catch (_0xErr) {{
      var _0xStr = '';
      for (var _0xM = 0; _0xM < _0xBytes.length; _0xM++) {{
        _0xStr += String.fromCharCode(_0xBytes[_0xM]);
      }}
      return _0xStr;
    }}
  }};

  var _0xPayloadCode = _0xDecrypt(_0xStream, _0xK);
  (0, eval)(_0xPayloadCode);
}})(typeof window !== 'undefined' ? window : this);
"""
    return loader

if __name__ == '__main__':
    src_file = 'js/main.dev.js'
    dest_file = 'js/main.js'

    with open(src_file, 'r', encoding='utf-8') as f:
        src = f.read()

    bundle = build_protected_bundle(src)

    with open(dest_file, 'w', encoding='utf-8') as f:
        f.write(bundle)

    print(f"Packaged {src_file} -> {dest_file} ({len(src)} bytes source -> {len(bundle)} bytes protected payload)")

