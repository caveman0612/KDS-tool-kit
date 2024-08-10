function revertToUpdate(tableName, sysId, updateNumber) {

	var current = buildHistoricalRecord(tableName, sysId, updateNumber)
	var previous = buildHistoricalRecord(tableName, sysId, updateNumber - 1)
    
    var brsTriggered = [];
    var brGR = new GlideRecord('sys_script');
    brGR.addQuery('collection', GlideDBObjectManager.get().getTables(tableName)); // look for parent tables too
    brGR.addQuery('active', true);
    brGR.query();

    while (brGR.next()) {
        var conditionBool = false;
        var filter_bool = false;

        var condition = brGR.getValue('condition');
        var filter_condition = brGR.getValue('filter_condition');

        if (condition) {
			var vars = {"current": current, "previous": previous}
			var evaluator = new GlideScopedEvaluator();
			conditionBool = evaluator.evaluateScript(brGR, 'condition', vars);

        } else {
            conditionBool = true;
        }

        if (filter_condition) {
			filter_bool = GlideFilter.checkRecord(current, filter_condition, true);
        } else {
            filter_bool = true;
        }
        if (conditionBool && filter_bool) {
            brsTriggered.push(brGR.name.toString());
        }
    }
    gs.print(brsTriggered.join("\n"));

}

function buildHistoricalRecord(tableName, sysId, updateNumber) {
    var histGR = new GlideRecord('sys_history_line');
    histGR.addQuery('set.id', sysId);
    histGR.addQuery('set.table', tableName);
    histGR.addQuery('update', ">=", updateNumber);
    histGR.addQuery('type', "audit");
    histGR.orderByDesc('sys_created_on');
    histGR.query();

    var recordGR = new GlideRecord(tableName);
    recordGR.get(sysId)

    while (histGR.next()) {
        recordGR.setValue(histGR.getValue("field"), histGR.getValue("old_value"));
    }
	return recordGR
}

revertToUpdate($TABLE, $sys_id, $0);