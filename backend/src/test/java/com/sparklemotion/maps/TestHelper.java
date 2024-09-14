package com.sparklemotion.maps;

import com.sparklemotion.maps.model.ChargeSite;

public class TestHelper {
  /** This is a helper function to create new locations for testing. */
  public static ChargeSite createTestChargeSite(int userId) {
    ChargeSite chargeSite =
        ChargeSite.builder()
            .userId(userId)
            .latitude(12.3654)
            .longitude(98.756)
            .rateOfCharge(2.0)
            .reservedStatus(false)
            .build();
    chargeSite.generateObfuscation();
    return chargeSite;
  }
}
