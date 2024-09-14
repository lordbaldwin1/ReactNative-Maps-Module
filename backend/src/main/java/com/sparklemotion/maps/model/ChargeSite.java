package com.sparklemotion.maps.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Random;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "charge_sites")
public class ChargeSite {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private int userId;

  @Column(name = "latitude", nullable = false)
  private double latitude;

  @Column(name = "longitude", nullable = false)
  private double longitude;

  @Column(name = "obfuscated_latitude", nullable = false)
  private double obfuscatedLatitude;

  @Column(name = "obfuscated_longitude", nullable = false)
  private double obfuscatedLongitude;

  @Column(name = "obfuscated_status", nullable = false)
  private boolean obfuscatedStatus;

  @Column(name = "reserved_status", nullable = false)
  private boolean reservedStatus;

  @Column(name = "private_status", nullable = false)
  private boolean privateStatus;

  @Column(name = "rate_of_charge", nullable = false)
  private double rateOfCharge;

  public static final double MAX_OBFUSCATED_RADIUS = 0.05;

  /**
   * Generates an obfuscated geolocation for this charge site. Assumes latitude and longitude are
   * set.
   */
  public void generateObfuscation() {
    // Math.random() creates a new Random object each call; just create one.
    // Also, using the random object directly exposes the min and max range.
    Random random = new Random();
    // Generate a random direction away from the actual geolocation.
    double angle = random.nextDouble(0.0, 2.0 * Math.PI);
    // Generate a random distance away from the actual geolocation.
    // These numbers roughly correspond to 5km - 20km.
    // The obfuscated geolocation is at least ~5km away from the actual
    // geolocation, and at most ~20km away.
    double distance = random.nextDouble(0, MAX_OBFUSCATED_RADIUS);

    // Implicitly uses the Mercator projection.
    // NOTE(Bruce): If that's a problem, update this.
    obfuscatedLatitude = latitude + distance * Math.sin(angle);
    obfuscatedLongitude = longitude + distance * Math.cos(angle);

    // Ensure the randomized coordinates stay within the domain of latitude and longitude:
    // (-90,+90) and (-180,+180) respectively.

    // This handles when latitude >90 or <-90.
    if (Math.abs(obfuscatedLatitude) > 90.0) {
      // Keep the proper sign, aka northern/southern hemisphere.
      obfuscatedLatitude = Math.copySign(180.0, obfuscatedLatitude) - obfuscatedLatitude;
      // If the latitude went past the North/South Pole.
      // Its longitude is actually on the opposite side.
      obfuscatedLongitude += 180.0;
    }

    // This works because -180 and +180 represent the same geolocations.
    obfuscatedLongitude %= 180;
  }

  /** @return A response version of this charge site. */
  public static ResponseChargeSite response(ChargeSite chargeSite) {
    return new ResponseChargeSite(
        chargeSite.id,
        chargeSite.userId,
        chargeSite.obfuscatedStatus ? chargeSite.obfuscatedLatitude : chargeSite.latitude,
        chargeSite.obfuscatedStatus ? chargeSite.obfuscatedLongitude : chargeSite.longitude,
        chargeSite.obfuscatedStatus,
        chargeSite.reservedStatus,
        chargeSite.privateStatus,
        chargeSite.rateOfCharge);
  }

  /** @return A list of response versions of each charge site in the given list. */
  public static List<ResponseChargeSite> responses(List<ChargeSite> chargeSites) {
    return chargeSites.stream().map(ChargeSite::response).toList();
  }
}
