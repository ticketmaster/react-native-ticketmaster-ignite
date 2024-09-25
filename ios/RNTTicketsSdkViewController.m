#import <React/RCTViewManager.h>

#if __has_include(<react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>)
// For cocoapods framework, the generated swift header will be inside react_native_ticketmaster module
#import <react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>
#else
#import "react_native_ticketmaster_ignite-Swift.h"
#endif

@interface RNTTicketsSdkViewManager : RCTViewManager
@end

@implementation RNTTicketsSdkViewManager

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return true;
}

RCT_EXPORT_MODULE(RNTTicketsSdkView)


- (UIView *)view
{
    TicketsSdkViewController *vc = [[TicketsSdkViewController alloc] init];
  return vc.view;
}

@end


