//
//  TDLib.m
//  killogram
//
//  Created by Macbook on 2024/8/31.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(TDLib ,NSObject);
// Method to create the TDLib client
RCT_EXTERN_METHOD(createClient:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// Method to send a JSON request to TDLib client
RCT_EXTERN_METHOD(json_client_send:(NSString *)request resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// Method to execute a request synchronously
RCT_EXTERN_METHOD(execute:(NSString *)request resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// Method to send a request to TDLib asynchronously
RCT_EXTERN_METHOD(send:(NSString *)request resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// Method to execute a JSON request and return the result
RCT_EXTERN_METHOD(json_client_execute:(NSString *)request resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// Method to destroy the TDLib client
RCT_EXTERN_METHOD(json_client_destroy:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// Method to receive a response from TDLib client
RCT_EXTERN_METHOD(json_client_receive:(double)timeout resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// Method to receive a response from TDLib asynchronously
RCT_EXTERN_METHOD(receive:(double)timeout resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// Method to start the update listener
RCT_EXTERN_METHOD(startUpdateListener:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

// Method to stop the update listener
RCT_EXTERN_METHOD(stopUpdateListener:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
