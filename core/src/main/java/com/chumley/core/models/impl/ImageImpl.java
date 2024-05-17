package com.chumley.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.Image;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.experimental.Delegate;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.via.ResourceSuperType;

import javax.inject.Inject;

@Model(adaptables = {SlingHttpServletRequest.class}, adapters = {Image.class,
  ComponentExporter.class}, resourceType = ImageImpl.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION, options = {
  @ExporterOption(name = "MapperFeature.SORT_PROPERTIES_ALPHABETICALLY", value = "true"),
  @ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "false")})
@JsonIgnoreProperties({"widths", "srcUriTemplate", "lazyThreshold", "areas", "decorative", "dmImage", "componentData",
  "link"})
@JsonSerialize(as = ImageImpl.class)
public class ImageImpl implements ComponentExporter, Image {
  static final String RESOURCE_TYPE = "chumley/components/image";
  @Self
  @Via(type = ResourceSuperType.class)
  @Delegate(excludes = DelegationExclusion.class)
  private Image delegate;
  @Getter
  @Inject
  @Via("resource")
  private boolean displayPopupTitle;

  @Override
  public String getExportedType() {
    return RESOURCE_TYPE;
  }

  public interface DelegationExclusion {

    String getExportedType();

  }

}
