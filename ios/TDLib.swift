//
//  TDLib.swift
//  killogram
//
//  Created by Macbook on 2024/8/31.
//

import Foundation
import React
import TDLibFramework

@objc(TDLib)
class TDLib: RCTEventEmitter {
  
  override static func moduleName() -> String! {
    return "TDLib"
  }
  
  private var updateListenerActive = false
  private var client: UnsafeMutableRawPointer?
  
  func createClient(_ resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
    client = td_json_client_create();
    if (client == nil) {
      let error = NSError(domain: "", code: 200, userInfo: nil);
      reject("ERROR_ON_CLIENT", "Something not sure", error);
    } else {
      resolve(client);
    }
  }
  
  @objc(json_client_send:request:resolve:reject:)
  func json_client_send(_ clients: NSNumber, request: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let clientPointer = UnsafeMutableRawPointer(bitPattern: clients.uintValue)
    let requestString = request as String

    requestString.withCString { cStringRequest in
      td_json_client_send(client, cStringRequest)
    }
    
    DispatchQueue.global().asyncAfter(deadline: .now() + 1.0) {
      resolve("Request sent successfully")
    }
  }
  
  @objc func execute(_ request: NSString) -> NSString? {
      let requestCString = request.cString(using: String.Encoding.utf8.rawValue)
    
      if let resultCString = td_execute(requestCString) {
        return NSString(utf8String: resultCString)
      }
      
      return nil
    }
  
  @objc func send(_ clientId: Int32, request: NSString) {
      let requestCString = request.cString(using: String.Encoding.utf8.rawValue)
      
      td_send(clientId, requestCString)
    }
  
  @objc func json_client_execute(_ client: NSNumber, request: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
      let clientPointer = UnsafeMutableRawPointer(bitPattern: client.uintValue)
      let requestCString = request.cString(using: String.Encoding.utf8.rawValue)
      
      if let resultCString = td_json_client_execute(clientPointer, requestCString) {
        resolve(String(cString: resultCString))
      } else {
        reject("td_json_client_execute_error", "Failed to execute client request", nil)
      }
    }
  
  @objc
  func json_client_create(_ resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) {
      client = td_json_client_create()
      
      resolve(NSNumber(value: Int(bitPattern: client)))
  }
  
  @objc(json_client_destroy:resolve:reject:)
    func json_client_destroy(_ client: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
      let clientPointer = UnsafeMutableRawPointer(bitPattern: client.uintValue)
      td_json_client_destroy(clientPointer)
      resolve("Client destroyed")
    }
  
  @objc(json_client_receive:timeout:resolve:reject:)
    func json_client_receive(_ client: NSNumber, timeout: Double, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
      let clientPointer = UnsafeMutableRawPointer(bitPattern: client.uintValue)
      if let responseCString = td_json_client_receive(clientPointer, timeout) {
        resolve(String(cString: responseCString))
      } else {
        reject("td_json_client_receive_error", "Failed to receive response", nil)
      }
    }

    @objc
    func receive(timeout: Double, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
      if let responseCString = td_receive(timeout) {
        resolve(String(cString: responseCString))
      } else {
        reject("td_receive_error", "Failed to receive response", nil)
      }
    }
  
    @objc(startUpdateListener:resolve:reject:)
    func startUpdateListener(_ client: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
      guard !updateListenerActive else {
        resolve("Listener already active")
        return
      }
      
      updateListenerActive = true
      let clientPointer = UnsafeMutableRawPointer(bitPattern: client.uintValue)

      DispatchQueue.global(qos: .background).async {
        while self.updateListenerActive {
          if let responseCString = td_json_client_receive(clientPointer, 10.0) {
            let update = String(cString: responseCString)
            print(update)
            self.sendEvent(withName: "onTelegramUpdate", body: update)
          }
        }
      }

      resolve("Listener started")
    }

    @objc
    func stopUpdateListener(_ resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
      updateListenerActive = false
      resolve("Listener stopped")
    }

    // Required for RCTEventEmitter
    override func supportedEvents() -> [String]! {
      return ["onTelegramUpdate"]
    }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return false;
  }
}
