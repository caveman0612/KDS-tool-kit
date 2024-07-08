function main(systemProperties, preferences) {
      handleProperties(systemProperties);
    handlePreferences(preferences);

  }
  
  function handlePreferences(preferences) {
    // sys_user_preference
    var currentUser = gs.getUser();
    for (var key in preferences) {
      currentUser.savePreference(key, preferences[key]);
    }
  }
  
  function handleProperties(systemProperties) {
    // sys_properties
    for (var key in systemProperties) {
      gs.setProperty(key, systemProperties[key]);
    }
  }


  
  var systemProperties = {
    'glide.ui.advanced': 'true',
  };
  
  var preferences = {
    'glide.ui.polaris.theme.variant': 'e09ef7ae07103010e03948f78ad3002c',
    'glide.ui.polaris.ui16_tabs_inside_polaris': 'true',
    rowcount: '100',
    'com.snc.par.dashboards.ui.preferences': '{"recent":"[{\"sys_id\":\"90c308ec43db1110b643a7ec6bb8f24b\",\"viewed\":\"2024-04-05 09:43:51\"}]"}',
    'glide.next_experience.homepage_title': 'Shared admin dashboard',
    'glide.next_experience.continue_landing_page': 'false',
    'my_home_navigation_page': 'now/nav/ui'
  };
  
  
  main(systemProperties, preferences);
  