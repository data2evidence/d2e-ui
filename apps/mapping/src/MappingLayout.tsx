import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./Navbar/Navbar";
import { TableMapLayout } from "./Table/TableMapLayout";
import { FieldMapLayout } from "./Field/FieldMapLayout";
import "./MappingLayout.css";

export const MappingLayout: FC = () => {
  return (
    <div className="mapping-layout">
      <Navbar />
      <div className="content-container">
        <Routes>
          <Route index element={<TableMapLayout />} />
          <Route path="link-fields" element={<FieldMapLayout />} />
        </Routes>
      </div>
    </div>
  );
};
