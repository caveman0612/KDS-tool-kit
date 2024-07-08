/**
 * Script used to replace all references to given sys_id.
 *
 * Example: find all referenced instances of a customer_account record and replace it with the
 * correct customer account record.
 *
 * Usage:
 * - copy into xplore
 * - go to the config section and set the appropriate variables
 * - if using record filters update any config variables in that section.
 * - run the script as a dryrun
 * - make note of the output and ensure the values to be changed are accurate
 * - once verified, run the script again with dryrun = false
 * - prove all updates were successful by setting dryrun back to true and running one more time.
 *   There shouldn't be any update records. If there are, then something occured that would prevent
 *   the update from occuring.
 */

/*************************/
/* CONFIGURATION SECTION */
/*************************/

// prevents the writes from actually happening
// all work and output is still processed.
var dryrun = true;

// the table that corresponds to the reference field we are trying to modify
// e.g., 'customer_account'
var referenceTable = 'customer_account';

// the sys_id of the record we are trying to replace.
// e.g., the sys id of the account we want replaced: '08d620b51bb3f700b6fa41d8cd4bcbb4'

var currentReferenceSysID = '457b5942db7f1f000da080c74b961913'; // OLD ACCOUNT

// the sys_id of the correct record that will replace the current value.
// e.g., the sys id of the correct account we now want referenced: '0e366d0cdb32bb885f50d7764896197b'

var newReferenceSysID = '71a417c9dbb8338c5f50d7764896194d'; // NEW ACCOUNT

// sets a threshold on the number of tables search. Current internal table count is aprox. 4k.
// can be useful to set to a low value when testing.
var tableLimit = 10000;

// Logs each table that was searched.
// can be useful for debugging but creates a lot of output.
var logTablesSearched = false;

// Enables or disables the running of business rules, script engines, and audit.
// I.e., false disables and true enables.
var setWorkFlow = false;
var autoSysFields = false;

// Enables record filters, allowing us to put additional restraints on updating certain tables.
// set to true if we want to prevent old cases from being updated.
var enableRecordFilters = true;

// Add in the record filters we want used. enableRecordFilters must be true for this to be used.
// E.g., ['taskDateFilter'], or ['taskDateFilter', 'someOtherFilterToo']
//var recordFilters = ['tableFilter', 'locationFilter'];
var recordFilters = ['tableFilter'];

/*************************/

/*************************/
/* Script vars           */
/*************************/
var updatedTablesDict = new Object();
/*************************/

/*********************************/
/* RECORD FILTERS CONFIG SECTION */
/*********************************/

/* TASK DATE FILTER VARS */

// date to perform the comparison with. Format: UTC time zone specified with the format yyyy-MM-dd HH:mm:ss
// e.g., '2019-02-19 14:27:53'
// IMPORTANT, must provide UTC time. PST to UTC is +8 hours
var taskDateValue = '2020-07-01 12:01:01'

// the date field on task to do a filter on.
var taskDateField = 'sys_created_on'

// comparison check to perform on the data, before = 1, equal = 0, and after = -1.
var taskDateComparisonOperator = -1;

/* UPDATE SECOND FIELD FILTER */

// the field names that can exist on multiple tables.
// E.g., ['account', 'u_account']
var secondFieldAliases = [];

// the tables which we are allowed to touch the second field and modify it.
// if blank then all tables are allowed.
// E.g., ['sn_customerservice_case', 'wm_task'] OR [] for all tables allowed.
var secondFieldTables = [];

// whether or not we should check if the current value.
// I.e., if false, will write to the field regardless of the current value.
var secondFieldCheckCurrentVal = true;

// only update the second field if the current value is the value provided here.
var secondFieldCurrentVal = '';

// new value to apply to the second field.
var secondFieldNewValue = '';

/* TABLE FILTER VARS */
//var ignoreTables = ['cmn_location', 'customer_account', 'sn_customerservice_team_member', 'ast_contract', 'u_sla_account_relationship', 'u_requestor', 'service_entitlement', 'sn_customerservice_contact_relationship']; //'sn_customerservice_contact_relationship' - for parent account
var ignoreTables = ['cmn_location', 'cmdb_ci_service']; //'sn_customerservice_contact_relationship' - for parent account
var ignore_location = ['6c3ad14adb3f1f000da080c74b96198d', 'c53a154adb3f1f000da080c74b96191a', 'e83ad14adb3f1f000da080c74b961989'];

/*********************************/


/*********************************/
/* RECORD FILTER IMPLEMENTATIONS */
/* DO NOT TOUCH                  */
/*********************************/
/* must return boolean, true if able to update and false otherwise. */

function updateSecondFieldFilter(record) {
  var arrayUtil = new ArrayUtil();

  // ensure allowed table
  if ( secondFieldTables.length === 0  || arrayUtil.contains(secondFieldTables, record.getRecordClassName()) ) {

    for (var i = 0; i < secondFieldAliases.length; i++) {
      var someField = secondFieldAliases[i];
      if (record.isValidField(someField)) {

        // if we don't care about the current value and not already set to the new value OR
        // the current value is the expected value then update the record.
        if ((!secondFieldCheckCurrentVal && record.getValue(someField) !== secondFieldNewValue) ||
            (secondFieldCheckCurrentVal && record.getValue(someField) === secondFieldCurrentVal))
        {
          record.setValue(someField, secondFieldNewValue)
          addFilterModificationLog(someField, record);
        }
      }
    }
  }

  // always return true - we're modifying the record not preventing an update based off criteria.
  return true;
}

function taskDateFilter(record) {
  var pivotDate = new GlideDateTime(taskDateValue);
  result = false;

  if (taskDateComparisonOperator !== -1 && taskDateComparisonOperator !== 0 && taskDateComparisonOperator !== 1) {
    throw Error('invalid taskDateComparisonOperator value: ' + taskDateComparisonOperator);
  }

  if (!taskDateValue || !pivotDate) {
    throw Error('invalid taskDateValue: ' + taskDateValue);
  }

  if (!taskDateField || !record.getLabel(taskDateField)) {
    throw Error('missing taskDateField or invalid string provided: ' + taskDateField);
  }

  if (record) {
    // if not related to task, then it's ok to update
    if (!tableHasBaseTable(['task'], record.getTableName())) {
      result = true
      // else if related to task perform comparison
    } else if (record[taskDateField] &&
        tableHasBaseTable(['task'], record.getTableName()) &&
        pivotDate.compareTo(new GlideDateTime(record.getValue(taskDateField))) === taskDateComparisonOperator)
    {
      result = true;
    }
  }

  return result;
}

function tableFilter(record) {
  for(var i = 0; i < ignoreTables.length; i++) {
    if(record.getTableName() == ignoreTables[i])
      return false;
  }

  return true;
}

function locationFilter(record) {
    for(var i = 0; i < ignore_location.length; i++) {
        if((record.getValue('u_location') == ignore_u_location[i]) || record.getValue('u_customer_location') == ignore_u_location[i])
            return false;
    }
    return true;
}

/*********************************/


/*********************************/
/* SCRIPT SECTION - DO NOT TOUCH */
/*********************************/

function tableHasBaseTable(baseTables, tableName) {
  var result = false;

  if (baseTables && tableName) {
    for (var i = 0; i < baseTables.length; i++) {
      var tu = new TableUtils(tableName.toString());
      var base = tu.getTables();
      base = base.get(base.size() - 1);
      if (base == baseTables[i]) {
        result = true;
        break;
      }
    }
  }

  return result;
}

output = {
  'failures': [],
  'searched': 0,
  'tablesProcessed': 0,
  'tableNamesSearched': [],
  'filterModifications': [],
  'updatesMade': [],
}

if (!referenceTable) {
  throw Error('missing reference table value.')
}

if (!currentReferenceSysID) {
  throw Error('missing current sys id reference value.')
}

if (!newReferenceSysID) {
  throw Error('missing new sys id reference value.')
}

function createRecordLogObj(fieldName, record) {
  return {
    'table_label': record.getClassDisplayValue(),
    'table': record.getRecordClassName(),
    'field': fieldName,
    'record_sys_id': record.getValue('sys_id'),
    'record_display_val': record.getDisplayValue(),
  };
}

function addFailure(fieldName, record) {
  output.failures.push(createRecordLogObj(fieldName, record))
}

function addUpdate(fieldName, record) {
  output.updatesMade.push(createRecordLogObj(fieldName, record))
/*  if(!(record.getRecordClassName() in updatedTablesDict))
    updatedTablesDict[record.getRecordClassName()] = 1;
  else
     updatedTablesDict[record.getRecordClassName()] += 1;
*/
}

function addFilterModificationLog(fieldName, record) {
  output.filterModifications.push(createRecordLogObj(fieldName, record))
}

/**
 * On a dry run, because we search all records and we never actually update anything,
 * we will get duplicate records when a given record lives on an extended table.
 * For example: if a change happens on a case, during a dryrun, we would get both an update
 * record for the task table and the sn_customerservice_case table.
 *
 * This function removes those duplicates. To make it clear how many actual updates would be made.
 */
function removeDuplicateLogObj(field) {
  if (dryrun) {
    sysIDSet = {}
    newUpdatesList = []

    for (var i = 0; i < output[field].length; i++) {
      // use id and field to allow more than one log obj per record.
      var idAndFieldVal = output[field][i].record_sys_id + output[field][i].field

      if ( !sysIDSet[idAndFieldVal] ) {
        sysIDSet[idAndFieldVal] = true;
        newUpdatesList.push(output[field][i]);
      }
    }

    output[field] = newUpdatesList;
  }
}

function removeDuplicatesFromOutputFields(fields) {
  for (var i = 0; i < fields.length; i++) {
    removeDuplicateLogObj(fields[i])
  }
}

function sortLogObjects(sortField) {
  output.updatesMade.sort(function(a,b) {
    return a[sortField].localeCompare(b[sortField])
  })

  output.failures.sort(function(a,b) {
    return a[sortField].localeCompare(b[sortField])
  })

  output.filterModifications.sort(function(a,b) {
    return a[sortField].localeCompare(b[sortField])
  })
}

function sortLogObjectsByTableLabel() {
  sortLogObjects('table_label');
}

function generateSmallLog() {
    gs.log('output.updatesMade.lenght: ' + output.updatesMade.length);
    for(var i = 0; i < output.updatesMade.length; i++) {
        if(!(output.updatesMade[i].table in updatedTablesDict))
            updatedTablesDict[output.updatesMade[i].table] = 1;
        else
            updatedTablesDict[output.updatesMade[i].table] += 1;
    }
}

function updateReferenceValue(fieldName, tableRecord) {

  // found a field on the table that is referencing the right table and record
  // update with the new sys id value.
  if (dryrun) {
    // we are doing a dry run, log the update as a success.
    addUpdate(fieldName, tableRecord);
  } else {
    // else not a dryrun, attempt update
    tableRecord.setValue(fieldName, newReferenceSysID);

    tableRecord.setWorkFlow(setWorkFlow);
    tableRecord.autoSysFields(autoSysFields);

    // if update occured record update, else record fail.
    if ( tableRecord.update() ) {
      addUpdate(fieldName, tableRecord);
    } else {
      addFailure(fieldName, tableRecord)
    }
  }

}

function checkRecordFilters(record) {
  result = true;

  if (enableRecordFilters) {
    for (var i = 0; i < recordFilters.length; i++) {
      if ( !eval(recordFilters[i])(record) ) {
        result = false;
        break;
      }
    }
  }

  return result;
}

function searchTable(tableName) {

  // find fields that are reference fields referencing the specified table.
  var tableFields = new GlideRecord('sys_dictionary');
  tableFields.addQuery('name', tableName);
  tableFields.addQuery('internal_type', 'reference');
  tableFields.addQuery('reference', referenceTable);
  tableFields.query();

  while(tableFields.next()) {

    // for the given reference fields, find ones that reference the relevant sys id
    var tableRecords = new GlideRecord(tableName);
    tableRecords.addQuery(tableFields.element, currentReferenceSysID);
    tableRecords.setWorkflow(setWorkFlow);
    tableRecords.query();

    while(tableRecords.next()) {
      if (checkRecordFilters(tableRecords)) {
        updateReferenceValue(tableFields.getValue('element'), tableRecords)
      }
    }
  }
}

function run() {
  var tables = new GlideRecord('sys_db_object');
  tables.query();
  gs.info('Total tables in the system: ' + tables.getRowCount());

  while(tables.next() && tableLimit > 0) {

    var tableName = tables.getValue('name')

    if (!tableName.startsWith('sh$') && !tableName.startsWith('ts_') && !tableName.startsWith('v_') && !tableName.startsWith('np$')) {

      if (logTablesSearched) {
        output.tableNamesSearched.push(tableName)
      }

      searchTable(tableName)
      output.searched++;

    }

    tableLimit--;
    output.tablesProcessed++;
  }
}

run()

if ( tableLimit == 0 ) {
  gs.warn('Table Limit Reached: if unexpected, set to a higher value.')
}

gs.warn('If applicable, remember to delete the original record.');

removeDuplicatesFromOutputFields(['updatesMade', 'filterModifications']);

gs.info('updates made: ' + output.updatesMade.length);
gs.info('filter modifications made: ' + output.filterModifications.length);

;

sortLogObjectsByTableLabel();

// small log
generateSmallLog();
gs.info((JSON.stringify(updatedTablesDict, null, 4)).replace(/,/g, '<br>'))

JSON.stringify(output);