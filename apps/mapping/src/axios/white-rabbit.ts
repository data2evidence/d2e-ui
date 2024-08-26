import request from "./request";
import env from "../env";
import { ScanDataDBConnectionForm } from "../types/scanDataDialog";

const WHITE_RABBIT_BASE_URL = `${env.VITE_PERSEUS_BASE_URL}white-rabbit/api/`;

export class WhiteRabbit {
  public createScanReport(files: File[]) {
    const formData = new FormData();

    const settings = {
      fileType: "CSV files",
      delimiter: ",",
      scanDataParams: {
        sampleSize: 100000,
        scanValues: true,
        minCellCount: 5,
        maxValues: 1000,
        calculateNumericStats: false,
        numericStatsSamplerSize: 100000,
      },
    };
    formData.append("settings", JSON.stringify(settings));

    // Append each file to the FormData object
    files.forEach((file) => {
      formData.append("files", file, file.name);
    });

    return request({
      baseURL: WHITE_RABBIT_BASE_URL,
      url: `scan-report/files`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  public createDBScanReport(postgresqlForm: ScanDataDBConnectionForm, tablesToScan: string[]) {
    const data = {
      ...postgresqlForm,
      scanDataParams: {
        sampleSize: 100000,
        scanValues: true,
        minCellCount: 5,
        maxValues: 1000,
        calculateNumericStats: false,
        numericStatsSamplerSize: 100000,
      },
      tablesToScan: tablesToScan.join(","),
    };

    return request({
      baseURL: WHITE_RABBIT_BASE_URL,
      url: `scan-report/db`,
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public getScanReportProgress(id: number) {
    return request({
      baseURL: WHITE_RABBIT_BASE_URL,
      url: `scan-report/conversion/${id}`,
      method: "GET",
    });
  }

  public getScanReport(id: number) {
    return request({
      baseURL: WHITE_RABBIT_BASE_URL,
      url: `scan-report/result-as-resource/${id}`,
      method: "GET",
    });
  }

  public getScanResult(id: number) {
    return request({
      baseURL: WHITE_RABBIT_BASE_URL,
      url: `scan-report/result/${id}`,
      method: "GET",
    });
  }

  public testDBConnection(connectionDetail: ScanDataDBConnectionForm) {
    return request({
      baseURL: WHITE_RABBIT_BASE_URL,
      url: `test-connection`,
      method: "POST",
      data: connectionDetail,
    });
  }
}
