import React, { useEffect, useState } from "react";
import { Container, Box, Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { getTableData, getTableCount, getWorkflowInstances } from "api";

const columns = [
  { field: "employeeID", headerName: "employeeID", width: 250 },
  { field: "empEmail", headerName: "empEmail", flex: 1 },
  { field: "empJobCode", headerName: "empJobCode", flex: 1 }
];

const PAGE_SIZE = 15;

export default function MasterPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workflowInstances, setWorkflowInstances] = useState(null);

  // Number of rows which exist on the service
  const [rowCount, setRowCount] = useState(0);

  const loadData = async (isFirstLoad, skip = 0) => {
    try {
      setItems([]);
      setLoading(true);

      if (isFirstLoad) {
        const count = await getTableCount();
        setRowCount(count);
      }

      const _items = await getTableData({
        $top: PAGE_SIZE,
        $skip: skip
      });
      const itemsWithIds = _items.map((item, index) => {
        item.id = index;
        return item;
      });
      setItems(itemsWithIds);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChanged = ({ page }) => {
    loadData(false, page * PAGE_SIZE);
  };

  const handleShowWorkflowInstances = async () => {
    try {
      const data = await getWorkflowInstances();
      setWorkflowInstances(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // when component mounted
    loadData(true);
  }, []);

  return (
    <Container disableGutters>
      <Box py={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleShowWorkflowInstances}
        >
          Show workflow instances
        </Button>
      </Box>
      <Box height="80vh" py={5}>
        <DataGrid
          loading={loading}
          rows={items}
          columns={columns}
          pageSize={PAGE_SIZE}
          paginationMode="server"
          rowCount={rowCount}
          onPageChange={handlePageChanged}
        />
      </Box>
      {workflowInstances && (
        <Box py={2}>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(workflowInstances, null, 2)}
          </pre>
        </Box>
      )}
    </Container>
  );
}
