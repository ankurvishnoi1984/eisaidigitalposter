import { useState } from "react";
import axios from "axios";

import * as XLSX from "xlsx";
import { BASEURL } from "../../constant/constant";

export default function BulkUploadModal({ closeModal, refreshList }) {
  const [file, setFile] = useState(null);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [resultRows, setResultRows] = useState([]);
const RESULT_HEADERS = [
  "empcode",
  "name",
  "role",
  "designation",
  "hq",
  "email",
  "reporting",
  "password",
   "Status",
  "Remark"
];
const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (!selectedFile) return;

  const isXlsx =
    selectedFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    selectedFile.name.toLowerCase().endsWith(".xlsx");

  if (!isXlsx) {
    alert("Only XLSX files are allowed");
    e.target.value = null;   // reset input
    setFile(null);
    return;
  }

  setFile(selectedFile);
};

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an XLSX file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${BASEURL}/bulkUploadUsers`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

     alert(res.data.message || "Upload processed");

      setSuccessCount(res.data.successCount);
      setFailedCount(res.data.failedCount);

   const formattedSuccess = (res.data.successList || []).map(row => ({
  empcode: row[0],
  name: row[1],
  role: row[2],
  designation: row[3],
  hq: row[4],
  email: row[8],
  reporting: row[9],
  password: row[10],
  Status: "Success",
  Remark: row.Remark
}));

const formattedFailed = (res.data.failedList || []).map(row => ({
  empcode: row.empcode || "",
  name: row.name || "",
  role: "",
  designation: row.designation || "",
  hq: row.hq || "",
  region: row.region || "",
  state: row.state || "",
  zone: row.zone || "",
  email: row.email || "",
  reporting: row.reporting || "",
  password: row.password || "",
  Status: row.Status,
  Remark: row.Remark
}));

const combined = [...formattedSuccess, ...formattedFailed];

setResultRows(combined);

      refreshList();
    } catch (err) {
      alert(err?.response?.data?.message || "Upload failed");
    }
  };

  // ✅ SAMPLE XLSX DOWNLOAD
  const handleDownloadSample = () => {
    const data = [{
      empcode: "",
      name: "",
      email: "",
      hq: "",
      designation: "",
      reporting: "",
      password: ""
    }];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    XLSX.writeFile(wb, "sample_Template.xlsx");
  };

  // ✅ RESULT XLSX DOWNLOAD
 const downloadResults = () => {
  if (!resultRows.length) {
    alert("No results available");
    return;
  }

  const normalizedRows = resultRows.map(row => {
    const obj = {};
    RESULT_HEADERS.forEach(key => {
      obj[key] = row[key] ?? "";
    });
    return obj;
  });

  const ws = XLSX.utils.json_to_sheet(normalizedRows, {
    header: RESULT_HEADERS
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Results");

  XLSX.writeFile(wb, "bulk_upload_results.xlsx");
};

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg">

          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Upload Employee XLSX</h5>
            <button className="close-but" onClick={closeModal}>×</button>
          </div>

         <div className="modal-body px-4 py-4">

  {/* STEP 1: DOWNLOAD TEMPLATE */}
  <div className="download-card mb-4">
    <div className="download-left">
      <i className="fas fa-file-excel excel-icon"></i>
      <div>
        <h6 className="mb-1">Step 1: Download Excel Template</h6>
        <small>Please make sure the file is uploaded using the given sample format</small>
      </div>
    </div>

    <button
      className="btn btn-success btn-lg download-btn"
      onClick={handleDownloadSample}
    >
      <i className="fas fa-download me-2"></i>
      Download Sample XLSX
    </button>
  </div>

  {/* STEP 2: UPLOAD FILE */}
  <form onSubmit={handleUpload}>
    <div
      className="upload-box p-4 text-center rounded-3"
      onClick={() => document.getElementById("fileInputEmp").click()}
    >
      <i className="fas fa-file-excel fa-3x text-success mb-3"></i>

      <p className="mb-1">
        {file ? <b>{file.name}</b> : "Click to select XLSX file"}
      </p>
      <small className="text-muted">
        Only .xlsx files are supported
      </small>

   <input
  type="file"
  id="fileInputEmp"
  accept=".xlsx"
  hidden
  onChange={handleFileChange}
/>

    </div>

    <div className="text-center mt-4">
      <button className="btn btn-primary btn-lg px-5" type="submit">
        <i className="fas fa-upload me-2"></i> Upload Employees
      </button>
    </div>
  </form>

  {/* RESULT SECTION */}
  {(successCount > 0 || failedCount > 0) && (
    <div className="mt-4 result-card p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <span className="badge bg-success mr-2">
            Success: {successCount}
          </span>
          <span className="badge bg-danger">
            Failed: {failedCount}
          </span>
        </h6>

        <button
          className="btn btn-primary"
          onClick={downloadResults}
        >
          <i className="fas fa-file-download mr-1"></i>
          Download Results
        </button>
      </div>
      <small className="text-muted"> XLSX contains Status & Remark columns </small>
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
}
