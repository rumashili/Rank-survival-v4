//巨大な数を扱えるようにするための関数群。BigNumを通して得た数同士でのみ機能します。

BigNum = function(str = "0") {
  const BASE = 100000000; // 1e8

  let a = fromString(str);

  // --- 文字列 → 配列 ---
  function fromString(s) {
    s = String(s).replace(/^0+/, "") || "0";
    let res = [];
    for (let i = s.length; i > 0; i -= 8) {
      let start = Math.max(0, i - 8);
      res.push(Number(s.slice(start, i)));
    }
    return trim(res);
  }

  // --- 配列 → 文字列 ---
  function toString() {
    if (a.length === 0) return "0";
    let res = String(a[a.length - 1]);
    for (let i = a.length - 2; i >= 0; i--) {
      res += String(a[i]).padStart(8, "0");
    }
    return res;
  }

  // --- 不要な0削除 ---
  function trim(arr) {
    while (arr.length > 1 && arr[arr.length - 1] === 0) {
      arr.pop();
    }
    return arr;
  }

  // --- clone（安全コピー） ---
  function clone() {
    return BigNum(toString());
  }

  // --- 0判定 ---
  function isZero() {
    return a.length === 1 && a[0] === 0;
  }

  // --- 比較 ---
  function cmp(b) {
    const bb = b.a;
    if (a.length !== bb.length) return a.length - bb.length;
    for (let i = a.length - 1; i >= 0; i--) {
      if (a[i] !== bb[i]) return a[i] - bb[i];
    }
    return 0;
  }

  // --- 比較関数群 ---
  function gt(b)  { return cmp(b) > 0; }
  function gte(b) { return cmp(b) >= 0; }
  function lt(b)  { return cmp(b) < 0; }
  function lte(b) { return cmp(b) <= 0; }
  function eq(b)  { return cmp(b) === 0; }

  // --- 加算 ---
  function add(b) {
    const bb = b.a;
    let res = [];
    let carry = 0;
    let n = Math.max(a.length, bb.length);

    for (let i = 0; i < n; i++) {
      let sum = (a[i] || 0) + (bb[i] || 0) + carry;
      if (sum >= BASE) {
        carry = 1;
        sum -= BASE;
      } else {
        carry = 0;
      }
      res.push(sum);
    }
    if (carry) res.push(carry);

    a = trim(res);
    return api;
  }

  // --- 減算（a >= b 前提） ---
  function sub(b) {
    const bb = b.a;
    let res = [];
    let borrow = 0;

    for (let i = 0; i < a.length; i++) {
      let diff = a[i] - (bb[i] || 0) - borrow;
      if (diff < 0) {
        diff += BASE;
        borrow = 1;
      } else {
        borrow = 0;
      }
      res.push(diff);
    }

    a = trim(res);
    return api;
  }

  // --- 掛け算（BigNum × BigNum） ---
  function mul(b) {
    const bb = b.a;
    let res = new Array(a.length + bb.length).fill(0);

    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < bb.length; j++) {
        let product = a[i] * bb[j] + res[i + j];
        res[i + j] = product % BASE;
        res[i + j + 1] += Math.floor(product / BASE); // 次の桁に直接足し込む
      }
    }

    a = trim(res);
    return api;
  }

  // --- 掛け算（小さい数との最適化） ---
  function mulNum(num) {
    let res = [];
    let carry = 0;

    for (let i = 0; i < a.length; i++) {
      let cur = a[i] * num + carry;
      carry = Math.floor(cur / BASE);
      res[i] = cur % BASE;
    }

    while (carry > 0) {
      res.push(carry % BASE);
      carry = Math.floor(carry / BASE);
    }

    a = trim(res);
    return api;
  }

  const api = {
    a,
    toString,
    clone,
    isZero,
    cmp,
    gt,
    gte,
    lt,
    lte,
    eq,
    add,
    sub,
    mul,
    mulNum,
  };

  return api;
}