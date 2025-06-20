// export const securityConfig = {
//     allowedOperators: [
//       "eq", "ne", "gt", "gte",
//       "lt", "lte", "in", "nin",
//       "regex", "exists", "size","or","and"
//     ],
  
//     forbiddenFields: [
//       "password",
//     ],
  
//     accessLevels: {
//       guest: {
//         maxLimit: 50,
//         allowedPopulate: ["*"]
//       },
//       user: {
//         maxLimit: 100,
//         allowedPopulate: ["*"]
//       },
//       admin: {
//         maxLimit: 1000,
//         allowedPopulate: ["*"]
//       },
//       superAdmin: {
//         maxLimit: 1000,
//         allowedPopulate: ["*"]
//       },

//     }
//   };



import mongoose from "mongoose";
import winston from "winston";
import HandleERROR from "./handleError.js";

/***********************
 * security-config.js  *
 ***********************/
export const securityConfig = {
  allowedOperators: [
    "eq",
    "ne",
    "gt",
    "gte",
    "lt",
    "lte",
    "in",
    "nin",
    "regex",
    "exists",
    "size",
    "or",
    "and"
  ],
  forbiddenFields: ["password"],
  accessLevels: {
    guest: {
      maxLimit: 50,
      allowedPopulate: ["*"]
    },
    user: {
      maxLimit: 100,
      allowedPopulate: ["*"]
    },
    admin: {
      maxLimit: 1000,
      allowedPopulate: ["*"]
    },
    superAdmin: {
      maxLimit: 1000,
      allowedPopulate: ["*"]
    }
  }
};
