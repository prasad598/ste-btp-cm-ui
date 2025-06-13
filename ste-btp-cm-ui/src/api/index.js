import axios from "axios";

const baseURL = "sthubsystem-qa/sap/opu/odata/sap/ZHR_GET_EMPLOYEE_DETAILS_CDS";

const instance = axios.create({
  baseURL
});

export const getTableData = async (params = { $top: 100, $skip: 0 }) => {
  const { data } = await instance.get("/ZHR_GET_EMPLOYEE_DETAILS", {
    params
  });

  return data.d?.results || data.d || data.value;
};

export const getTableCount = async () => {
  const { data } = await instance.get("/ZHR_GET_EMPLOYEE_DETAILS/$count");
  return data;
};
