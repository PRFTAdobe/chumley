package com.chumley.core.models;

import com.adobe.cq.wcm.core.components.models.Component;

public interface ContactForm extends Component {
  String getNamePlaceholder();

  String getEmailPlaceholder();

  String getCommentsPlaceholder();

  String getSubmitButtonText();
}
