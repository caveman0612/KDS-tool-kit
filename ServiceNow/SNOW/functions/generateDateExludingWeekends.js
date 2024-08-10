function generateDate(days) {
  var gdt = new GlideDateTime();
  var counter = 0;
  // var blocker = 0;
  while (counter < days) {
    // blocker++  && blocker < 90
    var day = gdt.getDayOfWeekLocalTime();
    if (day != 6 && day != 5) {
      gdt.addDaysLocalTime(1);
      counter++;
    } else {
      gdt.addDaysLocalTime(1);
    }
  }
  return gdt;
}

gs.info('end ' + generateDate(0));
