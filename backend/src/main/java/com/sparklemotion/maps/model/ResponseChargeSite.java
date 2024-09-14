package com.sparklemotion.maps.model;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Represents charge site data that gets sent back to the frontend. This is used for compatibility
 * with different branches and obfuscating location data.
 */
@Data
@AllArgsConstructor
public class ResponseChargeSite {

  private Long id;
  private int userId;
  private double latitude;
  private double longitude;
  private boolean
      obfuscatedStatus; // True if latitude and longitude are obfuscated, false otherwise.
  private boolean reservedStatus; // True if the charge site is already reserved, false otherwise.
  private boolean
      privateStatus; // True if the user needs to reserve the site to use the charger, false
  // otherwise.
  private double rateOfCharge;
}
