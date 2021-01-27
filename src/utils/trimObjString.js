// String trim function
function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
//Entry
export default function trimObj(obj) {
  if (Object.prototype.toString.call(obj) === "[object Object]") {
    //   Object
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = Trim(obj[key]);
      } else {
        trimObj(obj[key]);
      }
    }
  } else if (Array.isArray(obj)) {
    // Array
    obj.forEach((item, index) => {
      if (typeof item === "string") {
        obj[index] = Trim(obj[index]);
      } else {
        trimObj(item);
      }
    });
  }
}
