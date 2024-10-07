import com.ticketmaster.authenticationsdk.TMXDeploymentRegion

object Region {
   private var region = Config.get("region")

  fun getRegion(): TMXDeploymentRegion {
    return if(region == "UK") {
      TMXDeploymentRegion.UK
    } else {
      TMXDeploymentRegion.US
    }
  }
}
