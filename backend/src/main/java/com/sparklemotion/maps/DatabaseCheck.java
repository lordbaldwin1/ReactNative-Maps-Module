package com.sparklemotion.maps;

import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
public class DatabaseCheck {

  @Value("${spring.datasource.url}")
  private String url;

  @Value("${spring.datasource.username}")
  private String username;

  @Value("${spring.datasource.password}")
  private String password;

  @Bean
  public DataSource dataSource() {
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setUrl(url);
    dataSource.setUsername(username);
    dataSource.setPassword(password);

    // Validate the connection
    try (Connection connection = dataSource.getConnection()) {
      if (connection.isValid(2)) {
        System.out.println("Database connection is valid.");
      } else {
        System.err.println("Database connection is invalid.");
        System.exit(1);
      }
    } catch (SQLException e) {
      System.err.println(
          "Error: application.properties credentials are incorrect or cannot connect to the"
              + " database.");
      System.exit(1);
    }

    return dataSource;
  }
}
