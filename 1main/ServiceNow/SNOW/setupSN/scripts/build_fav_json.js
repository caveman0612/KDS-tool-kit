var obj = {};

var list = new GlideRecord('sys_ui_bookmark');
list.addEncodedQuery('user=' + gs.getUser().getID());
list.query();
var favArr = [];
while (list.next()) {
  var fav = {};
  fav.title = list.getValue('title');
  fav.url = list.getValue('url');
  fav.color = list.getValue('color');
  fav.icon = list.getValue('icon');
  fav.module = list.getValue('module');
  fav.window_name = list.getValue('window_name');
  favArr.push(fav);
}
obj.favs = favArr;
gs.info(favArr.length);
gs.info(JSON.stringify(obj));
