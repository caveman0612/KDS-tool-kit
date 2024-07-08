var current = new GlideRecord('wm_task');
current.get('c91fe51187857410545062073cbb3520');

var v = new sn_pdfgeneratorutils.PDFGenerationAPI();

var template = new GlideRecord('u_general_document_template');
template.get('0fbfe95687803150076fcb77cebb35f2');

var html = template.u_body.toString();
var regex = /\${.*?}/g;
var arr = html.match(regex);

for (var i = 0; i < arr.length; i++) {
  var item = arr[i];
  var cleaned = item.slice(2, item.length - 1);
  var info = current.getValue(cleaned);
  if (!info) {
    info = '';
  } else {
    info = current[cleaned].getDisplayValue();
  }
  html = html.replace(item, info);
}

var result = v.convertToPDF(html, 'wm_task', current.getUniqueValue(), 'myPDF');
