(function() {
  "use strict";

  var hljs = require("highlight.js/lib/highlight");

  function registerMotoko() {
    var string = {
      className: 'string',
      variants: [
        {
          begin: /r(#*)"(.|\n)*?"\1(?!#)/
        },
        {
          begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/
        }
      ]
    };
    var number = {
      className: 'number',
      variants: [
        {
          begin: '[+-]?\\b0[xX]([A-Fa-f0-9_]+)'
        },
        {
          begin: '[+-]?\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)'
        }
      ],
      relevance: 0
    };
    hljs.registerLanguage("motoko", function(hljs) {
      return {
        name: 'Motoko',
        aliases: ['mo'],
        keywords: {
          $pattern: '[a-zA-Z_]\\w*',
          keyword: 'actor and await break case catch class' +
            ' continue debug do else for func if in import' +
            ' module not object or label let loop private' +
            ' public return shared try throw query switch' +
            ' type var while stable flexible system debug_show assert ignore',
          literal: 'true false null',
          built_in: 'Any None Null Bool Int Int8 Int16 Int32 Int64' +
            ' Nat Nat8 Nat16 Nat32 Nat64 Word8 Word16 Word32 Word64' +
            ' Float Char Text Blob Error Principal' +
            ' async',
        },
        illegal: '</',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.COMMENT('/\\*', '\\*/', {
            contains: [ 'self' ]
          }),
          hljs.inherit(hljs.QUOTE_STRING_MODE, {
            begin: /b?"/,
            illegal: null
          }),  
          string,
          number,
          {
            className: 'symbol',
            begin: '#' + hljs.UNDERSCORE_IDENT_RE
          },
          {
            className: 'function',
            beginKeywords: 'func',
            end: '(\\(|<)',
            excludeEnd: true,
            contains: [ hljs.UNDERSCORE_TITLE_MODE ]
          },
          {
            className: 'class',
            begin: '\\b(actor(\ class)?|module|object)\\b',
            keywords: 'actor class module object',
            end: '(\\(|<|\{)',
            contains: [ hljs.UNDERSCORE_TITLE_MODE ],
            illegal: '[\\w\\d]'
          },
          {
            className: 'built_in',
            beginKeywords: 'import type',
            end: '(;|$|=)',
            excludeEnd: true,
            contains: [
              hljs.QUOTE_STRING_MODE,
              hljs.C_LINE_COMMENT_MODE,
              hljs.COMMENT('/\\*', '\\*/', {
                contains: [ 'self' ]
              }),  
            ]
          },
        ],
      };
    });
    hljs.registerLanguage("candid", function(hljs) {
      return {
        name: 'Candid',
        aliases: ['did'],
        keywords: {
          $pattern: '[a-zA-Z_]\\w*',
          keyword: 'import service type',
          built_in: 'opt vec record variant func blob principal' +
            ' nat nat8 nat16 nat32 nat64 int int8 int16 int32 int64' +
            ' float32 float64 bool text null reserved empty' +
            ' oneway query',
        },
        illegal: '</',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.COMMENT('/\\*', '\\*/', {
            contains: [ 'self' ]
          }),
          hljs.inherit(hljs.QUOTE_STRING_MODE, {
            begin: /b?"/,
            illegal: null
          }),  
          string,
          number,
        ],
      };
    });
  }
  
  hljs.registerLanguage("bash", require("highlight.js/lib/languages/bash"));
  hljs.registerLanguage("bnf", require("highlight.js/lib/languages/bnf"));  
  hljs.registerLanguage("css", require("highlight.js/lib/languages/css"));
  hljs.registerLanguage("diff", require("highlight.js/lib/languages/diff"));
  hljs.registerLanguage("http", require("highlight.js/lib/languages/http"));
  hljs.registerLanguage(
    "javascript",
    require("highlight.js/lib/languages/javascript")
  );
  hljs.registerLanguage("json", require("highlight.js/lib/languages/json"));
  hljs.registerLanguage(
    "makefile",
    require("highlight.js/lib/languages/makefile")
  );
  hljs.registerLanguage("rust", require("highlight.js/lib/languages/rust"));  
  hljs.registerLanguage("shell", require("highlight.js/lib/languages/shell"));
  registerMotoko();
  hljs.initHighlighting();
  window.hljs = hljs;
})();
