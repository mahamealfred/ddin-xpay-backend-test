const findNetAmount =(amount)=> {
    if (amount >= 1 && amount <= 1000) {
      return parseFloat(amount) + 160;
    } else if (amount >= 1001 && amount <= 10000) {
      return parseFloat(amount)+300;
    } else if (amount >= 10001 && amount <= 40000) {
      return parseFloat(amount)+500;
    } else if (amount >= 40001 && amount <= 75000) {
      return parseFloat(amount)+1000;
    } else if (amount >= 75001 && amount <= 150000) {
      return parseFloat(amount)+1500;
    } else if (amount >= 150001 && amount <= 500000) {
      return parseFloat(amount)+2000;
    } else if (amount >= 500001) {
      return parseFloat(amount)+3000;
    } else {
      return 0;
    }
  };
  module.exports=findNetAmount