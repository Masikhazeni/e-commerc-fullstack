// import React, { useState, useEffect } from "react";
// import fetchData from "../../../Utils/fetchData";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

// const GetAllVariant = () => {
//   const [variants, setVariants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalCount, setTotalCount] = useState(0);
//   const [sort, setSort] = useState("-createdAt");
//   const navigate = useNavigate();
//   const { token } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const fetchVariants = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchData(
//           `variant?page=${currentPage}&limit=${itemsPerPage}&sort=${sort}`,
//           {
//             method: "GET",
//             headers: { authorization: `Bearer ${token}` },
//           }
//         );

//         if (response.success) {
//           setVariants(response.data);
//           setTotalCount(response.count);
//         } else {
//           setError(response.message);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVariants();
//   }, [currentPage, itemsPerPage, sort, token]);

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleSort = (field) => {
//     if (sort === field) setSort(`-${field}`);
//     else if (sort === `-${field}`) setSort(field);
//     else setSort(field);
//   };

//   const renderSortIcon = (field) => {
//     if (sort === field) return <FaSortUp className="inline ml-1" />;
//     if (sort === `-${field}`) return <FaSortDown className="inline ml-1" />;
//     return <FaSort className="inline ml-1 text-gray-400" />;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">All Variants</h1>
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {["type", "value", "createdAt"].map((field) => (
//                   <th
//                     key={field}
//                     onClick={() => handleSort(field)}
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
//                   >
//                     <div className="flex items-center gap-1 capitalize">
//                       {field === "createdAt" ? "Created At" : field}
//                       {renderSortIcon(field)}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {variants.map((variant) => (
//                 <tr
//                   key={variant._id}
//                   onClick={() => navigate(`update/${variant._id}`)}
//                   className="hover:bg-gray-50 transition-colors cursor-pointer"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">{variant.type}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{variant.value}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {variant.createdAt
//                       ? new Date(variant.createdAt).toLocaleDateString()
//                       : "-"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
//           <div className="flex-1 flex justify-between sm:hidden">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//             >
//               Next
//             </button>
//           </div>

//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div className="flex items-center gap-4">
//               <p className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
//                 <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of{" "}
//                 <span className="font-medium">{totalCount}</span> results
//               </p>
//               <select
//                 value={itemsPerPage}
//                 onChange={handleItemsPerPageChange}
//                 className="border rounded-md px-2 py-1 text-sm"
//               >
//                 <option value={10}>10 per page</option>
//                 <option value={20}>20 per page</option>
//                 <option value={50}>50 per page</option>
//               </select>
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <span className="px-4 py-2 text-sm text-gray-700">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {variants.length === 0 && !loading && (
//         <div className="text-center text-gray-500 mt-8">No variants found</div>
//       )}
//     </div>
//   );
// };

// export default GetAllVariant;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import fetchData from "../../../Utils/fetchData";

const GetAllVariant = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState("-createdAt");

  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVariants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchData(
          `variant?page=${currentPage}&limit=${itemsPerPage}&sort=${sort}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.success) {
          setVariants(response.data || []);
          setTotalCount(response.count || 0);
        } else {
          throw new Error(response.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
        setVariants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [currentPage, itemsPerPage, sort, token]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSort = (field) => {
    setSort((prev) =>
      prev === field ? `-${field}` : prev === `-${field}` ? field : field
    );
  };

  const renderSortIcon = (field) => {
    if (sort === field) return <FaSortUp className="ml-1 inline" />;
    if (sort === `-${field}`) return <FaSortDown className="ml-1 inline" />;
    return <FaSort className="ml-1 inline text-gray-400" />;
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "prev" ? Math.max(1, prev - 1) : Math.min(totalPages, prev + 1)
    );
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">All Variants</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>
      ) : variants.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">No variants found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["color", "size", "createdAt"].map((field) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer"
                    >
                      <div className="flex items-center">
                        {field === "createdAt" ? "Created At" : field}
                        {renderSortIcon(field)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {variants.map((variant) => (
                  <tr
                    key={variant._id}
                    onClick={() => navigate(`update/${variant._id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{variant.color}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{variant.size}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {variant.createdAt
                        ? new Date(variant.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing{" "}
                <strong>
                  {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, totalCount)}
                </strong>{" "}
                of <strong>{totalCount}</strong>
              </span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border px-2 py-1 rounded-md text-sm"
              >
                {[10, 20, 50].map((num) => (
                  <option key={num} value={num}>
                    {num} per page
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md text-sm bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md text-sm bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllVariant;

