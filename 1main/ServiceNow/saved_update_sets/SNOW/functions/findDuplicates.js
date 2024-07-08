function findDuplicates(table, query, field) {
  var gr = new GlideRecord(table);
  gr.addEncodedQuery(query);
  gr.query();

  var log = {};
  while (gr.next()) {
    var field_value = gr.getValue(field);

    if (field_value in log) {
      var sys_id_list = log[field_value].sys_id_list + "," + gr.getUniqueValue()
      var count = log[field_value].count + 1

      log[field_value] = {sys_id_list:sys_id_list, count:count};
    } else {
      log[field_value] = {sys_id_list: gr.getUniqueValue(), count: 1}
    }
  }
    // gs.info(JSON.stringify(log))
  var dups = {};
  for (var key in log) {
    var value = log[key].count;
    if (value > 1) dups[key] = log[key];
  }
  //   gs.info(JSON.stringify(dups))
  return JSON.stringify(dups);
}
gs.info(
  findDuplicates(
    '$table',
    'active=true^task.active=true^task.state!=6^u_case!=null',
    'u_case'
  )
);






hasDuplicate: function(table, filter, field) {
  var answer = false;
  var isDuplicatePresent = new GlideAggregate(table);
  isDuplicatePresent.addEncodedQuery(filter);
  isDuplicatePresent.addAggregate('COUNT');
  isDuplicatePresent.groupBy(field);
  isDuplicatePresent.addHaving('COUNT', '>', 1);
  isDuplicatePresent.query();
  if (isDuplicatePresent.hasNext()) {
      answer = true;
  }
  return answer;
}