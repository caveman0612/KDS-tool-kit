// To add Days
var d = new Date();
d.setDate(d.getDate() + 5);

// To add Months
var m = new Date();
m.setMonth(m.getMonth() + 5);

// To add Years
var y = new Date();
y.setFullYear(y.getFullYear() + 5);

//--------------------------------------------------
var cur = new Date();
cur.setMonth(cur.getMonth() + 1);
var newDate = cur.toISOString();
newDate = newDate.substring(0, newDate.indexOf("T"));
gel("escalation_expires").value = newDate;


//-----------------------------------------------