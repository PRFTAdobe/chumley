package com.chumley.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.ExperienceFragment;
import com.day.cq.wcm.api.designer.Style;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.experimental.Delegate;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.jetbrains.annotations.NotNull;

import javax.annotation.PostConstruct;

@Model(adaptables = {SlingHttpServletRequest.class}, adapters = {ExperienceFragment.class,
  ComponentExporter.class}, resourceType = ExperienceFragmentImpl.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION, options = {
  @ExporterOption(name = "MapperFeature.SORT_PROPERTIES_ALPHABETICALLY", value = "true"),
  @ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "false")})
@JsonSerialize(as = ExperienceFragmentImpl.class)
public class ExperienceFragmentImpl implements ComponentExporter, ExperienceFragment {

  public static final String CQ_STYLE_DEFAULT_ELEMENT = "cq:styleDefaultElement";
  public static final String RESOURCE_TYPE = "chumley/components/experiencefragment";
  @SlingObject
  protected Resource resource;
  @ScriptVariable
  private Style currentStyle;
  @Self
  @Via(type = ResourceSuperType.class)
  @Delegate(excludes = DelegationExclusion.class)
  private ExperienceFragment delegate;
  @Self
  private SlingHttpServletRequest request;

  private String styleSystemElement;

  public String getStyleSystemElement() {
    return styleSystemElement;
  }

  @Override
  public @NotNull String getExportedType() {
    return RESOURCE_TYPE;
  }

  @Override
  public String getLocalizedFragmentVariationPath() {
    return request.getResource().getValueMap().get(ExperienceFragment.PN_FRAGMENT_VARIATION_PATH, String.class);
  }

  @PostConstruct
  public void activate() {
    styleSystemElement = currentStyle.get(CQ_STYLE_DEFAULT_ELEMENT, "div");
  }

  private interface DelegationExclusion {
    String getExportedType();

    String getLocalizedFragmentVariationPath();
  }
}
