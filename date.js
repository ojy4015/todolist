// module.exports = "Hello World";
// console.log(module);

// binding exports to getDate funcion
exports.getDate = function() {
  const today = new Date();
  const currentDay = today.getDay();

  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return today.toLocaleDateString("ko-KR", options); // Saturday, September 17, 2016
}

// binding exports to getDay funcion
exports.getDay = function () {
  const today = new Date();
  const currentDay = today.getDay();

  let options = {
    weekday: 'long',
  };

  return today.toLocaleDateString("ko-KR", options); // Saturday, September 17, 2016
}

// console.log(module.exports);
