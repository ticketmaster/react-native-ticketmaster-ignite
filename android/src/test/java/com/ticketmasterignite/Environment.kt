package com.ticketmasterignite

import org.junit.Test
import org.junit.Assert.*
import com.ticketmaster.authenticationsdk.TMXDeploymentEnvironment
import com.ticketmaster.discoveryapi.enums.TMEnvironment

class EnvironmentTest {
  @Test
  fun `gets TMXDeploymentEnvironment with Production`() {
    val result = Environment.getTMXDeploymentEnvironment("Production")
    assertEquals(TMXDeploymentEnvironment.Production, result)
  }
  @Test
  fun `gets Production TMEnvironment with Staging`() {
    val result = Environment.getTMEnvironment("Staging")
    assertEquals(TMEnvironment.Beta, result)
  }

  @Test
  fun `TicketsSDK Environment with PreProduction`() {
    val result = Environment.getTMXDeploymentEnvironment("PreProduction")
    assertEquals(TMXDeploymentEnvironment.Preproduction, result)
  }
}
