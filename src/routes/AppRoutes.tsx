import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardPage } from '../views/Dashboard/DashboardPage';
import { DroneSurveyListing } from '../views/DroneSurvey/DroneSurveyListing';
import { NSVDetailsPage } from '../views/NSVDetails/NSVDetailsPage';
import { LaneSchedulerPage } from '../views/LaneScheduler/LaneSchedulerPage';
import { DPRPage } from '../views/DPR/DPRPage';
import { ProgressReportPage } from '../views/ProgressReport/ProgressReportPage';
import { LoginPage } from '../views/Auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Main App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/survey" element={<DroneSurveyListing />} />
        <Route path="/scheduler" element={<LaneSchedulerPage />} />
        <Route path="/nsv/:roadCode" element={<NSVDetailsPage />} />
        <Route path="/dpr/:roadCode" element={<DPRPage />} />
        <Route path="/dpr" element={<Navigate to="/dpr/MAR-1111" replace />} />
        <Route path="/progress" element={<ProgressReportPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
