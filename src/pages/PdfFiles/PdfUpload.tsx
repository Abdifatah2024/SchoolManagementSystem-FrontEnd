import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  uploadPdfFn,
  resetPdfState,
  fetchDocuments,
  deleteDocument,
} from "../PdfFiles/PdfUploadSlice";
import { AppDispatch, RootState } from "../../Redux/store";
import toast, { Toaster } from "react-hot-toast";
import {
  FiUpload,
  FiFile,
  FiLoader,
  FiX,
  FiTrash2,
  FiEye,
  FiExternalLink,
  FiXCircle,
  FiPlusCircle // Added for a more inviting upload icon
} from "react-icons/fi";
import { motion } from "framer-motion"; // Import motion for animations

const PdfUpload = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success, documents } = useSelector(
    (state: RootState) => state.pdfUpload
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const validationSchema = yup.object({
    title: yup.string()
      .required("Title is required")
      .max(60, "Title must be 60 characters or less"),
    pdf: yup
      .mixed()
      .required("PDF file is required")
      .test("fileType", "Only PDF files are accepted", (value) => {
        return value && (value as File).type === "application/pdf";
      })
      .test("fileSize", "File too large (max 10MB)", (value) => {
        return value && (value as File).size <= 10 * 1024 * 1024;
      }),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      pdf: null as File | null
    },
    validationSchema,
    onSubmit: (values) => {
      if (!values.pdf) return;
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("pdf", values.pdf);
      toast.loading("Uploading PDF...", { id: "uploading" }); // Add ID for easier dismissal
      dispatch(uploadPdfFn(formData));
    },
  });

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.dismiss("uploading"); // Dismiss loading toast
      toast.error(error);
      dispatch(resetPdfState());
    }
    if (success) {
      toast.dismiss("uploading"); // Dismiss loading toast
      toast.success(success);
      formik.resetForm();
      setPreviewUrl(null);
      dispatch(resetPdfState());
      dispatch(fetchDocuments());
    }
  }, [error, success, dispatch, formik]); // Added formik to dependency array

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("pdf", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    // Clear the input value so the same file can be selected again after removal
    e.target.value = '';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        formik.setFieldValue("pdf", file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        formik.setFieldError("pdf", "Only PDF files are accepted");
        toast.error("Only PDF files can be uploaded."); // User feedback for wrong file type
      }
    }
  };

  const handleDelete = (id: number) => { // Changed id type to string as per typical API usage
    if (window.confirm("Are you sure you want to delete this document?")) {
      toast.loading("Deleting document...", { id: "deleting" });
      dispatch(deleteDocument(id))
        .unwrap()
        .then(() => {
          toast.dismiss("deleting");
          toast.success("Document deleted successfully");
          dispatch(fetchDocuments()); // Re-fetch documents to update list
        })
        .catch((err) => {
          toast.dismiss("deleting");
          toast.error(err.message || "Failed to delete document");
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#6EE7B7', // Green-300
              secondary: '#10B981', // Green-600
            },
          },
          error: {
            iconTheme: {
              primary: '#F87171', // Red-400
              secondary: '#EF4444', // Red-500
            },
          },
        }}
      />

      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 w-full max-w-4xl"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Manage Your Documents
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Upload new files or manage existing ones with ease.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
              <FiUpload className="text-blue-500" /> Upload New Document
            </h2>
            <p className="text-sm text-gray-500 mt-1">Fill out the details and select your PDF file.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-6">
            {/* Title Input */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Document Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                placeholder="Enter a descriptive title"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="flex items-center text-red-600 text-sm mt-2">
                  <FiXCircle className="mr-1.5 w-4 h-4" />
                  {formik.errors.title}
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File <span className="text-red-500">*</span>
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-blue-500 bg-blue-100 scale-[1.01]"
                    : formik.touched.pdf && formik.errors.pdf
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <input
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="p-3 rounded-full bg-white border border-gray-200 shadow-sm"
                  >
                    <FiPlusCircle className="w-8 h-8 text-blue-500" /> {/* Larger, distinct icon */}
                  </motion.div>
                  <div>
                    <p className="text-base font-medium text-gray-800">
                      {dragActive
                        ? "Drop your PDF here!"
                        : "Drag & drop your PDF or click to browse"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF files only (max 10MB)
                    </p>
                  </div>
                </div>
              </div>
              {formik.touched.pdf && formik.errors.pdf && (
                <div className="flex items-center text-red-600 text-sm mt-2">
                  <FiXCircle className="mr-1.5 w-4 h-4" />
                  {formik.errors.pdf}
                </div>
              )}
            </div>

            {/* File Preview */}
            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-blue-100 rounded-lg p-4 mb-6 border border-blue-200"
              >
                <div className="flex items-center space-x-3">
                  <FiFile className="text-blue-600 flex-shrink-0 w-5 h-5" />
                  <span className="text-sm font-medium text-blue-800 truncate max-w-xs">
                    {formik.values.pdf?.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    formik.setFieldValue("pdf", null);
                    setPreviewUrl(null);
                  }}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  title="Remove selected file"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !formik.values.pdf || !formik.values.title}
              className={`w-full flex justify-center items-center py-3.5 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:-translate-y-0.5 ${
                loading || !formik.values.pdf || !formik.values.title
                  ? "bg-blue-400 cursor-not-allowed opacity-70"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2.5" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2.5" />
                  Upload Document
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-green-50">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
              <FiFile className="text-teal-600" /> Your Documents
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {documents.length} document{documents.length !== 1 ? 's' : ''} stored.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {documents.length === 0 ? (
              <div className="p-8 text-center bg-gray-50">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4 shadow-sm">
                  <FiFile className="w-7 h-7 text-gray-500" />
                </div>
                <h3 className="text-gray-600 font-semibold text-lg">No documents yet</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Upload your first PDF document to get started.
                </p>
              </div>
            ) : (
              documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * documents.indexOf(doc) }}
                  className="p-4 hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="p-2.5 rounded-lg bg-teal-100 text-teal-600 flex-shrink-0 shadow-sm">
                        <FiFile className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-gray-800 hover:text-blue-600 truncate block hover:underline text-lg"
                          title={`Open ${doc.title}`}
                        >
                          {doc.title}
                          <FiExternalLink className="inline-block w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View in new tab"
                      >
                        <FiEye className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)} // Ensure doc.id is string
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete document"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PdfUpload;