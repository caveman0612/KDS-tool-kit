/* Get the list of attachment whihc needs to be sent  */
var entries = g_list.getChecked();
if (!entries || entries.length == 0) return;

/* Call global.AttachmentWSUtil , Function : sendAttachment */
var ga = new GlideAjax('global.SendAttachmentUtil');
ga.addParam('sysparm_name', 'sendAttachment');
ga.addParam('sysparm_entry_ids', entries);
ga.getXML(parseAttachmentResponse);
g_list.refresh();
gel('activity-stream-textarea').focus();
