package com.ticketmasterignite

import com.ticketmaster.authenticationsdk.TMXDeploymentEnvironment
import com.ticketmaster.discoveryapi.enums.TMEnvironment
import com.ticketmaster.tickets.ticketssdk.TicketsSDKSingleton


object Environment {

  fun getTMEnvironment(environment: String): TMEnvironment {
    return when (environment) {
      "PreProduction" -> TMEnvironment.Alpha
      "Staging" -> TMEnvironment.Beta
      else -> TMEnvironment.Production
    }
  }

  fun getTMXDeploymentEnvironment(environment: String): TMXDeploymentEnvironment {
    return when (environment) {
      "PreProduction" -> TMXDeploymentEnvironment.Preproduction
      "Staging" -> TMXDeploymentEnvironment.Staging
      else -> TMXDeploymentEnvironment.Production
    }
  }

  fun getTicketsSDKSingletonEnvironment(environment: String): TicketsSDKSingleton.SDKEnvironment {
    return when (environment) {
      "PreProduction" -> TicketsSDKSingleton.SDKEnvironment.Preprod
      "Staging" -> TicketsSDKSingleton.SDKEnvironment.Staging
      else -> TicketsSDKSingleton.SDKEnvironment.Production
    }
  }
}

