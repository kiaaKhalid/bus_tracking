import { ViewEntity, ViewColumn } from 'typeorm';
import { GPSLocation } from './gps-location.entity';

export enum BusStatusView {
  AT_STATION = 'at_station',
  IN_ROUTE = 'in_route',
  MAINTENANCE = 'maintenance',
}

@ViewEntity({
  expression: `
    SELECT 
      b.id,
      b.plaqueImmatriculation as busNumber,
      CASE 
        WHEN b.statut = 'EN_STATION' THEN 'at_station'
        WHEN b.statut = 'EN_ROUTE' THEN 'in_route'
        WHEN b.statut = 'MAINTENANCE' THEN 'maintenance'
      END as status,
      JSON_OBJECT(
        'id', gl.id,
        'busId', gl.busId,
        'latitude', gl.latitude,
        'longitude', gl.longitude,
        'accuracy', gl.accuracy,
        'timestamp', gl.timestamp,
        'vitesse', gl.vitesse,
        'direction', gl.direction
      ) as location,
      b.conducteur as driver,
      b.capacite as capacity,
      0 as occupancy,  -- Assuming default or calculated separately
      gl.timestamp as lastUpdate
    FROM buses b
    LEFT JOIN (
      SELECT busId, latitude, longitude, accuracy, timestamp, vitesse, direction, id
      FROM gps_locations gl_sub
      WHERE gl_sub.timestamp = (
        SELECT MAX(gl2.timestamp) 
        FROM gps_locations gl2 
        WHERE gl2.busId = gl_sub.busId
      )
    ) gl ON b.id = gl.busId
  `,
})
export class BusWithLocation {
  @ViewColumn()
  id: string;

  @ViewColumn()
  busNumber: string;

  @ViewColumn()
  status: BusStatusView;

  @ViewColumn()
  location: GPSLocation;

  @ViewColumn()
  driver?: string;

  @ViewColumn()
  capacity: number;

  @ViewColumn()
  occupancy: number;

  @ViewColumn()
  lastUpdate: Date;
}
