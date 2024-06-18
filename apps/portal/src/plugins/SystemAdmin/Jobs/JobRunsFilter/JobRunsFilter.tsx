import React, { FC, useCallback, useEffect, useState } from "react";
import { Box, Autocomplete, Chip, TextField, Button } from "@portal/components";
import { DatePicker } from "@mui/x-date-pickers";
import { FlowRunJobStateTypes, HistoryJob } from "../types";
import { Flow, FlowRunFilters } from "../../../../types";
import { api } from "../../../../axios/api";

const flowRunStateOptions: FlowRunJobStateTypes[] = [
  FlowRunJobStateTypes.SCHEDULED,
  FlowRunJobStateTypes.PENDING,
  FlowRunJobStateTypes.RUNNING,
  FlowRunJobStateTypes.PAUSED,
  FlowRunJobStateTypes.COMPLETED,
  FlowRunJobStateTypes.CANCELLED,
  FlowRunJobStateTypes.CANCELLING,
  FlowRunJobStateTypes.FAILED,
  FlowRunJobStateTypes.CRASHED,
];

interface JobRunsFilterProps {
  result?: HistoryJob[];
  onChange?: (filter: FlowRunFilters) => void;
  onRefresh?: () => void;
}

const EMPTY_FILTERS = { startDate: null, endDate: null, states: [], flowIds: [], tags: [] };

export const JobRunsFilter: FC<JobRunsFilterProps> = ({ result, onChange, onRefresh }) => {
  const [filter, setFilter] = useState<FlowRunFilters>(EMPTY_FILTERS);
  const [flows, setFlows] = useState<Flow[]>();
  const [tags, setTags] = useState<string[]>();

  const fetchFlows = useCallback(async () => {
    try {
      const flows = await api.dataflow.getFlows();
      setFlows(flows);
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // Get tags from result
    setTags(Array.from(new Set(result?.flatMap((item) => item.type) || [])));
  }, [result]);

  useEffect(() => {
    fetchFlows();
  }, [fetchFlows]);

  const handleFilterChange = useCallback(
    (changes: Partial<FlowRunFilters>) => {
      setFilter((filter) => {
        const newFilter = { ...filter, ...changes };
        typeof onChange === "function" && onChange(newFilter);
        return newFilter;
      });
    },
    [onChange]
  );

  const handleRefresh = useCallback(() => {
    typeof onRefresh === "function" && onRefresh();
  }, [onRefresh]);

  return (
    <>
      <Box my="16px" display="flex" gap="8px">
        <DatePicker
          label="Start date"
          slotProps={{ textField: { size: "small", sx: { width: "150px" } } }}
          value={filter?.startDate}
          onChange={(startDate) => handleFilterChange({ startDate })}
        />
        <DatePicker
          label="End date"
          slotProps={{ textField: { size: "small", sx: { width: "150px" } } }}
          value={filter?.endDate}
          onChange={(endDate) => handleFilterChange({ endDate })}
        />
        <Box flex="1" display="flex" gap="8px">
          <Autocomplete
            multiple
            style={{ flexGrow: 1 }}
            options={flowRunStateOptions}
            value={filter?.states}
            onChange={(_, states) => handleFilterChange({ states })}
            renderInput={(params) => <TextField {...params} label="State" size="small" />}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} key={option} />
              ))
            }
          />
          <Autocomplete
            multiple
            style={{ flexGrow: 1 }}
            options={flows?.map((f) => f.id) || []}
            value={filter?.flowIds}
            onChange={(_, flowIds) => handleFilterChange({ flowIds })}
            getOptionLabel={(option) => flows?.find((f) => f.id === option)?.name || ""}
            renderInput={(params) => <TextField {...params} label="Flow" size="small" />}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  size="small"
                  label={flows?.find((f) => f.id === option)?.name}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
          />
          <Autocomplete
            multiple
            style={{ flexGrow: 1 }}
            options={tags || []}
            value={filter?.tags}
            onChange={(_, tags) => handleFilterChange({ tags })}
            renderInput={(params) => <TextField {...params} label="Tags" size="small" />}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} key={option} />
              ))
            }
          />
        </Box>
        <Button onClick={() => handleFilterChange(EMPTY_FILTERS)} text="Clear selection" />
        <Button variant="outlined" onClick={handleRefresh} text="Refresh" />
      </Box>
    </>
  );
};
