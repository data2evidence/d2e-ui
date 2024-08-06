import request from "./request";

const WHITE_RABBIT_BASE_URL = "http://localhost:41180/white-rabbit/api/";

export class WhiteRabbit {
  public createScanReport(file: File) {
    return request({
      baseURL: WHITE_RABBIT_BASE_URL,
      url: `scan-report/files`,
      method: "POST",
      data: {
        settings: {
          fileType: "CSV files",
          delimiter: ",",
          scanDataParams: {
            sampleSize: 100000,
            scanValues: true,
            minCellCount: 5,
            maxValue: 1000,
            calculateNumbericStats: false,
            numericStatsSamplerSize: 100000,
          },
        },
        files: file,
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
      url: `scan-report/result-as-source/${id}`,
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
}
