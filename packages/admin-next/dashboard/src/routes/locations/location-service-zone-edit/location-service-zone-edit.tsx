import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { json, useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { EditServiceZoneForm } from "./components/edit-region-form"

export const LocationServiceZoneEdit = () => {
  const { t } = useTranslation()
  const { location_id, fset_id, zone_id } = useParams()

  const { stock_location, isPending, isError, error } = useStockLocation(
    location_id!,
    {
      fields: "*fulfillment_sets.service_zones",
    }
  )

  const serviceZone = stock_location?.fulfillment_sets
    ?.find((f) => f.id === fset_id)
    ?.service_zones.find((z) => z.id === zone_id)

  if (isError) {
    throw error
  }

  if (!isPending && !serviceZone) {
    throw json(
      { message: `Service zone with ID ${zone_id} was not found` },
      404
    )
  }

  return (
    <RouteDrawer prev={`/settings/locations/${location_id}`}>
      <RouteDrawer.Header>
        <Heading>{t("stockLocations.serviceZones.edit.header")}</Heading>
      </RouteDrawer.Header>
      {!isPending && serviceZone && (
        <EditServiceZoneForm
          zone={serviceZone}
          fulfillmentSetId={fset_id!}
          locationId={location_id!}
        />
      )}
    </RouteDrawer>
  )
}