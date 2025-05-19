// // api-features.js
// import mongoose from "mongoose";
// import winston from "winston";
// import { securityConfig } from './security-config.js'
// import HandleERROR from "./handleError.js";

// // تنظیم logger با winston
// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [new winston.transports.Console()]
// });

// export class ApiFeatures {
//   constructor(model, query, userRole = "guest") {
//     this.Model = model;
//     this.query = { ...query };
//     this.userRole = userRole;
//     this.pipeline = [];
//     this.countPipeline = [];
//     this.manualFilters = {};
//     // انتخاب استفاده از cursor برای پردازش داده‌های حجیم
//     this.useCursor = false;
//     this.#initialSanitization();
//   }

//   // ---------- Core Methods ----------
//   filter() {
//     const queryFilters = this.#parseQueryFilters();
//     const mergedFilters = { ...queryFilters, ...this.manualFilters };
//     const safeFilters = this.#applySecurityFilters(mergedFilters);

//     if (Object.keys(safeFilters).length > 0) {
//       // اضافه کردن فیلتر به ابتدای pipeline جهت بهبود عملکرد
//       this.pipeline.push({ $match: safeFilters });
//       this.countPipeline.push({ $match: safeFilters });
//     }
//     return this;
//   }

//   sort() {
//     if (this.query.sort) {
//       const sortObject = this.query.sort.split(",").reduce((acc, field) => {
//         const [key, order] = field.startsWith("-")
//           ? [field.slice(1), -1]
//           : [field, 1];
//         acc[key] = order;
//         return acc;
//       }, {});
//       this.pipeline.push({ $sort: sortObject });
//     }
//     return this;
//   }

//   limitFields() {
//     if (this.query.fields) {
//       const allowedFields = this.query.fields
//         .split(",")
//         .filter(f => !securityConfig.forbiddenFields.includes(f))
//         .reduce((acc, curr) => ({ ...acc, [curr]: 1 }), {});

//       this.pipeline.push({ $project: allowedFields });
//     }
//     return this;
//   }

//   paginate() {
//     const { maxLimit } = securityConfig.accessLevels[this.userRole] || { maxLimit: 100 };
//     const page = Math.max(parseInt(this.query.page, 10) || 1, 1);
//     const limit = Math.min(
//       parseInt(this.query.limit, 10) || 10,
//       maxLimit
//     );
    
//     this.pipeline.push(
//       { $skip: (page - 1) * limit },
//       { $limit: limit }
//     );
//     return this;
//   }

//   populate(input = "") {
//     let populateOptions = [];
  
//     if (Array.isArray(input)) {
//       input.forEach(item => {
//         if (typeof item === "object" && item.path) {
//           populateOptions.push(item);
//         } else if (typeof item === "string") {
//           populateOptions.push(item);
//         }
//       });
//     } else if (typeof input === "object" && input.path) {
//       populateOptions.push(input);
//     } else if (typeof input === "string" && input.trim().length > 0) {
//       input.split(",").filter(Boolean).forEach(item => {
//         populateOptions.push(item.trim());
//       });
//     }
  
//     if (this.query.populate) {
//       this.query.populate.split(",").filter(Boolean).forEach(item => {
//         populateOptions.push(item.trim());
//       });
//     }
  
//     const uniqueMap = new Map();
//     populateOptions.forEach(item => {
//       if (typeof item === "object" && item.path) {
//         uniqueMap.set(item.path, item);
//       } else if (typeof item === "string") {
//         uniqueMap.set(item, item);
//       }
//     });
//     const uniquePopulateOptions = Array.from(uniqueMap.values());
  
//     uniquePopulateOptions.forEach(option => {
//       let field, projection = {};
//       if (typeof option === "object") {
//         field = option.path;
//         if (option.select) {
//           option.select.split(" ").forEach(fieldName => {
//             if (fieldName) projection[fieldName.trim()] = 1;
//           });
//         }
//       } else if (typeof option === "string") {
//         field = option;
//       }
  
//       field = field.trim();
//       const { collection, isArray } = this.#getCollectionInfo(field);
  
//       let lookupStage = {};
//       if (Object.keys(projection).length > 0) {
//         lookupStage = {
//           $lookup: {
//             from: collection,
//             let: { localField: `$${field}` },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$localField"] }
//                 }
//               },
//               { $project: projection }
//             ],
//             as: field
//           }
//         };
//       } else {
//         lookupStage = {
//           $lookup: {
//             from: collection,
//             localField: field,
//             foreignField: "_id",
//             as: field
//           }
//         };
//       }
  
//       this.pipeline.push(lookupStage);
//       this.pipeline.push({
//         $unwind: {
//           path: `$${field}`,
//           preserveNullAndEmptyArrays: true
//         }
//       });
//     });
  
//     // پشتیبانی از nested populate: در صورت نیاز، منطق تو در تو را می‌توانید اینجا اضافه کنید.
  
//     return this;
//   }
  
//   addManualFilters(filters) {
//     if (filters) {
//       this.manualFilters = { ...this.manualFilters, ...filters };
//     }
//     return this;
//   }

//   async execute(options = {}) {
//     try {
//       // انتخاب حالت cursor در مواقع پردازش داده‌های حجیم
//       if (options.useCursor === true) {
//         this.useCursor = true;
//       }
//       // اجرای موازی pipeline‌های شمارش و داده
//       const [countResult, dataResult] = await Promise.all([
//         this.Model.aggregate([...this.countPipeline, { $count: "total" }]),
//         (this.useCursor
//           ? this.Model.aggregate(this.pipeline).cursor({ batchSize: 100 }).exec()
//           : this.Model.aggregate(this.pipeline)
//               .allowDiskUse(options.allowDiskUse || false)
//               .readConcern("majority")
//         )
//       ]);

//       const count = countResult[0]?.total || 0;
//       let data = [];
//       if (this.useCursor) {
//         const cursor = dataResult;
//         for await (const doc of cursor) {
//           data.push(doc);
//         }
//       } else {
//         data = dataResult;
//       }
      
//       return {
//         success: true,
//         count,
//         data
//       };
//     } catch (error) {
//       this.#handleError(error);
//     }
//   }

//   // ---------- Security and Sanitization Methods ----------
//   #initialSanitization() {
//     ["$where", "$accumulator", "$function"].forEach(op => {
//       delete this.query[op];
//       delete this.manualFilters[op];
//     });
//     ["page", "limit"].forEach(field => {
//       if (this.query[field] && !/^\d+$/.test(this.query[field])) {
//         throw new HandleERROR(`Invalid value for ${field}`, 400);
//       }
//     });
//   }

//   #parseQueryFilters() {
//     const queryObj = { ...this.query };
//     ["page", "limit", "sort", "fields", "populate"].forEach(el => delete queryObj[el]);

//     return JSON.parse(
//       JSON.stringify(queryObj)
//         .replace(/\b(gte|gt|lte|lt|in|nin|eq|ne|regex|exists|size)\b/g, "$$$&")
//     );
//   }

//   #applySecurityFilters(filters) {
//     let result = { ...filters };
  
//     securityConfig.forbiddenFields.forEach(field => delete result[field]);
  
//     if (this.userRole !== "admin" && this.Model.schema.path("isActive")) {
//       result.isActive = true;
//       result = this.#sanitizeNestedObjects(result);
//     }
  
//     return result;
//   }

//   #sanitizeNestedObjects(obj) {
//     return Object.entries(obj).reduce((acc, [key, value]) => {
//       if (typeof value === "object" && !Array.isArray(value)) {
//         acc[key] = this.#sanitizeNestedObjects(value);
//       } else {
//         acc[key] = this.#sanitizeValue(key, value);
//       }
//       return acc;
//     }, {});
//   }

//   #sanitizeValue(key, value) {
//     if (key.endsWith("Id") && mongoose.isValidObjectId(value)) {
//       return new mongoose.Types.ObjectId(value);
//     }
//     if (typeof value === "string") {
//       if (value === "true") return true;
//       if (value === "false") return false;
//       if (/^\d+$/.test(value)) return parseInt(value);
//     }
//     return value;
//   }

//   #getCollectionInfo(field) {
//     const schemaPath = this.Model.schema.path(field);
//     if (!schemaPath?.options?.ref) {
//       throw new HandleERROR(`Invalid populate field: ${field}`, 400);
//     }

//     const refModel = mongoose.model(schemaPath.options.ref);
//     if (refModel.schema.options.restricted && this.userRole !== "admin") {
//       throw new HandleERROR(`Unauthorized to populate ${field}`, 403);
//     }

//     return {
//       collection: refModel.collection.name,
//       isArray: schemaPath.instance === "Array"
//     };
//   }

//   #handleError(error) {
//     // ثبت خطا در logger همراه با stack trace
//     logger.error(`[API Features Error]: ${error.message}`, { stack: error.stack });
//     throw error;
//   }
// }

// export default ApiFeatures;




// api-features.js
import mongoose from "mongoose";
import winston from "winston";
import { securityConfig } from "./security-config.js";
import HandleERROR from "./handleError.js";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

export class ApiFeatures {
  constructor(model, query, userRole = "guest") {
    this.Model = model;
    this.query = { ...query };
    this.userRole = userRole;
    this.pipeline = [];
    this.countPipeline = [];
    this.manualFilters = {};
    this.useCursor = false;
    this.#initialSanitization();
  }

  filter() {
    const queryFilters = this.#parseQueryFilters();
    const mergedFilters = { ...queryFilters, ...this.manualFilters };
    const safeFilters = this.#applySecurityFilters(mergedFilters);

    if (Object.keys(safeFilters).length) {
      this.pipeline.push({ $match: safeFilters });
      this.countPipeline.push({ $match: safeFilters });
    }
    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortObject = this.query.sort.split(",").reduce((acc, field) => {
        const [key, order] = field.startsWith("-")
          ? [field.slice(1), -1]
          : [field, 1];
        acc[key] = order;
        return acc;
      }, {});
      this.pipeline.push({ $sort: sortObject });
    }
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const projection = this.query.fields
        .split(",")
        .filter(f => !securityConfig.forbiddenFields.includes(f))
        .reduce((acc, f) => ({ ...acc, [f]: 1 }), {});
      this.pipeline.push({ $project: projection });
    }
    return this;
  }

  paginate() {
    const { maxLimit } =
      securityConfig.accessLevels[this.userRole] || { maxLimit: 100 };
    const page = Math.max(parseInt(this.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(this.query.limit, 10) || 10, maxLimit);

    this.pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });
    return this;
  }

  populate(input = "") {
    let opts = [];
    const pushOpt = i => (i ? opts.push(i) : null);
    if (Array.isArray(input)) input.forEach(pushOpt);
    else if (typeof input === "object" && input.path) pushOpt(input);
    else if (typeof input === "string" && input.trim())
      input.split(",").forEach(i => pushOpt(i.trim()));
    if (this.query.populate)
      this.query.populate.split(",").forEach(i => pushOpt(i.trim()));

    const unique = new Map();
    opts.forEach(o =>
      typeof o === "object" ? unique.set(o.path, o) : unique.set(o, o)
    );
    opts = [...unique.values()];

    opts.forEach(opt => {
      let field,
        projection = {};
      if (typeof opt === "object") {
        field = opt.path;
        if (opt.select)
          opt.select.split(" ").forEach(f => (projection[f.trim()] = 1));
      } else field = opt;

      field = field.trim();
      const { collection } = this.#getCollectionInfo(field);

      const lookup =
        Object.keys(projection).length > 0
          ? {
              $lookup: {
                from: collection,
                let: { localField: `$${field}` },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$localField"] } } },
                  { $project: projection }
                ],
                as: field
              }
            }
          : {
              $lookup: {
                from: collection,
                localField: field,
                foreignField: "_id",
                as: field
              }
            };

      this.pipeline.push(lookup);
      this.pipeline.push({
        $unwind: { path: `$${field}`, preserveNullAndEmptyArrays: true }
      });
    });
    return this;
  }

  addManualFilters(filters) {
    if (filters) this.manualFilters = { ...this.manualFilters, ...filters };
    return this;
  }

  async execute(options = {}) {
    try {
      if (options.useCursor) this.useCursor = true;

      const [countRes, dataRes] = await Promise.all([
        this.Model.aggregate([...this.countPipeline, { $count: "total" }]),
        this.useCursor
          ? this.Model.aggregate(this.pipeline)
              .cursor({ batchSize: 100 })
              .exec()
          : this.Model.aggregate(this.pipeline)
              .allowDiskUse(options.allowDiskUse || false)
              .readConcern("majority")
      ]);

      const count = countRes[0]?.total || 0;
      const data = this.useCursor ? await dataRes.toArray() : dataRes;

      return { success: true, count, data };
    } catch (err) {
      this.#handleError(err);
    }
  }

  #initialSanitization() {
    ["$where", "$accumulator", "$function"].forEach(op => {
      delete this.query[op];
      delete this.manualFilters[op];
    });
    ["page", "limit"].forEach(f => {
      if (this.query[f] && !/^\d+$/.test(this.query[f]))
        throw new HandleERROR(`Invalid value for ${f}`, 400);
    });
  }

  #parseQueryFilters() {
    const q = { ...this.query };
    ["page", "limit", "sort", "fields", "populate"].forEach(el => delete q[el]);

    return JSON.parse(
      JSON.stringify(q).replace(
        /\b(gte|gt|lte|lt|in|nin|eq|ne|regex|exists|size)\b/g,
        "$$$&"
      )
    );
  }

  #applySecurityFilters(filters) {
    let res = { ...filters };
    securityConfig.forbiddenFields.forEach(f => delete res[f]);

    if (
      this.userRole !== "admin" &&
      this.Model.schema.path("isActive") !== undefined
    ) {
      res.isActive = true;
    }

    res = this.#sanitizeNestedObjects(res);
    res = this.#normalizeInOperators(res);
    return res;
  }

  #sanitizeNestedObjects(obj) {
    return Object.entries(obj).reduce((acc, [k, v]) => {
      if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        acc[k] = this.#sanitizeNestedObjects(v);
      } else {
        acc[k] = this.#sanitizeValue(k, v);
      }
      return acc;
    }, {});
  }

  // #sanitizeValue(key, value) {
  //   if (typeof value === "string") {
  //     value = value.trim();

  //     if (value.length === 0) return value;

  //     if (mongoose.isValidObjectId(value)) {
  //       return new mongoose.Types.ObjectId(value);
  //     }

  //     if (value === "true") return true;
  //     if (value === "false") return false;
  //     if (/^\d+$/.test(value)) return parseInt(value, 10);
  //   }
  //   return value;
  // }

  #sanitizeValue(key, value) {
  if (typeof value === "string") {
    value = value.trim();

    if (value.length === 0) return value;

    if (value.toLowerCase() === "null") return null;  // اضافه شده

    if (mongoose.isValidObjectId(value)) {
      return new mongoose.Types.ObjectId(value);
    }

    if (value === "true") return true;
    if (value === "false") return false;
    if (/^\d+$/.test(value)) return parseInt(value, 10);
  }
  return value;
}


  #normalizeInOperators(obj) {
    for (const [k, v] of Object.entries(obj)) {
      if (k === "$in" || k === "$nin") {
        if (!Array.isArray(v)) obj[k] = [v];
      } else if (typeof v === "object" && v !== null) {
        this.#normalizeInOperators(v);
      }
    }
    return obj;
  }

  #getCollectionInfo(field) {
    const schemaPath = this.Model.schema.path(field);
    if (!schemaPath?.options?.ref)
      throw new HandleERROR(`Invalid populate field: ${field}`, 400);

    const refModel = mongoose.model(schemaPath.options.ref);
    if (refModel.schema.options.restricted && this.userRole !== "admin")
      throw new HandleERROR(`Unauthorized to populate ${field}`, 403);

    return {
      collection: refModel.collection.name,
      isArray: schemaPath.instance === "Array"
    };
  }

  #handleError(err) {
    logger.error(`[API Features Error]: ${err.message}`, { stack: err.stack });
    throw err;
  }
}

export default ApiFeatures;
