package com.sparklemotion.maps;

import com.sparklemotion.maps.model.ChargeSite;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChargeSiteRepository extends JpaRepository<ChargeSite, Long> {

  @Query(
      value =
          "SELECT * FROM charge_sites WHERE "
              + "ST_Distance("
              + "POINT(obfuscated_latitude, obfuscated_longitude), "
              + "POINT(?1, ?2)"
              + ") <= (?3 + "
              + ChargeSite.MAX_OBFUSCATED_RADIUS
              + ")",
      nativeQuery = true)
  List<ChargeSite> getAllInRegion(
      double centerLatitude, double centerLongitude, double maxDistance);
}
