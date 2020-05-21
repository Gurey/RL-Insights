import React, { useMemo, useState } from "react";
import { useSettings } from "../../store/settings/settingsStore";
import { useReplays } from "../../store/replays";
import {
  Button,
  Typography,
  Card,
  CardContent,
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Table,
  CircularProgress,
  TableFooter,
  TablePagination,
} from "@material-ui/core";
import fs from "fs";

export default function ImportScreen(props: any) {
  const [settingsState] = useSettings();
  const [state, actions] = useReplays();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  useMemo(() => actions.findReplays(settingsState.replaysFolder), [
    settingsState.replaysFolder,
  ]);

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5">Import</Typography>
        </CardContent>
      </Card>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>File</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Imported</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.replays.length > 0 &&
              state.replays
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((r) => {
                  const importClick = () => {
                    const outputPath = actions
                      .importReplay(r)
                      .then((output) => {
                        if (output) {
                          console.log(`Index ${output}`);
                          actions.indexReplay(output, settingsState.playerId);
                        }
                      });
                  };
                  const importButton = !r.importing ? (
                    <Button size="small" color="primary" onClick={importClick}>
                      {r.imported ? "Re-import" : "Import"}
                    </Button>
                  ) : (
                    <CircularProgress size={24} />
                  );
                  return (
                    <TableRow key={r.name}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.imported ? "Yes" : "No"}</TableCell>
                      <TableCell>{importButton}</TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                colSpan={3}
                count={state.replays.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={(
                  event: React.MouseEvent<HTMLButtonElement> | null,
                  newPage: number,
                ) => setPage(newPage)}
                onChangeRowsPerPage={(
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >,
                ) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
