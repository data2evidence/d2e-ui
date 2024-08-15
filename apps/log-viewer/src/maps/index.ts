import { maps as designMaps } from '@prefecthq/prefect-ui-library'
import { mapFlagResponseToFeatureFlag } from '@/maps/featureFlag'
import { mapSettingsResponseToSettings } from '@/maps/uiSettings'

export const maps = {
  ...designMaps,
  SettingsResponse: { Settings: mapSettingsResponseToSettings },
  FlagResponse: { FeatureFlag: mapFlagResponseToFeatureFlag }
}
