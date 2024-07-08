function handleFavorites(favs) {
  favs.sort(function (b, a) {
    return a.title.localeCompare(b.title);
  });
  var currentUser = gs.getUser();
  var grBook = new GlideRecord('sys_ui_bookmark');
  grBook.addQuery('user', currentUser.getID());
  grBook.deleteMultiple();
  var start = 1;
  var end = favs.length;

  for (var i = 0; i < favs.length; i++) {
    var fav = favs[i];

    grBook.initilize();
    for (var key in fav) {
      grBook.setValue(key, fav[key]);
    }
    grBook.setValue('user', currentUser.getID());
    if (fav.icon == 'star') {
      grBook.setValue('order', start);
      start++;
    } else {
      grBook.setValue('order', end);
      end--;
    }
    grBook.insert();
  }
}

var favsAndGroups = {}

handleFavorites(favsAndGroups.favs);
