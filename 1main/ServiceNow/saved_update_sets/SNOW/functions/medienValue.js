var count = new GlideAggregate('customer_project_task');
count.addEncodedQuery('work_duration!=NULL');
count.addAggregate('COUNT');
count.query();
var num = 0;
if (count.next()) {
  num = parseInt(count.getAggregate('COUNT'), 10) / 2;
  num = Math.floor(num);
  var list = new GlideRecord('customer_project_task');
  list.addEncodedQuery('work_duration!=NULL');
  list.orderBy('work_duration');
  list.chooseWindow(num, num + 1);
  list.query();
  if (list.next()) {
    gs.info(list.getUniqueValue());
    var gdt1 = new GlideDateTime(list.work_start.getDisplayValue());
    var gdt2 = new GlideDateTime(list.work_end.getDisplayValue());
    var duration2 = GlideDateTime.subtract(gdt1, gdt2);
    // var duration2 = GlideDateTime.subtract(gdt1, gdt2);
    gs.info(duration2.getDisplayValue());
  }
}

// var list = new GlideRecord("customer_project_task");
// list.addEncodedQuery("work_duration!=javascript:gs.getDurationDate('0 0:0:0')");
// // list.addEncodedQuery("work_duration!=javascript:gs.getDurationDate('0 0:0:0')^active=true");

// list.query();
// var total = list.getRowCount() / 2
// var i = 0
// while (list.next()){
//     if (i == total) {
//             var gdt1 = GlideDateTime(list.work_start.getDisplayValue());
//             var gdt2 = GlideDateTime(list.work_end.getDisplayValue());
//             var duration2 = GlideDateTime.subtract(gdt1, gdt2);

//             gs.info(duration2.getDisplayValue())
//             break
//     }

//     i++
// };
