package com.chumley.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.util.AbstractComponentImpl;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.chumley.core.models.ContactForm;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

@Getter
@NoArgsConstructor(force = true)
@Model(adaptables = SlingHttpServletRequest.class, adapters = {ContactForm.class,
  ComponentExporter.class}, resourceType = ContactFormImpl.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION, options = {
  @ExporterOption(name = "MapperFeature.SORT_PROPERTIES_ALPHABETICALLY", value = "true"),
  @ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "false")})
@JsonSerialize(as = ContactFormImpl.class)
public class ContactFormImpl extends AbstractComponentImpl implements ContactForm {
  public static final String RESOURCE_TYPE = "chumley/components/contact-form";

  @ValueMapValue
  @Default(values = "Comments")
  private final String commentsPlaceholder;
  @ValueMapValue
  @Default(values = "Email")
  private final String emailPlaceholder;
  @ValueMapValue
  @Default(values = "Name")
  private final String namePlaceholder;
  @ValueMapValue
  @Default(values = "Submit")
  private final String submitButtonText;

  @Override
  public @NotNull String getExportedType() {
    return RESOURCE_TYPE;
  }
}
