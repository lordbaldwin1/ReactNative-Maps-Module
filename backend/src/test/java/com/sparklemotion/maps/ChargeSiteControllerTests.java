package com.sparklemotion.maps;

import static com.sparklemotion.maps.TestHelper.createTestChargeSite;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sparklemotion.maps.model.ChargeSite;
import com.sparklemotion.maps.model.ResponseChargeSite;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = ChargeSiteController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class ChargeSiteControllerTests {

  @Autowired private MockMvc mockMvc;

  @MockBean private ChargeSiteService service;

  @Autowired private ObjectMapper mapper;

  @Test
  void ChargeSiteController_GetAllChargeSites_ReturnsListWithSavedChargeSites() throws Exception {
    when(service.getAllChargeSites())
        .thenReturn(List.of(createTestChargeSite(1), createTestChargeSite(2)));

    mockMvc
        .perform(get("/api/chargesites").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.size()").value(2));
  }

  @Test
  void ChargeSiteController_GetChargeSiteById_ReturnsSavedChargeSite() throws Exception {
    ChargeSite chargeSite = createTestChargeSite(123);
    chargeSite.setId(1L); // Simulate the ID set by the database
    ResponseChargeSite responseChargeSite = ChargeSite.response(chargeSite);

    when(service.getChargeSiteById(1L)).thenReturn(chargeSite);

    mockMvc
        .perform(get("/api/chargesites/1").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(responseChargeSite.getId()))
        .andExpect(jsonPath("$.latitude").value(responseChargeSite.getLatitude()))
        .andExpect(jsonPath("$.longitude").value(responseChargeSite.getLongitude()));
  }

  @Test
  void ChargeSiteController_CreateChargeSite_ReturnsCreatedChargeSite() throws Exception {
    ChargeSite chargeSite = createTestChargeSite(123);
    chargeSite.setId(1L); // Simulate the ID set by the database
    ResponseChargeSite responseChargeSite = ChargeSite.response(chargeSite);

    given(service.saveChargeSite(any()))
        .willAnswer(
            invocation -> {
              ChargeSite savedSite = invocation.getArgument(0);
              ResponseChargeSite response = ChargeSite.response(savedSite);
              responseChargeSite.setLatitude(response.getLatitude());
              responseChargeSite.setLongitude(response.getLongitude());
              savedSite.setId(1L); // Simulate the ID set by the database
              return savedSite;
            });

    mockMvc
        .perform(
            post("/api/chargesites")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(chargeSite)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(responseChargeSite.getId()))
        .andExpect(jsonPath("$.latitude").value(responseChargeSite.getLatitude()))
        .andExpect(jsonPath("$.longitude").value(responseChargeSite.getLongitude()));
  }

  @Test
  void ChargeSiteController_UpdateChargeSite_ReturnsUpdatedChargeSite() throws Exception {
    ChargeSite chargeSite = createTestChargeSite(1);
    chargeSite.setId(1L); // Simulate the ID set by the database
    ResponseChargeSite responseChargeSite = ChargeSite.response(chargeSite);

    given(service.saveChargeSite(any()))
        .willAnswer(
            invocation -> {
              ChargeSite savedSite = invocation.getArgument(0);
              ResponseChargeSite response = ChargeSite.response(savedSite);
              responseChargeSite.setLatitude(response.getLatitude());
              responseChargeSite.setLongitude(response.getLongitude());
              savedSite.setId(1L); // Simulate the ID set by the database
              return savedSite;
            });

    mockMvc
        .perform(
            put("/api/chargesites/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(chargeSite)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(responseChargeSite.getId()))
        .andExpect(jsonPath("$.latitude").value(responseChargeSite.getLatitude()))
        .andExpect(jsonPath("$.longitude").value(responseChargeSite.getLongitude()));
  }

  @Test
  void ChargeSiteController_DeleteChargeSite_DeletesSavedChargeSite() throws Exception {
    doNothing().when(service).deleteChargeSite(1L);

    mockMvc
        .perform(delete("/api/chargesites/1").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());
  }
}
