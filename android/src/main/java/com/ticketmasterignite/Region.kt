import com.ticketmaster.authenticationsdk.TMXDeploymentRegion
import com.ticketmaster.tickets.ticketssdk.TicketsSDKSingleton

object Region {
  fun getRegion(): TMXDeploymentRegion {
    return if(Config.get("region") == "UK") {
      TMXDeploymentRegion.UK
    } else {
      TMXDeploymentRegion.US
    }
  }

  fun getTicketsSDKRegion(): TicketsSDKSingleton.HostEnvironment {
    return if(Config.get("region") == "UK") {
      TicketsSDKSingleton.HostEnvironment.UK
    } else {
      TicketsSDKSingleton.HostEnvironment.US
    }
  }
}
