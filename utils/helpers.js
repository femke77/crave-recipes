module.exports = {
    format_date: date => {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },
    toUpperCase: str => {
      return str.substring(0,1).toUpperCase() + str.substring(1);
    }
  };