function revertToUpdate(tableName, sysId, updateNumber) {
    // Validate inputs
    if (!tableName || !sysId || !updateNumber) {
        gs.error("Missing required parameters.");
        return;
    }
    
    // Get the historical records for the given sys_id and table
    var histGR = new GlideRecord('sys_history_line');
    histGR.addQuery('set.id', sysId);
    histGR.addQuery('set.table', tableName);
    histGR.addQuery('update', ">=", updateNumber);
    histGR.addQuery('type', "audit");
    histGR.orderByDesc('sys_created_on');
    histGR.query();

   gs.print("kst " + histGR.getRowCount())
    var recordGR = new GlideRecord(tableName);
    recordGR.get(sysId)

    while (histGR.next()) {
        recordGR.setValue(histGR.getValue("field"), histGR.getValue("old"));

    }

    // Check which business rules would have been triggered
    var brsTriggered = [];
    var brGR = new GlideRecord('sys_script');
    brGR.addQuery('collection', tableName); // look for parent
    brGR.addQuery('active', true);
    brGR.query();

    gs.print("kst1 " + brGR.getRowCount())

    while (brGR.next()) {
        var conditionBool = false;
        var filter_conditionBool = false;
        var condition = brGR.getValue('condition');
        var filter_condition = brGR.getValue('filter_condition');

        if (condition) {
            var gfCondition = new GlideFilter(condition, "condition");
        }

        if (filter_condition) {
            var gfFilter = new GlideFilter(filter_condition, "filter_condition");
        }


        // gs.print(brGR.name.toString())
        // gs.print(condition)
        // gs.print(filter_condition)

        
        

        if (gfCondition.match(recordGR, true) && gfFilter.match(recordGR, true)) {
            brsTriggered.push(brGR.name.toString());
        }
    }

    return brsTriggered;
}

revertToUpdate("sn_customerservice_case", "3e27a89d87364a10db34bbbf8bbb350e", 13)