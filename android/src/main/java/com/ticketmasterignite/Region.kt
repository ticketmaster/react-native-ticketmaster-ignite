import com.ticketmaster.authenticationsdk.TMXDeploymentRegion
import com.ticketmaster.tickets.ticketssdk.TicketsSDKSingleton

object Region {
   private var region = Config.get("region")

  fun getRegion(): TMXDeploymentRegion {
    return if(region == "UK") {
      TMXDeploymentRegion.UK
    } else {
      TMXDeploymentRegion.US
    }
  }

  fun getTicketsSDKRegion(): TicketsSDKSingleton.HostEnvironment {
    return if(region == "UK") {
      TicketsSDKSingleton.HostEnvironment.UK
    } else {
      TicketsSDKSingleton.HostEnvironment.US
    }
  }
}
