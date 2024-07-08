var user_sys_id = "925811b0dbb8e300ceae4b8b0b9619e6"

gs.info('kst impersanate1 - ' + gs.getUserName() + ':' + gs.getUserID());

var myUser = gs.getSession().impersonate(user_sys_id); 

gs.info("kst stuff = ")

gs.info('kst impersanate2 - ' + gs.getUserName() + ':' + gs.getUserID());