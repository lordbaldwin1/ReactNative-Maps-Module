package com.sparklemotion.maps;

import static com.sparklemotion.maps.TestHelper.createTestChargeSite;
import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.Mockito.*;

import com.sparklemotion.maps.model.ChargeSite;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ChargeSiteServiceTests {

  @Mock private ChargeSiteRepository repository;

  @InjectMocks private ChargeSiteService service;

  @Test
  void ChargeSiteService_GetAllChargeSites_ReturnsListWithSavedChargeSites() {
    when(repository.findAll())
        .thenReturn(List.of(createTestChargeSite(1), createTestChargeSite(2)));

    List<ChargeSite> locations = service.getAllChargeSites();

    assertThat(locations).isNotNull();
    assertThat(locations.size()).isEqualTo(2);
  }

  @Test
  void ChargeSiteService_GetChargeSiteById_ReturnsSavedChargeSite() {
    ChargeSite location = createTestChargeSite(1);

    when(repository.findById(123L)).thenReturn(Optional.of(location));

    ChargeSite foundChargeSite = service.getChargeSiteById(123L);

    assertThat(foundChargeSite).isNotNull();
    assertThat(foundChargeSite.getId()).isEqualTo(location.getId());
  }

  @Test
  void ChargeSiteService_SaveChargeSite_ReturnsSavedChargeSite() {
    ChargeSite location = createTestChargeSite(1);

    when(repository.save(any(ChargeSite.class))).thenReturn(location);

    ChargeSite savedChargeSite = service.saveChargeSite(location);

    assertThat(savedChargeSite).isNotNull();
    assertThat(savedChargeSite.getId()).isEqualTo(location.getId());
  }

  @Test
  void ChargeSiteService_DeleteChargeSite_DeletesSavedChargeSite() {
    doNothing().when(repository).deleteById(123L);

    assertAll(() -> service.deleteChargeSite(123L));
  }
}
