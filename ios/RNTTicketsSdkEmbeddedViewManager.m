#import <React/RCTViewManager.h>

#if __has_include(<react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>)
// For cocoapods framework, the generated swift header will be inside react_native_ticketmaster module
#import <react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>
#else
#import "react_native_ticketmaster_ignite-Swift.h"
#endif

@interface RNTTicketsSdkEmbeddedViewManager : RCTViewManager
@property (strong) TicketsSdkEmbeddedViewController *ticketsViewController;
@end

@implementation RNTTicketsSdkEmbeddedViewManager

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return true;
}

RCT_EXPORT_MODULE(RNTTicketsSdkEmbeddedView)


- (UIView *)view
{
    self.ticketsViewController = [[TicketsSdkEmbeddedViewController alloc] init];

    return self.ticketsViewController.view;
}


@end

