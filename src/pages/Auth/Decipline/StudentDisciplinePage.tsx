import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDiscipline, clearStudentRecord } from "../../../Redux/Auth/Decipline/studentDisciplineSlice";
import { RootState, AppDispatch } from "../../../Redux/store";
import html2pdf from "html2pdf.js";
import { FiSearch, FiX, FiPrinter, FiDownload, FiUser, FiCalendar, FiAward, FiAlertTriangle, FiCheckCircle} from "react-icons/fi";
import { motion } from "framer-motion";

const StudentDisciplinePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchId, setSearchId] = useState("");
  const { fullname, className, disciplines, loading, error } = useSelector(
    (state: RootState) => state.studentDiscipline
  );

  const reportRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (!searchId) return;
    dispatch(fetchStudentDiscipline(Number(searchId)));
  };

  const handleClear = () => {
    setSearchId("");
    dispatch(clearStudentRecord());
  };

  const handlePrint = () => {
    if (reportRef.current) {
      const originalContents = document.body.innerHTML;
      const printContents = reportRef.current.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const handleExportPDF = () => {
    if (reportRef.current) {
      html2pdf()
        .from(reportRef.current)
        .set({
          margin: 0.5,
          filename: `${fullname}_Discipline_Report.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .save();
    }
  };

  const getSeverityColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("warning")) return "bg-yellow-100 text-yellow-800";
    if (lowerType.includes("serious")) return "bg-orange-100 text-orange-800";
    if (lowerType.includes("critical")) return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Student <span className="text-indigo-600">Discipline</span> Records
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Search and view individual student disciplinary records
        </p>
      </motion.div>

      {/* Search Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="studentId"
                placeholder="Enter Student ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                {searchId && (
                  <button
                    onClick={handleClear}
                    className="px-3 text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchId || loading}
            className={`flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              !searchId || loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <FiSearch className="mr-2" />
                Search Records
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Loading/Error States */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border-l-4 border-red-400 p-4 mb-8"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Student Report */}
      {fullname && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Report Header */}
          <div className="px-6 py-5 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{fullname}</h2>
              <p className="text-gray-600 flex items-center mt-1">
                <FiAward className="mr-2" /> Class: {className}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiPrinter className="mr-2" />
                Print
              </button>
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiDownload className="mr-2" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div ref={reportRef} className="p-6">
            {disciplines.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <FiCheckCircle className="w-full h-full" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No disciplinary records</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This student has no disciplinary records on file.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action Taken
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" />
                          Date
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {disciplines.map((d, idx) => (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(d.type)}`}>
                            {d.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                          {d.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {d.actionTaken || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(d.recordedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentDisciplinePage;
