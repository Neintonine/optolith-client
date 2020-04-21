// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");

function zipBy(showKey, merge, getKeyFromOptional, getKeyFromRequired, optionals, requireds) {
  if (requireds) {
    var r = requireds[0];
    var match = List.find_opt((function (o) {
            var k = Curry._1(getKeyFromOptional, o);
            return Caml_obj.caml_equal(k, Curry._1(getKeyFromRequired, r));
          }), optionals);
    if (match !== undefined) {
      return /* :: */[
              Curry._2(merge, Caml_option.valFromOption(match), r),
              zipBy(showKey, merge, getKeyFromOptional, getKeyFromRequired, optionals, requireds[1])
            ];
    } else {
      throw [
            Json_decode.DecodeError,
            "zipBy: No matching entry found at key " + Curry._1(showKey, Curry._1(getKeyFromRequired, r))
          ];
    }
  } else {
    return /* [] */0;
  }
}

function zipByPartition(showKey, mapBoth, mapSingle, getKeyFromOptional, getKeyFromRequired, optionals, requireds) {
  if (requireds) {
    var rs = requireds[1];
    var r = requireds[0];
    var match = List.find_opt((function (o) {
            var k = Curry._1(getKeyFromOptional, o);
            return Caml_obj.caml_equal(k, Curry._1(getKeyFromRequired, r));
          }), optionals);
    if (match !== undefined) {
      var param = zipByPartition(showKey, mapBoth, mapSingle, getKeyFromOptional, getKeyFromRequired, optionals, rs);
      return /* tuple */[
              /* :: */[
                Curry._2(mapBoth, Caml_option.valFromOption(match), r),
                param[0]
              ],
              param[1]
            ];
    } else {
      var param$1 = zipByPartition(showKey, mapBoth, mapSingle, getKeyFromOptional, getKeyFromRequired, optionals, rs);
      return /* tuple */[
              param$1[0],
              /* :: */[
                Curry._1(mapSingle, r),
                param$1[1]
              ]
            ];
    }
  } else {
    return /* tuple */[
            /* [] */0,
            /* [] */0
          ];
  }
}

exports.zipBy = zipBy;
exports.zipByPartition = zipByPartition;
/* No side effect */