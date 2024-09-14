package com.sparklemotion.maps;

import static com.sparklemotion.maps.TestHelper.createTestChargeSite;
import static org.assertj.core.api.Assertions.*;

import com.sparklemotion.maps.model.ChargeSite;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(
    connection = EmbeddedDatabaseConnection.H2) // Use a temporary database for testing only.
class ChargeSiteRepositoryTests {

  @Autowired private ChargeSiteRepository repository;

  @Test
  void ChargeSiteRepository_FindAll_ReturnsListWithSavedChargeSites() {
    repository.save(createTestChargeSite(1));
    repository.save(createTestChargeSite(2));

    List<ChargeSite> charge_sites = repository.findAll();

    assertThat(charge_sites).isNotNull();
    assertThat(charge_sites.size()).isEqualTo(2);
  }

  @Test
  void ChargeSiteRepository_FindById_ReturnsSavedChargeSite() {
    ChargeSite charge_site = createTestChargeSite(1);
    ChargeSite savedChargeSite = repository.save(charge_site);

    Optional<ChargeSite> foundChargeSite = repository.findById(charge_site.getId());

    assertThat(foundChargeSite).isPresent();
    assertThat(foundChargeSite.get().getId()).isEqualTo(savedChargeSite.getId());
  }

  @Test
  void ChargeSiteRepository_Save_ReturnsSavedChargeSite() {
    ChargeSite savedChargeSite = repository.save(createTestChargeSite(1));

    assertThat(savedChargeSite).isNotNull();
    assertThat(savedChargeSite.getId()).isGreaterThan(0);
  }

  @Test
  void ChargeSiteRepository_DeleteById_DeletesSavedChargeSite() {
    ChargeSite savedChargeSite = repository.save(createTestChargeSite(1));

    repository.deleteById(savedChargeSite.getId());
    List<ChargeSite> charge_sites = repository.findAll();

    assertThat(charge_sites.size()).isEqualTo(0);
  }
}
