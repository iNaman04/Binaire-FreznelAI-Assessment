export function debounce(fn, wait) {
  let timer = null;
  return function () {
    const args = arguments;
    const context = this;
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      fn.apply(context, args);
    }, wait);
  };
}

export function throttle(fn, wait) {
  let last = 0;
  let timer = null;
  return function () {
    const now = Date.now();
    const args = arguments;
    const context = this;
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      window.clearTimeout(timer);
      timer = null;
      last = now;
      fn.apply(context, args);
    } else if (!timer) {
      timer = window.setTimeout(function () {
        last = Date.now();
        timer = null;
        fn.apply(context, args);
      }, remaining);
    }
  };
}