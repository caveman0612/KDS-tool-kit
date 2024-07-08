getDetectionTime: function(section) {
    var dateTime = this.extractDateTime(section);
    var timeZone = this.extractTimeZone(section);

    var expectedTimezoneDateTime = new GlideScheduleDateTime(dateTime).convertTimeZone(timeZone, "PST");
    var convertedTimeZoneDateTime = new GlideDateTime(expectedTimezoneDateTime);
    return convertedTimeZoneDateTime.getValue();
},



////////////////////////////////////////////////



		//handle dateTimeMillis to time_of_event
		var pattern = "yyyy-MM-dd HH:mm:ss";    
		var format = new SimpleDateFormat(pattern);
		format.setTimeZone(TimeZone.getTimeZone("GMT"));
		var eventTime = new Date(parseInt(xml.dateTimeMillis));
		var dateFormat = format.format(eventTime);
		event.setField('time_of_event', dateFormat);