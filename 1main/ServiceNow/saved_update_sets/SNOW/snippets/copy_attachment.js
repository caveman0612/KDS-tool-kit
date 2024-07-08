(function runMailScript(
  /* GlideRecord */ current,
  /* TemplatePrinter */ template,
  /* Optional EmailOutbound */ email,
  /* Optional GlideRecord */ email_action,
  /* Optional GlideRecord */ event
) {
  var grAtt = new GlideRecord('sys_attachment');
  grAtt.addQuery('table_sys_id', current.sys_id);
  grAtt.query();
  while (grAtt.next()) {
    grAtt.deleteRecord();
  }

  grAtt = new GlideRecord('sys_attachment');
  grAtt.addQuery('table_sys_id', current.document_id);
  grAtt.setLimit(1);
  grAtt.orderByDesc('sys_created_on');
  grAtt.query();

  if (grAtt.next()) {
    /* ------------------------------This is the imporant stuff -------------------------------------*/

    var content = new GlideSysAttachment().getContentStream(grAtt.sys_id);
    new GlideSysAttachment().writeContentStream(
      current,
      grAtt.file_name,
      grAtt.content_type,
      content
    );

    /* ------------------------------This is the imporant stuff -------------------------------------*/
  }
})(current, template, email, email_action, event);
