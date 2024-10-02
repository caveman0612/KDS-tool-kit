this.lu = new GSLog('adlumin.log_level', this.type);
this.lu.setLevel('debug');
this.lu.info('debug message');

var lu = new GSLog('', 'script name');
lu.setLevel('debug');
lu.info('debug message');

var lu = new GSLog(
  'com.continuant.adlumin.log_level',
  'flow-parse adlumin email'
);
// lu.debugOn();

try {
} catch (err) {
  lu.error(
    'parse adlumin email: Error = ' + err.lineNumber + ' : ' + err.message
  );
  this.lu.error(
    this.type + ' : Error @ = ' + err.lineNumber + ' : ' + err.message
  );
}


this.lu.error('script_sys_id = f3a6fcb397c5ca9016f350900153afb8 \nlineNumber = ' + err.lineNumber + ' \nmessage = ' + err.message)

this.lu.error('lineNumber = ' + err.lineNumber + ' \nmessage = ' + err.message)


//types 
emerg
alert
crit
err
warning
notice
info
debug