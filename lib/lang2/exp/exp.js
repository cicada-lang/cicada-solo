"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.the = exports.suite = exports.type = exports.quote = exports.str = exports.absurd_ind = exports.absurd = exports.sole = exports.trivial = exports.replace = exports.same = exports.equal = exports.nat_ind = exports.add1 = exports.zero = exports.nat = exports.cdr = exports.car = exports.cons = exports.sigma = exports.ap = exports.fn = exports.pi = exports.v = void 0;
exports.v = (name) => ({
    kind: "Exp.v",
    name,
});
exports.pi = (name, arg_t, ret_t) => ({
    kind: "Exp.pi",
    name,
    arg_t,
    ret_t,
});
exports.fn = (name, ret) => ({
    kind: "Exp.fn",
    name,
    ret,
});
exports.ap = (target, arg) => ({
    kind: "Exp.ap",
    target,
    arg,
});
exports.sigma = (name, car_t, cdr_t) => ({
    kind: "Exp.sigma",
    name,
    car_t,
    cdr_t,
});
exports.cons = (car, cdr) => ({
    kind: "Exp.cons",
    car,
    cdr,
});
exports.car = (target) => ({
    kind: "Exp.car",
    target,
});
exports.cdr = (target) => ({
    kind: "Exp.cdr",
    target,
});
exports.nat = { kind: "Exp.nat" };
exports.zero = { kind: "Exp.zero" };
exports.add1 = (prev) => ({
    kind: "Exp.add1",
    prev,
});
exports.nat_ind = (target, motive, base, step) => ({
    kind: "Exp.nat_ind",
    target,
    motive,
    base,
    step,
});
exports.equal = (t, from, to) => ({
    kind: "Exp.equal",
    t,
    from,
    to,
});
exports.same = {
    kind: "Exp.same",
};
exports.replace = (target, motive, base) => ({
    kind: "Exp.replace",
    target,
    motive,
    base,
});
exports.trivial = {
    kind: "Exp.trivial",
};
exports.sole = {
    kind: "Exp.sole",
};
exports.absurd = {
    kind: "Exp.absurd",
};
exports.absurd_ind = (target, motive) => ({
    kind: "Exp.absurd_ind",
    target,
    motive,
});
exports.str = {
    kind: "Exp.str",
};
exports.quote = (str) => ({
    kind: "Exp.quote",
    str,
});
exports.type = {
    kind: "Exp.type",
};
exports.suite = (defs, ret) => ({
    kind: "Exp.suite",
    defs,
    ret,
});
exports.the = (t, exp) => ({
    kind: "Exp.the",
    t,
    exp,
});
