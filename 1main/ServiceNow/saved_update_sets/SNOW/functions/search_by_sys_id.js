function searchid(sys_id) {
  gs.print('Searching tables for ' + sys_id);

  var baseTables = new GlideRecord('sys_db_object');
  baseTables.addEncodedQuery(
    'super_classISEMPTY^nameNOT LIKEts_c_^nameNOT LIKEsysx_^nameNOT LIKEv_'
  );
  baseTables.query();

  while (baseTables._next()) {
    var tableName = baseTables.name;
    // Is it a valid sys_id
    var sd = new GlideRecord('sys_dictionary');
    sd.addQuery('name', tableName);
    sd.addQuery('element', 'sys_id');
    sd.queryNoDomain();
    if (!sd.next()) continue;

    // Search the table
    var current = new GlideRecord(tableName);
    current.addQuery('sys_id', sys_id);
    current.queryNoDomain();
    if (current._next()) {
      gs.print(
        'Found it in ' +
          current.getClassDisplayValue() +
          ' [' +
          current.getRecordClassName() +
          '] <a href="' +
          current.getLink() +
          '" target="_blank" >Link</a>'
      );
      break;
    }
  }
  gs.print('End of Search');
}

searchid('sys_id');
