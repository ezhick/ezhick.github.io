$.getJSON("forms.json", function(json) {
  var formCounter = 0;
  var id = "";
  var text = "";
  var value = "";
  json.forEach(function(form) {
    formCounter += 1;
    formId = "form" + formCounter;
    formheaderId = "formheader" + formCounter;

    $("#claimslist").append(
      "<p><a href=\"#" + formheaderId + "\">" + form.title + "</a></p>"
    );
    $("#base").append(
      "<h3 id=\"" + formheaderId + "\">" + form.title +
        " <a href=\"#\" class=\"small\">вверх</a>" +
      "</h3>" +
      "<p>" + form.about + "</p>" +
      "<form id=\"" + formId + "\"></form>"
    );

    var controlCounter = 0;
    form.fields.forEach(function(field) {
      controlCounter += 1;
      controlId = formId + "control" + controlCounter;
      $("#" + formId).append(
        "<div class=\"form-group\">" +
          "<label class=\"form-group\" for=\"" + controlId + "\">" +
            field.title +
          "</label>" +
        "</div>"
      );
      if (field.type == "input") {
        $("#" + formId + ">div").last().append(
          "<input class=\"form-control\" id=\"" + controlId +
          "\" placeholder=\"" + field.placeholder + "\"></input>"
        );
      }

      if (field.type == "select") {
        $("#" + formId+ ">div").last().append(
          "<select class=\"form-control\" id=\"" + controlId + "\"></select>"
        );
        field.options.forEach(function(option) {
          $("select#" + controlId).append(
            "<option>" + option + "</option>"
          );
        });
      }

      $("#" + controlId).on('keyup keypress change', function(e) {
        if ( e.which == 13 ) e.preventDefault();
        text = form.text;
        controlCounter = 0;
        formId = this.parentElement.parentElement.id;
        form.fields.forEach(function(field) {
          controlCounter += 1;
          controlId = formId + "control" + controlCounter;
          value = $("#" + controlId).val();
          if (value === "") value = "_____";
          var regexp = new RegExp("\\{\\{"+ controlCounter + "\\}\\}", "g");
          text = text.replace(regexp, value);
        });
        $("#" + formId + "textarea").val(text);
      });
    });

    $("#base").append(
      "<div class=\"form-group\">" +
      "<textarea class=\"form-control\" id=\"" + formId + "textarea\" rows=\"10\"></textarea>" +
      "</div>"
      // "<div class=\"panel panel-default\">" +
      //   "<div class=\"panel-body\" id=\"" + formId + "textarea\">" +
      //   "</div>" +
      // "</div>"
    );
    $("#" + formId + "textarea").val(form.text.replace(/{{\d+}}/g, "_____"));

    $("#base").append(
      "<div class=\"form-group\">" +
      "<button class=\"btn btn-default copyButton\" for=\"" + formId + "textarea" + "\">Копировать</button>" +
      "</div>"
    );
  });

  $(".copyButton").click(function() {
      $('#' + this.attributes.for.value).select();
      document.execCommand("copy");
      this.focus();
      $(".alert").show().fadeOut( 3000 );
  });
});
