package com.sparklemotion.maps;

import com.sparklemotion.maps.model.ChargeSite;
import com.sparklemotion.maps.model.ResponseChargeSite;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chargesites")
@CrossOrigin(origins = {"https://localhost:8081"}) // Expo server IP address
public class ChargeSiteController {

  @Autowired private ChargeSiteService chargeSiteService;

  @GetMapping
  public List<ResponseChargeSite> getAllChargeSitesInRegion(
      @RequestParam("lat") double latitude,
      @RequestParam("lon") double longitude,
      @RequestParam("latd") double latitudeDelta,
      @RequestParam("lond") double longitudeDelta) {
    return ChargeSite.responses(
        chargeSiteService.getAllChargeSitesInRegion(
            latitude, longitude, latitudeDelta, longitudeDelta));
  }

  @GetMapping("/{id}")
  public ResponseChargeSite getChargeSiteById(@PathVariable Long id) {
    return ChargeSite.response(chargeSiteService.getChargeSiteById(id));
  }

  @PostMapping
  public ResponseEntity<ResponseChargeSite> createChargeSite(@RequestBody ChargeSite chargeSite) {
    chargeSite.generateObfuscation();
    ResponseChargeSite responseChargeSite =
        ChargeSite.response(chargeSiteService.saveChargeSite(chargeSite));
    return new ResponseEntity<>(responseChargeSite, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  public ResponseChargeSite updateChargeSite(
      @PathVariable Long id, @RequestBody ChargeSite chargeSite) {
    chargeSite.setId(id);
    chargeSite.generateObfuscation();
    return ChargeSite.response(chargeSiteService.saveChargeSite(chargeSite));
  }

  @DeleteMapping("/{id}")
  public void deleteChargeSite(@PathVariable Long id) {
    chargeSiteService.deleteChargeSite(id);
  }
}
