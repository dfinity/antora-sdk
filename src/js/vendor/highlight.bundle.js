(function() {
  "use strict";

  var hljs = require("highlight.js/lib/highlight");
  hljs.registerLanguage(
    "asciidoc",
    require("highlight.js/lib/languages/asciidoc")
  );
  hljs.registerLanguage("bash", require("highlight.js/lib/languages/bash"));
  hljs.registerLanguage("css", require("highlight.js/lib/languages/css"));
  hljs.registerLanguage("diff", require("highlight.js/lib/languages/diff"));
  hljs.registerLanguage(
    "dockerfile",
    require("highlight.js/lib/languages/dockerfile")
  );
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
  hljs.registerLanguage(
    "markdown",
    require("highlight.js/lib/languages/markdown")
  );
  hljs.registerLanguage("rust", require("highlight.js/lib/languages/rust"));  
  hljs.registerLanguage("shell", require("highlight.js/lib/languages/shell"));
  hljs.registerLanguage("yaml", require("highlight.js/lib/languages/yaml"));
  hljs.registerLanguage("motoko", function(hljs) {
    return {
      name: 'Motoko',
      aliases: ['mo'],
      keywords: {
        $pattern: '[a-zA-Z_]\\w*',
        keyword: 'actor and async await break case catch class' +
          ' continue debug else for func if in import' +
          ' module not object or label let loop private' +
          ' public return shared try throw query switch' +
          ' type var while stable flexible system',
        literal: 'true false null',
        built_in: 'Any None Null Bool Int Int8 Int16 Int32 Int64' +
          ' Nat Nat8 Nat16 Nat32 Nat64 Word8 Word16 Word32 Word64' +
          ' Float Char Text Blob Error Principal' +
          ' debug_show assert',
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
        {
          className: 'string',
          variants: [
            {
              begin: /r(#*)"(.|\n)*?"\1(?!#)/
            },
            {
              begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/
            }
          ]
        },
        {
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
          end: /\{/,
          contains: [
            hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, {
              endsParent: true
            })
          ],
          illegal: '[\\w\\d]'
        },
      ],
    };
  });
  hljs.initHighlighting();
  window.hljs = hljs;
})();
