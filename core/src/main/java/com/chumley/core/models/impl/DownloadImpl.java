package com.chumley.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.Download;
import com.day.cq.wcm.api.designer.Style;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.experimental.Delegate;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.jetbrains.annotations.NotNull;

import javax.annotation.PostConstruct;

@Model(adaptables = {SlingHttpServletRequest.class}, adapters = {Download.class,
  ComponentExporter.class}, resourceType = DownloadImpl.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION, options = {
  @ExporterOption(name = "MapperFeature.SORT_PROPERTIES_ALPHABETICALLY", value = "true"),
  @ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "false")})
@JsonSerialize(as = DownloadImpl.class)
public class DownloadImpl implements ComponentExporter, Download {
  public static final String RESOURCE_TYPE = "chumley/components/download";
  @ScriptVariable
  private Style currentStyle;
  @Self
  @Via(type = ResourceSuperType.class)
  @Delegate(excludes = DownloadImpl.DelegationExclusion.class)
  private Download delegate;
  private boolean displayFilename;

  private boolean displayFormat;

  private boolean displaySize;

  @Override
  public @NotNull String getExportedType() {
    return RESOURCE_TYPE;
  }

  public boolean getDisplaySize() {
    return displaySize;
  }

  public boolean getDisplayFormat() {
    return displayFormat;
  }

  public boolean getDisplayFilename() {
    return displayFilename;
  }

  @PostConstruct
  public void activate() {
    displayFilename = currentStyle.get(PN_DISPLAY_FILENAME, true);
    displayFormat = currentStyle.get(PN_DISPLAY_FORMAT, true);
    displaySize = currentStyle.get(PN_DISPLAY_SIZE, true);
  }

  private interface DelegationExclusion {
    String getExportedType();

    boolean getDisplaySize();

    boolean getDisplayFormat();

    boolean getDisplayFilename();
  }
}
