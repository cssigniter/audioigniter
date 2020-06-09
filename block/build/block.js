(window.wp = window.wp || {}),
  (window.wp.block = (function(e) {
    var t = {};
    function r(a) {
      if (t[a]) return t[a].exports;
      var n = (t[a] = { i: a, l: !1, exports: {} });
      return e[a].call(n.exports, n, n.exports, r), (n.l = !0), n.exports;
    }
    return (
      (r.m = e),
      (r.c = t),
      (r.d = function(e, t, a) {
        r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: a });
      }),
      (r.r = function(e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (r.t = function(e, t) {
        if ((1 & t && (e = r(e)), 8 & t)) return e;
        if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
        var a = Object.create(null);
        if (
          (r.r(a),
          Object.defineProperty(a, 'default', { enumerable: !0, value: e }),
          2 & t && 'string' != typeof e)
        )
          for (var n in e)
            r.d(
              a,
              n,
              function(t) {
                return e[t];
              }.bind(null, n),
            );
        return a;
      }),
      (r.n = function(e) {
        var t =
          e && e.__esModule
            ? function() {
                return e.default;
              }
            : function() {
                return e;
              };
        return r.d(t, 'a', t), t;
      }),
      (r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (r.p = ''),
      r((r.s = 10))
    );
  })([
    function(e, t) {
      e.exports = window.wp.i18n;
    },
    function(e, t, r) {
      e.exports = r(8)();
    },
    function(e, t) {
      e.exports = window.wp.element;
    },
    function(e, t) {
      e.exports = window.wp.components;
    },
    function(e, t) {
      e.exports = window.wp.blockEditor;
    },
    function(e, t) {
      e.exports = window.wp.blocks;
    },
    function(e, t) {
      e.exports = window.wp.data;
    },
    function(e, t) {
      e.exports = window.wp.serverSideRender;
    },
    function(e, t, r) {
      'use strict';
      var a = r(9);
      function n() {}
      e.exports = function() {
        function e(e, t, r, n, i, o) {
          if (o !== a) {
            var l = new Error(
              'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
            );
            throw ((l.name = 'Invariant Violation'), l);
          }
        }
        function t() {
          return e;
        }
        e.isRequired = e;
        var r = {
          array: e,
          bool: e,
          func: e,
          number: e,
          object: e,
          string: e,
          symbol: e,
          any: e,
          arrayOf: t,
          element: e,
          instanceOf: t,
          node: e,
          objectOf: t,
          oneOf: t,
          oneOfType: t,
          shape: t,
          exact: t,
        };
        return (r.checkPropTypes = n), (r.PropTypes = r), r;
      };
    },
    function(e, t, r) {
      'use strict';
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
    },
    function(e, t, r) {
      'use strict';
      r.r(t);
      var a = r(0),
        n = r(5),
        i = r(2),
        o = r(6),
        l = r(3),
        u = r(4),
        c = r(7),
        p = r.n(c),
        s = [],
        d = function(e) {
          var t = e.attributes,
            r = e.setAttributes,
            a = e.clientId,
            n = t.uniqueId;
          Object(i.useEffect)(function() {
            if (!n || s.includes(n)) {
              var e = a.substr(2, 9);
              return s.push(e), void r({ uniqueId: e });
            }
            n && !s.includes(n) && s.push(n);
          }, []);
        };
      var b,
        m = function(e) {
          var t = e.attributes.playerId;
          return (
            Object(i.useEffect)(function() {
              t &&
                setTimeout(function() {
                  var e = document.querySelectorAll('#audioigniter-' + t);
                  e.length > 0 &&
                    []
                      .concat(
                        (function(e) {
                          if (Array.isArray(e)) {
                            for (
                              var t = 0, r = Array(e.length);
                              t < e.length;
                              t++
                            )
                              r[t] = e[t];
                            return r;
                          }
                          return Array.from(e);
                        })(e),
                      )
                      .forEach(function(e) {
                        return __CI_AUDIOIGNITER_MANUAL_INIT__(e);
                      });
                }, 600);
            }, []),
            'Loading playlist...'
          );
        },
        f = r(1),
        w = r.n(f),
        v =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function(e) {
                return typeof e;
              }
            : function(e) {
                return e &&
                  'function' == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e;
              };
      function y(e, t, r) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = r),
          e
        );
      }
      var g = { children: w.a.string.isRequired, id: w.a.string },
        h = 'tablet',
        k = 'mobile',
        _ = (y((b = {}), 'desktop', ''), y(b, h, 991), y(b, k, 575), b),
        O = function(e) {
          var t = e.id,
            r = e.value,
            n = e.rule,
            i = e.unit,
            o = void 0 === i ? '' : i,
            l = e.edgeCase;
          if (null == r || '' === r) return null;
          var u = '#' + t,
            c = n
              .split(',')
              .map(function(e) {
                return u + ' ' + e;
              })
              .join(',');
          return l && l.edge === r
            ? Object(a.sprintf)(c, l.value)
            : Object(a.sprintf)(c, '' + r + o);
        },
        C = function(e, t) {
          var r = [
            { name: 'desktop', media: 'max', width: _.desktop, rules: [] },
            { name: 'tablet', media: 'max', width: _.tablet, rules: [] },
            { name: 'mobile', media: 'max', width: _.mobile, rules: [] },
            {
              name: 'desktop-only',
              media: 'min',
              width: _.tablet + 1,
              rules: [],
            },
            {
              name: 'tablet-only',
              media: 'min',
              width: _.mobile + 1,
              rules: [],
            },
          ];
          return i.Children.toArray(t).reduce(function(t, r) {
            var a = r.props,
              n = a.value,
              i = a.rule,
              o = a.unit,
              l = a.edgeCase,
              u = a.breakpointLimit;
            if (
              'object' !== (void 0 === n ? 'undefined' : v(n)) ||
              !('desktop' in n)
            ) {
              var c = t.find(function(e) {
                  return 'desktop' === e.name;
                }),
                p = O({ id: e, value: n, rule: i, unit: o, edgeCase: l });
              return null != p && c.rules.push(p), t;
            }
            return (
              Object.keys(n).forEach(function(r) {
                var a = t.find(function(e) {
                    var t = e.name;
                    return u && 'mobile' !== r ? r + '-only' === t : t === r;
                  }),
                  c = O({
                    id: e,
                    value: n[r],
                    rule: i,
                    unit: o,
                    edgeCase: l,
                    breakpointLimit: u,
                  });
                null != c && a.rules.push(c);
              }),
              t
            );
          }, r);
        },
        E = function(e) {
          return e
            .reduce(function(e, t) {
              if (!t.rules.length) return e;
              var r = t.rules
                .map(function(e) {
                  return e.trim();
                })
                .join('\n');
              return t.width
                ? 'tablet-only' === t.name
                  ? e +
                    '\n\n          @media (min-width: ' +
                    (_.mobile + 1) +
                    'px) and (max-width: ' +
                    _.tablet +
                    'px) {\n            ' +
                    r +
                    '\n          }\n        '
                  : e +
                    '\n\n      @media (' +
                    t.media +
                    '-width: ' +
                    t.width +
                    'px) {\n        ' +
                    r +
                    '\n      }\n    '
                : '' + e + r + '\n';
            }, '')
            .trim();
        },
        j = function(e) {
          var t = e.id,
            r = void 0 === t ? '' : t,
            a = e.children,
            n = e.methods,
            i =
              void 0 === n
                ? { getStylesArrayFromChildren: C, generateStyles: E }
                : n,
            o = i.getStylesArrayFromChildren,
            l = i.generateStyles,
            u = o(r, a);
          return (function(e) {
            return e.every(function(e) {
              return 0 === e.rules.length;
            });
          })(u)
            ? null
            : wp.element.createElement('style', {
                dangerouslySetInnerHTML: { __html: l(u) },
              });
        };
      j.propTypes = g;
      var x = j,
        A = {
          value: w.a.oneOfType([w.a.string, w.a.number, w.a.object]).isRequired,
          rule: w.a.string.isRequired,
          unit: w.a.oneOf([
            'px',
            '%',
            'em',
            'rem',
            'vh',
            'vw',
            'pt',
            'cm',
            'mm',
          ]),
          edgeCase: w.a.shape({
            edge: w.a.any.isRequired,
            value: w.a.string.isRequired,
          }),
          breakpointLimit: w.a.bool,
        },
        I = function() {
          return null;
        };
      I.propTypes = A;
      var S = I,
        T = function(e) {
          var t = e.attributes,
            r = t.uniqueId,
            a = t.backgroundColor,
            n = t.textColor,
            i = t.accentColor,
            o = t.textOnAccentColor,
            l = t.controlColor;
          return wp.element.createElement(
            x,
            { id: 'audioigniter-block-' + r },
            wp.element.createElement(S, {
              rule: '.ai-wrap { background-color: %s; }',
              value: a,
            }),
            wp.element.createElement(S, {
              rule: '.ai-wrap .ai-volume-bar { border-right-color: %s; }',
              value: a,
            }),
            wp.element.createElement(S, {
              rule: '.ai-wrap .ai-track-btn { border-left-color: %s; }',
              value: a,
            }),
            wp.element.createElement(S, {
              rule:
                '.ai-wrap, .ai-wrap .ai-btn, .ai-wrap .ai-track-btn { color: %s; }',
              value: n,
            }),
            wp.element.createElement(S, {
              rule:
                ' .ai-wrap .ai-btn svg, .ai-wrap .ai-track-no-thumb svg, .ai-wrap .ai-track-btn svg { fill: %s; }',
              value: n,
            }),
            wp.element.createElement(S, {
              rule:
                '.ai-wrap .ai-audio-control, .ai-wrap .ai-audio-control:hover, .ai-wrap .ai-audio-control:focus, .ai-wrap .ai-track-progress, .ai-wrap .ai-volume-bar.ai-volume-bar-active::before, .ai-wrap .ai-track:hover, .ai-wrap .ai-track.ai-track-active, .ai-wrap .ai-btn.ai-btn-active { background-color: %s; }',
              value: i,
            }),
            wp.element.createElement(S, {
              rule:
                '.ai-wrap .ai-scroll-wrap > div:last-child div { background-color: %s !important; }',
              value: i,
            }),
            wp.element.createElement(S, {
              rule:
                ' .ai-wrap .ai-btn:hover, .ai-wrap .ai-btn:focus, .ai-wrap .ai-footer a, .ai-wrap .ai-footer a:hover { color: %s; }',
              value: i,
            }),
            wp.element.createElement(S, {
              rule:
                ' .ai-wrap .ai-btn:hover svg, .ai-wrap .ai-btn:focus svg  { fill: %s; }',
              value: i,
            }),
            wp.element.createElement(S, {
              rule:
                ' .ai-wrap .ai-audio-control, .ai-wrap .ai-track:hover, .ai-wrap .ai-track.ai-track-active, .ai-wrap .ai-track.ai-track-active .ai-track-btn, .ai-wrap .ai-track:hover .ai-track-btn, .ai-wrap .ai-btn.ai-btn-active { color: %s; } ',
              value: o,
            }),
            wp.element.createElement(S, {
              rule:
                ' .ai-wrap .ai-audio-control path, .ai-wrap .ai-track.ai-track-active .ai-track-btn path, .ai-wrap .ai-track:hover .ai-track-btn path, .ai-wrap .ai-btn.ai-btn-active path { fill: %s; } ',
              value: o,
            }),
            wp.element.createElement(S, {
              rule:
                ' .ai-wrap .ai-track-progress-bar, .ai-wrap .ai-volume-bar, .ai-wrap .ai-btn, .ai-wrap .ai-btn:hover, .ai-wrap .ai-btn:focus, .ai-wrap .ai-track, .ai-wrap .ai-track-no-thumb { background-color: %s; } ',
              value: l,
            }),
            wp.element.createElement(S, {
              rule:
                ' .ai-wrap .ai-scroll-wrap > div:last-child { background-color: %s; } ',
              value: l,
            }),
            wp.element.createElement(S, {
              rule: ' .ai-wrap .ai-footer { border-top-color: %s; } ',
              value: l,
            }),
            wp.element.createElement(S, {
              rule:
                ' .ai-wrap.ai-is-loading .ai-control-wrap-thumb::after, .ai-wrap.ai-is-loading .ai-track-title::after, .ai-wrap.ai-is-loading .ai-track-subtitle::after { background: %s; } ',
              value: l,
            }),
          );
        };
      function P(e) {
        if (Array.isArray(e)) {
          for (var t = 0, r = Array(e.length); t < e.length; t++) r[t] = e[t];
          return r;
        }
        return Array.from(e);
      }
      var R = function(e) {
        var t = e.attributes,
          r = e.setAttributes,
          n = e.className,
          c = e.clientId,
          s = t.uniqueId,
          b = t.playerId,
          f = t.backgroundColor,
          w = t.textColor,
          v = t.accentColor,
          y = t.textOnAccentColor,
          g = t.controlColor;
        d({ attributes: t, setAttributes: r, clientId: c });
        var h = Object(o.useSelect)(function(e) {
            return {
              playlists: (0, e('core').getEntityRecords)(
                'postType',
                'ai_playlist',
                { per_page: -1 },
              ),
            };
          }).playlists,
          k = void 0 === h ? [] : h;
        return wp.element.createElement(
          i.Fragment,
          null,
          wp.element.createElement(
            'div',
            { id: 'audioigniter-block-' + s, className: n },
            wp.element.createElement(T, { attributes: t }),
            wp.element.createElement(p.a, {
              block: 'audioigniter/player',
              attributes: { uniqueId: s, playerId: b },
              LoadingResponsePlaceholder: m,
            }),
          ),
          wp.element.createElement(
            u.InspectorControls,
            null,
            wp.element.createElement(
              l.PanelBody,
              { title: Object(a.__)('Settings'), initialOpen: !0 },
              wp.element.createElement(l.SelectControl, {
                label: Object(a.__)('Playlist'),
                value: b,
                options: [
                  { label: Object(a.__)('Select a playlist'), value: null },
                ].concat(
                  P(
                    (k || []).map(function(e) {
                      return { label: e.title.raw, value: e.id };
                    }),
                  ),
                ),
                onChange: function(e) {
                  return r({ playerId: e });
                },
              }),
            ),
            wp.element.createElement(u.PanelColorSettings, {
              title: Object(a.__)('Player Appearance'),
              initialOpen: !1,
              colorSettings: [
                {
                  value: f,
                  onChange: function(e) {
                    return r({ backgroundColor: e });
                  },
                  label: Object(a.__)('Background Color'),
                },
                {
                  value: w,
                  onChange: function(e) {
                    return r({ textColor: e });
                  },
                  label: Object(a.__)('Text Color'),
                },
                {
                  value: v,
                  onChange: function(e) {
                    return r({ accentColor: e });
                  },
                  label: Object(a.__)('Accent Color'),
                },
                {
                  value: y,
                  onChange: function(e) {
                    return r({ textOnAccentColor: e });
                  },
                  label: Object(a.__)('Text on Accent Color'),
                },
                {
                  value: g,
                  onChange: function(e) {
                    return r({ controlColor: e });
                  },
                  label: Object(a.__)('Controls Color'),
                },
              ],
            }),
          ),
        );
      };
      Object(n.registerBlockType)('audioigniter/player', {
        title: Object(a.__)('AudioIgniter Player'),
        description: Object(a.__)('Display your AudioIgniter player'),
        icon: 'A',
        category: 'audioigniter',
        keywords: [
          Object(a.__)('playlist'),
          Object(a.__)('audioigniter'),
          Object(a.__)('player'),
        ],
        attributes: {
          uniqueId: { type: 'string' },
          playerId: { type: 'string' },
          backgroundColor: { type: 'string' },
          textColor: { type: 'string' },
          accentColor: { type: 'string' },
          textOnAccentColor: { type: 'string' },
          controlColor: { type: 'string' },
        },
        edit: R,
        save: function() {
          return null;
        },
      });
    },
  ]));
